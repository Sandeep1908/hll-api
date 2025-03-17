// Scholar Edu

import axios from "axios";
// prod
const prodAPIKey =
  "ZTMyZDkwMzYtMGRiMS00ZjhlLThjOTItMjE4NmNhYWRmZjMzOjRkOTgzN2JiLTc0YTctNDk0MC1iNmI0LTliZDkzYWU0YTUwYw==";

// const prodAPIKey =
//   "YmM0M2M3MWMtMjM5NC00MTBlLTg2OWMtYjA2ZWIzZDUxZGVhOmJhZThhYzFlLTUwZTgtNDA2OS1iODBjLWUyMzFjYjE5ZWE2Mg==";

async function createOrder(token, req, res) {
  const { amount, billingAddress, email } = req.body;
  console.log({ amount, billingAddress, email });
  // prod
  const outlet = "a5a766f1-97f3-442e-925c-7b334999fdc3";
 
  const orderUrl = `https://api-gateway.ngenius-payments.com/transactions/outlets/${outlet}/orders`;
  // const orderUrl = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${outlet}/orders`;
  const postData = {
    action: "PURCHASE",
    amount: {
      currencyCode: "AED",
      value: Number(amount) * 100,
    },
    emailAddress: email,
    billingAddress,
  };

  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "application/vnd.ni-payment.v2+json",
    Accept: "application/vnd.ni-payment.v2+json",
  };
  try {
    const response = await axios.post(orderUrl, postData, { headers });
    const output = response.data;
    const order_reference = output.reference;
    const order_paypage_url = output._links.payment.href;
    return res.json({
      order_reference,
      order_paypage_url,
    });
  } catch (error) {
    console.log(error?.response?.data);
    console.error("Error:", error.message);
  }
}
 export const sendPaymentLink11 = async (req, res) => {
  console.log("inside payment");
  // console.log(req.body);
  const token="YzBhMzA2MDQtMTM2ZS00YzUzLTk4MTEtYmFmYjE3ZjFmZjI1OmFkN2M1MWI2LTVhNGUtNDgyNC04MmZjLTNjNjc0YmQzYjBiZQ=="
   
  const tokenUrl =
    "https://api-gateway.ngenius-payments.com/identity/auth/access-token";
  // const tokenUrl =
  //   "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token";

  const headers = {
    accept: "application/vnd.ni-identity.v1+json",
    authorization: "Basic " + prodAPIKey,
    "content-type": "application/vnd.ni-identity.v1+json",
  };

  const _res = await axios.post(tokenUrl, {}, { headers });
  // console.log(_res.data.access_token);
  await createOrder(_res.data.access_token, req, res);
};


 