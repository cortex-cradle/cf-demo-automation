import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  const orderId = req.query.id;

  if (!orderId) {
    return res.status(400).json({ paid: false });
  }

  try {
    const filePath = path.join(process.cwd(), "payment.json");
    const data = JSON.parse(readFileSync(filePath, "utf8"));

    if (data[orderId] === "PAID") {
      return res.status(200).json({ paid: true });
    } else {
      return res.status(200).json({ paid: false });
    }

  } catch (err) {
    return res.status(200).json({ paid: false });
  }
}
