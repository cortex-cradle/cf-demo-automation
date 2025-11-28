import crypto from "crypto";

let latestToken = null;

export default async function handler(req, res) {
  try {
    const body = await getRawBody(req).then(b => JSON.parse(b.toString()));

    const signature = req.headers["x-webhook-signature"];
    if (!signature || signature !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const status = body?.data?.order?.order_status;

    if (status === "PAID") {
      latestToken = crypto.randomBytes(16).toString("hex");
      console.log("Payment Success — Token:", latestToken);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export const config = {
  api: { bodyParser: false }
};
