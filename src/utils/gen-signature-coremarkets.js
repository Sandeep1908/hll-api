import crypto from 'crypto'


export class BuildSignature {
    customerId = ''
    amount = 0
    constructor(customerId, amount) {
        this.customerId = customerId
        this.amount = amount
    }


    // Action to be taken within the cashier
    static INTENT_PAYMENT = 'payment';
    // Your Merchant Account ID
    static MERCHANT_ID = 'API-thecoremarkets';
    // Your Merchant Secret
    static MERCHANT_SECRET = 'lZG7Hg6gOA6krLRSMLyglQE6O6YsFDlO';
    // Your Application Key
    static APPLICATION_KEY = 'thecoremarkets.com';
    // Your API Version
    static API_VERSION = '1.3';

      _GET_SAMPLE_DATA_TO_SEND_REQUEST_() {
        return {
            cid: this.customerId,
            application_key: BuildSignature.APPLICATION_KEY,
            merchant_id: BuildSignature.MERCHANT_ID,
            intent: BuildSignature.INTENT_PAYMENT,
            order_id: BuildSignature.getOrderID(),
            timestamp: BuildSignature.getCurrentTimestamp(),
            version: BuildSignature.API_VERSION,
            amount: this.amount,
        };
    }

    // Cashier API 1.3
    static getRequestSignatureList() {
        return [
            'merchant_id',
            'application_key',
            'timestamp',
            'intent',
            'cid',
            'order_id',
        ];
    }

    static getConcatenatedString(data) {
        let concatenated_string = '';
        const signatureList = BuildSignature.getRequestSignatureList();
        for (const key of signatureList) {
            if (data.hasOwnProperty(key) && data[key] !== null) {
                concatenated_string += data[key];
            }
        }

        return concatenated_string;
    }

    static getGtAuthenticationHeader(request) {
        // Sort request object by keys alphabetically
        const concatenated_string = BuildSignature.getConcatenatedString(request);

        // Concatenate Merchant Secret Key with response params
        const secretWithParams = concatenated_string + BuildSignature.MERCHANT_SECRET;

        // Generate HASH of concatenated string
        const signature = BuildSignature.generateSignature(secretWithParams);
        return signature;
    }

    static generateSignature(input) {
        const hashtext = crypto.createHash('sha384').update(input).digest('hex');
        return hashtext;
    }

    static exportArrayToJSON(input) {
        const json_string = JSON.stringify(input);
        return json_string;
    }

    static getOrderID() {
        return 'order_' + Math.floor(Math.random() * (100000 - 100) + 100);
    }

    static getCurrentTimestamp() {
        return Math.floor(Date.now() / 1000);
    }

    // static async _TEST_() {
    //     console.log("=== TESTING REQUEST TO BE SENT ====");
    //     const requestToSend = BuildSignature._GET_SAMPLE_DATA_TO_SEND_REQUEST_();
    //     const gtAuthenticationHeader = BuildSignature.getGtAuthenticationHeader(requestToSend);
    //     const requestToSendJSONString = BuildSignature.exportArrayToJSON(requestToSend);
    //
    //     console.log("== GT-Authentication header in the request:");
    //     console.log(gtAuthenticationHeader);
    //     console.log("== data to send:");
    //     console.log(requestToSendJSONString);
    // }
}



