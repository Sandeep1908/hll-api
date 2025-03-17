import { PineconeClient } from "@pinecone-database/pinecone";
import {Readable} from "stream";
import {Configuration,OpenAIApi} from 'openai'
 
import fs from 'fs'

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const pinecone = new PineconeClient();

export const getCompletionL = async (req, res) => {
    const { messages, user } = req.body

    const newMessage = messages[messages.length - 1]
    const isNewConversation = messages.length === 1
    const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: newMessage.content
    });

    await pinecone.init({
        environment: "us-west4-gcp-free",
        apiKey: "c5a2c2f3-9686-4940-8a2a-f17cf8159f4a",
    });
    const index = pinecone.Index('messages')
    if (!isNewConversation) {
       const vectorSearchResult = await index.query({
            queryRequest: {
                vector: embeddingResponse.data?.data[0]?.embedding,
                filter: {
                    userId: user?.uid,
                    messageFrom: "user",
                },
                includeMetadata: true,
                topK: 10,
            }
        })

        if (vectorSearchResult.matches.length) {
            const systemMessage = `These are the references the user has talked about something similar already:
                        ${vectorSearchResult.matches.map(item => `"${item.metadata?.messageContent}"`).join('\n')}.
                        Use it accordingly as required for the next response, while acknowledging you remember it (if necessary).
                    `
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-16k",
                messages: [...messages, {
                    role: 'system',
                    content:systemMessage,
                }],
                temperature: 0.9,
            });
           return {
               error: null,
               result: response.data?.choices[0]?.message?.content,
           };

        }


        // return res.json({
        //     vectorSearchResult
        // })
    }
    // return res.json(embeddingResponse.data)

   await index.upsert({
        upsertRequest: {
            vectors: [{
                id: `${user.uid}:${new Date().getTime().toString()}:${Math.random().toString().slice(4, 10)}`,
                values: embeddingResponse.data?.data[0]?.embedding,
                metadata: {
                    userId: user?.uid,
                    messageContent: newMessage.content,
                    messageFrom: newMessage.role,
                }
            }]
        }
    })

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        messages: messages,
        temperature: 0.9,
    });

    return {
        error: null,
        result: response.data?.choices[0]?.message?.content,
    };





    // console.log(response.data)
    // res.json(response.data)
}
export const putLog = (req, res) => {
    console.log(req.body)
    fs.appendFileSync('/Users/devakumarnm/code/curopeers/debug.log', `${new Date().toLocaleString()}:${JSON.stringify(req.body)}\n`)
    res.send('ok')
}

export const getCompletion = async (req, res) => {
    const response = await openai.createChatCompletion(
        {
            model: "gpt-3.5-turbo",
            stream: true,
            messages:req.body.messages,
            temperature: 0.9,
        },
        {responseType: "stream"}
    );

    // @ts-ignore
    const readable = Readable.from(response.data);
    // readable.on("readable", () => {
    //     let chunk;
    //     while (null !== (chunk = readable.read())) {
    //         console.log(`read: ${chunk}`);
    //     }
    // });
    readable.pipe(res)
    console.timeEnd("chatCompletion");
}
