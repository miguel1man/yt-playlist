import { NextApiRequest, NextApiResponse } from "next";
import storageToken from "../../../features/playlist-management/business/storageToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (typeof code !== "string") {
    return res.status(401).json({ error: "Invalid code" });
  }

  try {
    await storageToken(code);
    res.redirect(302, "/");
  } catch (error) {
    console.error("Error fetchPlaylistData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
