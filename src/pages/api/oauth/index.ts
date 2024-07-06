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
    storageToken(code);
    res.status(201).json({ code: code });
  } catch (error) {
    console.error("Error fetchPlaylistData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// TODO: redirección al terminar la generación de token
