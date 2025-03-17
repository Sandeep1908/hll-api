// Scholar Edu

import axios from "axios";
// prod
const prodAPIKey =
  "MzBhNzkyZTUtYTRlOC00NTVjLTk0NzUtYWU0OTRmNDc2YjIzOmViOGIxNzFhLTgzZTctNGEyMy1hZjBlLTEwYTg5ZGZkZjA0MQ==";

// const prodAPIKey =
//   "YmM0M2M3MWMtMjM5NC00MTBlLTg2OWMtYjA2ZWIzZDUxZGVhOmJhZThhYzFlLTUwZTgtNDA2OS1iODBjLWUyMzFjYjE5ZWE2Mg==";

async function createOrder(token, req, res) {
  const { amount, billingAddress, email } = req.body;
  console.log({ amount, billingAddress, email });
  // prod
  const outlet = "95013072-3d02-4032-a098-a01f0f69bc79";
  // const outlet = "3602f04e-75dc-4c6d-a3e1-64b793f52b92";
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

export const sendPaymentLink = async (req, res) => {
  console.log(req.body);
  // const apiKey = "MTI5ODNlYTAtNTNhZC00ODY3LWEwZWEtODBjMmJmMDUwMDhhOjUxYjNmZTkyLWU5YjgtNGE4MC04ODk5LTE2MTNhNWU5MDIzMw==";
  // const apiKey = "M2VjMjAwZWQtNzA2Zi00MTQ4LWJjOTUtNzhiODFkMjZjZjVjOjk5NjIzMWY0LTUxMGMtNGEzZi04ZWI1LWFiYTcxN2VjMmM2Mg==";
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
  console.log(_res.data.access_token);
  await createOrder(_res.data.access_token, req, res);
};
