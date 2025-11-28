import { getToken } from "./webhook";

export default function handler(req, res) {
  const userToken = req.query.token;
  const savedToken = getToken();

  if (userToken && savedToken && userToken === savedToken) {
    return res.status(200).json({ valid: true });
  }

  return res.status(200).json({ valid: false });
}
