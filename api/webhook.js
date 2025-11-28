import getRawBody from "raw-body";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false,   // important
  },
};

export default async function handler(req, res) {
  try {
    const rawBody = await getRawBody(req);
    const data = JSON.parse(rawBody.toString());

    // Signature verify
    const signature = req.headers["x-webhook-signature"];
    if (!signature || signature !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const order = data?.data?.order;
    const customer = data?.data?.customer_details;

    if (!order || !customer) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    if (order.order_status !== "PAID") {
      return res.status(200).json({ ignored: true });
    }

    const userEmail = customer.customer_email;

    // Gmail mail transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: "Your Download Link",
      html: `
        <h2>Thank you for purchasing!</h2>
        <p>Your download link:</p>
        <a href="${process.env.PDF_URL}">Click to Download</a>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
