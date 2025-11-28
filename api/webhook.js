import crypto from "crypto";

let lastSuccessToken = null;  // Stores latest success token (in memory)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const event = req.body;

    console.log("Webhook Received:", event);

    const orderStatus = event?.data?.order?.order_status;

    if (orderStatus === "PAID") {
      // Generate secure token
      lastSuccessToken = crypto.randomBytes(16).toString("hex");

      console.log("Generated Token:", lastSuccessToken);

      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ ignored: true });

  } catch (e) {
    console.error("Webhook Error:", e);
    return res.status(500).json({ error: "Server Error" });
  }
}

export function getToken() {
  return lastSuccessToken;
}
