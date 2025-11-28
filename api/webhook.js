export const config = {
  api: {
    bodyParser: false,
  },
};

let latestPayment = {
  paid: false,
  url: null,
};

export default async function handler(req, res) {
  try {
    let body = "";
    await new Promise(resolve => {
      req.on("data", chunk => (body += chunk));
      req.on("end", resolve);
    });

    const data = JSON.parse(body);

    if (data?.data?.order?.order_status === "PAID") {
      console.log("PAYMENT SUCCESS!");

      latestPayment = {
        paid: true,
        url: "https://bookmintor.shop/PremAnand%20Ji%E2%80%99s%20Zero-Disturbance%20Mindset%20Code?payment_status=success&secret_key=EBOOK_SECRET_K3Y_V2P8Q6R4S7T9W1X5Z0"
      };
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).json({ error: "Webhook failed" });
  }
}

export function getPaymentStatus() {
  return latestPayment;
}
