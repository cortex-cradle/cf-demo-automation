import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const event = req.body;

    // If payment is PAID
    if (event?.data?.order?.order_status === "PAID") {

      // write download redirect link
      const data = {
        paid: true,
        url: "https://bookmintor.shop/PremAnand%20Ji%E2%80%99s%20Zero-Disturbance%20Mindset%20Code?payment_status=success&secret_key=EBOOK_SECRET_OK"
      };

      const filePath = path.join(process.cwd(), "payment.json");
      fs.writeFileSync(filePath, JSON.stringify(data));

      console.log("Payment saved:", data);
    }

    return res.status(200).json({ message: "OK" });

  } catch (e) {
    console.log("Webhook Error:", e);
    return res.status(500).json({ error: "Webhook failed" });
  }
}
