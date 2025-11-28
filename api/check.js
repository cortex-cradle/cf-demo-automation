import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const { order_id } = req.query;

    const file = path.join(process.cwd(), "paid.json");

    if (!fs.existsSync(file)) {
        return res.json({ paid: false });
    }

    const db = JSON.parse(fs.readFileSync(file));

    if (db[order_id]) {
        return res.json({ paid: true });
    }

    res.json({ paid: false });
}
