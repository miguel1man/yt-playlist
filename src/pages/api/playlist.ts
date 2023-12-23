import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { playlistId } = req.query;

  if (typeof playlistId !== "string") {
    return res.status(400).json({ error: "Invalid playlistId" });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(
        `YouTube API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    const items = data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
    }));

    res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching YouTube playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
