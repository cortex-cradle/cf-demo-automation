import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const secret = process.env.WEBHOOK_SECRET;

  // validate secret
  const signature = req.headers["x-webhook-signature"];
  if (!signature || signature !== secret) {
    return res.status(401).json({ error: "Invalid Signature" });
  }

  const event = req.body;
  const order = event?.data?.order;
  const customer = event?.data?.customer_details;

  if (!order || !customer) {
    return res.status(400).json({ error: "Invalid Payload" });
  }

  if (order.order_status !== "PAID") {
    return res.status(200).json({ status: "Ignored" });
  }

  const userEmail = customer.customer_email;

  try {
    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: "Your Ebook Download",
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Click below to download your ebook:</p>
        <a href="${process.env.PDF_URL}">Download Ebook</a>
      `
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Mail Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
