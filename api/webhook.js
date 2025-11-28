export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ message: "Webhook active" });
    }

    const event = req.body;

    console.log("Webhook received:", event);

    return res.status(200).json({
      success: true,
      message: "Webhook received successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server error" });
  }
}
