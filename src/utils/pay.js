import axios from "axios";
import {BuildSignature} from "./gen-signature.js";

const prodAPIKey = process.env.APP_ENV === 'dev' ?
    'M2VjMjAwZWQtNzA2Zi00MTQ4LWJjOTUtNzhiODFkMjZjZjVjOjk5NjIzMWY0LTUxMGMtNGEzZi04ZWI1LWFiYTcxN2VjMmM2Mg==':
    'YmM4NjExMWItNTcwNi00MDk0LTkwOTItOGM2YjllYWIzN2I2OmEyZWY0YTEwLTg3NGMtNGZhNS05NzZlLTAxOGJkZjVkYTExYw=='

async function  createOrder(token, req, res) {
    const { amount, billingAddress, email } = req.body
    console.log({amount, billingAddress, email});
    // const outlet = "00774d79-cc56-47bc-b595-243627eada8a";
    const outlet = process.env.APP_ENV === 'dev' ?
      '6bafc2ae-3e7b-4c7c-b645-5ee9cf27af9f' :
        "00774d79-cc56-47bc-b595-243627eada8a";
    const orderUrl = process.env.APP_ENV === 'dev' ?
        `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${outlet}/orders`:
        `https://api-gateway.ngenius-payments.com/transactions/outlets/${outlet}/orders`;
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
    // const apiKey = ;
    const tokenUrl =  process.env.APP_ENV === 'dev' ?
        "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token":
        "https://api-gateway.ngenius-payments.com/identity/auth/access-token";
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
        "merchant_id": "API-bigmofx",
        "application_key": "bigmofx.com",
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
        "notification_url": "https://yf6n30lp12.execute-api.ap-south-1.amazonaws.com/notification",
        "return_url": "https://bigmo.in/payment.html",
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


