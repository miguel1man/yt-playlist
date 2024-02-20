import { NextApiRequest, NextApiResponse } from "next";
import fetchVideoRestrictionData from "../../../features/video-restriction/infrastructure/fetchVideoRestrictionData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoId } = req.query;

  if (typeof videoId !== "string") {
    return res.status(400).json({ error: "Invalid videoId" });
  }

  try {
    const allItems = await fetchVideoRestrictionData(videoId);

    res.status(200).json({ allItems });
  } catch (error) {
    console.error("Error fetching YouTube playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
