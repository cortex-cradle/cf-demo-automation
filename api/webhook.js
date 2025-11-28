import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;
  console.log("WEBHOOK RECEIVED:", data);

  if (data?.data?.order?.order_status === "PAID") {
    const email = data.data.customer.customer_email;
    await sendEmail(email);
    return res.status(200).json({ status: "email sent" });
  }

  res.status(200).json({ status: "ignored" });
}

async function sendEmail(toEmail) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.GMAIL_EMAIL,
    to: toEmail,
    subject: "Your Demo Ebook",
    html: `<p>Thank you for your purchase!</p>
           <p>Download your file here:</p>
           <a href="https://drive.google.com/file/d/1s0Z4t7k0XYvow07JChpAkB9iwkI6jrRa/view?usp=drive_link">Download Now</a>`
  });

  console.log("Email sent to:", toEmail);
}
