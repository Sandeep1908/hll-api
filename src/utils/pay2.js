import axios from "axios";
import {BuildSignature} from "./gen-signature-fiscal.js";

const prodAPIKey = 'MTcxZGVhY2EtMTMxNi00OTJkLWI0ZjQtYjQ3MjU3NjJiNGRjOjk5ZmU1YzBkLTUxZDAtNDAxNy1iZjM2LTJjZmY3MDliYWU1Mw=='


async function  createOrder(token, req, res) {
    const { amount, billingAddress, email } = req.body
    console.log({amount, billingAddress, email});
    const outlet = "9ec58495-b031-4f3c-9c04-129ba5b8cf48";
    // const outlet = "5f11e007-ffdd-41d7-9e1e-4ae21f4f9207";
    const orderUrl = `https://api-gateway.ngenius-payments.com/transactions/outlets/${outlet}/orders`;
    // const orderUrl = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${outlet}/orders`;
    const postData = {
        action: "PURCHASE",
        amount: {
            currencyCode: "AED",
            value: Number(amount) * 100
        },
        emailAddress: email,
        billingAddress,
    };

    const headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "application/vnd.ni-payment.v2+json",
        "Accept": "application/vnd.ni-payment.v2+json"
    };
    try {
        const response = await axios.post(orderUrl, postData, { headers });
        const output = response.data;
        const order_reference = output.reference;
        const order_paypage_url = output._links.payment.href;
        return res.json({
            order_reference,
            order_paypage_url,
        })
    } catch (error) {
        console.log(error?.response?.data)
        console.error("Error:", error.message);
    }
}



export const sendPaymentLink = async (req, res) => {
    console.log(req.body);
    // const apiKey = "MTI5ODNlYTAtNTNhZC00ODY3LWEwZWEtODBjMmJmMDUwMDhhOjUxYjNmZTkyLWU5YjgtNGE4MC04ODk5LTE2MTNhNWU5MDIzMw==";
    // const apiKey = "M2VjMjAwZWQtNzA2Zi00MTQ4LWJjOTUtNzhiODFkMjZjZjVjOjk5NjIzMWY0LTUxMGMtNGEzZi04ZWI1LWFiYTcxN2VjMmM2Mg==";
    const tokenUrl = "https://api-gateway.ngenius-payments.com/identity/auth/access-token";
    // const tokenUrl = "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token";

    const headers = {
        "accept": "application/vnd.ni-identity.v1+json",
        "authorization": "Basic " + prodAPIKey,
        "content-type": "application/vnd.ni-identity.v1+json"
    };

    const _res = await axios.post(tokenUrl, {}, { headers })
    console.log(_res.data.access_token);
    await createOrder(_res.data.access_token, req, res)

}

export const sendPaymentEmail = (req, res) => {
    const { amount, email } = req.body


}



export const initiatePaymentPraxis = async (req, res) => {
    const { email } = req.query

    const bs = new BuildSignature(email, email, 1000)
    const rq = bs._GET_SAMPLE_DATA_TO_SEND_REQUEST_()
    const signature = BuildSignature.getGtAuthenticationHeader(rq)
    const paymentRes = await axios.post('https://gw.praxisgate.com/cashier/cashier', {
        "merchant_id": "API-fiscalforex",
        "application_key": "fiscalforex.com",
        "intent": "payment",
        "currency": "USD",
        "customer_data": {
            "country": "AE",
            "first_name": `_${email}`,
            "last_name": `_${email}`,
            "email": email,
        },
        "cid": email,
        "locale": "en-GB",
        "notification_url": "https://s38a6wplm5.execute-api.ap-south-1.amazonaws.com/notification",
        // "notification_url": "https://0cb2-2406-7400-9f-5084-71ed-71e2-dc96-c9ac.ngrok-free.app/notification",
        "return_url": "https://fiscalforex.com",
        "order_id": rq.order_id,
        "version": "1.3",
        "timestamp": rq.timestamp,
    }, {
        headers: {
            'GT-Authentication': signature,
        }
    })
    console.log(paymentRes.data)
    res.send(paymentRes.data?.redirect_url)

}


