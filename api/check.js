import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "payment.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ paid: false, url: "" });
  }
}
