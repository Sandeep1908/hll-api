import express from "express";
import cors from "cors";
import "dotenv/config";
// import { genPDF } from './helper/gen-pdf';
import { putLog } from "./utils/gpt.js";
import {
  sendPaymentLink,
  sendPaymentEmail,
  initiatePaymentPraxis,
} from "./utils/pay.js";
import {
  sendPaymentLink as sendPaymentLink2,
  initiatePaymentPraxis as initiatePaymentPraxis2,
} from "./utils/pay2.js";
import {
  sendPaymentLink as sendPaymentLink3,
  initiatePaymentPraxis as initiatePaymentPraxis3,
} from "./utils/pay3.js";
import {
  sendPaymentLink as sendPaymentLink4,
  initiatePaymentPraxis as initiatePaymentPraxis4,
} from "./utils/pay4.js";
import { sendPaymentLink as sendPaymentLink5 } from "./utils/pay5.js";
import { sendPaymentLink as sendPaymentLink6 } from "./utils/pay6.js";
import { sendPaymentLink as sendPaymentLink7 } from "./utils/pay7.js";
import { sendPaymentLink as sendPaymentLink8 } from "./utils/pay8.js";
import { sendPaymentLink as sendPaymentLink9 } from "./utils/pay9.js";
import { sendPaymentLink as sendPaymentLink10 } from "./utils/pay10.js";
import { sendPaymentLink11 } from "./utils/pay11.js";
import { sendPaymentLink as sendPaymentLink12 } from "./utils/pay12.js";
import { sendPaymentLink as sendPaymentLink13 } from "./utils/pay13.js";
import { sendPaymentLink as sendPaymentLink14 } from "./utils/pay14.js";






const app = express();

// Apply middlware for CORS and JSON endpoing
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

//app.get('/send-report', (req, res) => {
// genPDF(req, res)
//});

//app.post('/getAICompletion', (req, res) => {
// getCompletion(req, res)
//});

app.post("/log", putLog);
app.post("/make-pay", sendPaymentLink);
app.post("/initiate-payment", sendPaymentLink);
app.post("/initiate-payment-2", sendPaymentLink2);
app.post("/initiate-payment-3", sendPaymentLink3);
app.post("/initiate-payment-4", sendPaymentLink4);
app.post("/initiate-payment-5", sendPaymentLink5);
app.post("/initiate-payment-6", sendPaymentLink6);
app.post("/initiate-payment-7", sendPaymentLink7);
app.post("/initiate-payment-8", sendPaymentLink8);
app.post("/initiate-payment-9", sendPaymentLink9);
app.post("/initiate-payment-10", sendPaymentLink10);
app.post("/initiate-payment-11", sendPaymentLink11);
app.post("/initiate-payment-12", sendPaymentLink12);
app.post("/initiate-payment-13", sendPaymentLink13);
app.post("/initiate-payment-14", sendPaymentLink14);





app.post("/initiate-payment-praxis", initiatePaymentPraxis);
app.post("/initiate-payment-praxis-2", initiatePaymentPraxis2);
app.post("/initiate-payment-praxis-3", initiatePaymentPraxis3);
app.post("/initiate-payment-praxis-4", initiatePaymentPraxis4);
// app.get('/network-gateway-code', getNetworkGatewayCode)
app.get("/makePayment", (req, res) =>
  res.sendFile(__dirname + "/static/send-pay.html")
);

app.post("/notification", (req, res) => {
  console.log("notification", req.body);
  const notification = req.body;
  const response = {
    timestamp: notification.timestamp,
    version: notification.version,
    status: 0,
    description: "ok",
    // description: oinotiofication.transaction.transaction_status === 'accepted'? 'ok' : notification.transaction.status_details
  };
  console.log(response);
  res.json(response);
});

app.listen(process.env.PORT, () =>
  console.log("Example app listening on port", process.env.PORT)
);
