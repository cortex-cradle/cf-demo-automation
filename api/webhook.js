import { writeFileSync, readFileSync } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: true
  }
};

export default async function handler(req, res) {
  try {
    const body = req.body;

    // Cashfree payment form ka event type
    if (!body || body.type !== "PAYMENT_FORM_ORDER_WEBHOOK") {
      return res.status(400).json({ message: "Invalid Webhook" });
    }

    const orderId = body.data.order.order_id;
    const status = body.data.order.order_status;

    const filePath = path.join(process.cwd(), "payment.json");

    let data = {};
    try {
      data = JSON.parse(readFileSync(filePath, "utf8"));
    } catch (err) {}

    // Save payment status
    data[orderId] = status;

    writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("Saved:", data);

    return res.status(200).json({ success: true });

  } catch (err) {
    console.log("Webhook Error:", err);
    return res.status(500).json({ error: "Webhook Failed" });
  }
}
