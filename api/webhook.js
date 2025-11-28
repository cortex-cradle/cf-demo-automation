import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    // Read raw body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString();

    // Parse JSON
    const data = JSON.parse(rawBody);

    // Validate secret
    const signature = req.headers["x-webhook-signature"];
    if (!signature || signature !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Invalid Signature" });
    }

    // Payment Data
    const order = data?.data?.order;
    const customer = data?.data?.customer_details;

    if (!order || !customer) {
      return res.status(400).json({ error: "Invalid Payload" });
    }

    if (order.order_status !== "PAID") {
      return res.status(200).json({ ignored: true });
    }

    const userEmail = customer.customer_email;

    // Send Mail
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
      subject: "Your Ebook Download",
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Click below to download your ebook:</p>
        <a href="${process.env.PDF_URL}">Download Ebook</a>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
