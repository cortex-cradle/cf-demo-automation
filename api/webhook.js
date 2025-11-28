import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const event = req.body;

    if (event.type === "PAYMENT_FORM_ORDER_WEBHOOK") {
        const orderId = event.data.order.order_id;
        const status = event.data.order.order_status;

        const file = path.join(process.cwd(), "paid.json");
        let db = {};

        if (fs.existsSync(file)) {
            db = JSON.parse(fs.readFileSync(file));
        }

        if (status === "PAID") {
            db[orderId] = true;
            fs.writeFileSync(file, JSON.stringify(db, null, 2));
        }
    }

    res.status(200).json({ ok: true });
}
