import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log("Api key:", API_KEY);
  const { playlistId } = req.query;

  if (typeof playlistId !== "string") {
    return res.status(400).json({ error: "Invalid playlistId" });
  }

  try {
    let nextPageToken = null;
    let allItems: any[] = [];

    do {
      // const response: any = await fetch(
      //   `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50${
      //     nextPageToken ? `&pageToken=${nextPageToken}` : ""
      //   }`
      // );
      const response: any = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=X59TlszGtfM&part=snippet,contentDetails,player,statistics,status&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(
          `YouTube API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      console.log("data items: ", data.items);
      console.log(
        "regionRestriction: ",
        data.items[0].contentDetails.regionRestriction
      );

      allItems = allItems.concat(
        data.items.map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          channel: item.snippet.videoOwnerChannelTitle,
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