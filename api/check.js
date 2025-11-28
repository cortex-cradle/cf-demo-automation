import { getPaymentStatus } from "./webhook";

export default function handler(req, res) {
  const status = getPaymentStatus();
  res.status(200).json(status);
}
