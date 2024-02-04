import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoId } = req.query;

  if (typeof videoId !== "string") {
    return res.status(400).json({ error: "Invalid videoId" });
  }

  try {
    let nextPageToken = null;
    let allItems: any[] = [];

    do {
      const response: any = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(
          `YouTube API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      // console.log("data items: ", data.items);

      allItems = allItems.concat(
        data.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          allowed: item.contentDetails.regionRestriction.allowed,
          blocked: item.contentDetails.regionRestriction.blocked
        }))
      );

      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    res.status(200).json({ allItems });
  } catch (error) {
    console.error("Error fetching YouTube playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
