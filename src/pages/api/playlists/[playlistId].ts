import { NextApiRequest, NextApiResponse } from "next";
import fetchPlaylistData from "../../../features/video-restriction/infrastructure/fetchPlaylistData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { playlistId } = req.query;
  // console.log("playlistId:", playlistId);

  if (typeof playlistId !== "string") {
    return res.status(400).json({ error: "Invalid playlistId" });
  }

  try {
    const allItems = await fetchPlaylistData(playlistId);

    res.status(200).json({ allItems });
  } catch (error) {
    console.error(
      "Error fetchPlaylistData api/playlist/[playlistId].ts:",
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
}
