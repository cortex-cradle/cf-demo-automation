import { latestToken } from "./webhook";

export default function handler(req, res) {
  const token = req.query.token;

  if (token && token === latestToken) {
    return res.status(200).json({ valid: true });
  }

  return res.status(200).json({ valid: false });
}
