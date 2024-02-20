import { Video } from "../business/types";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API;

const fetchPlaylistData = async (playlistId: string): Promise<Video[]> => {
  let nextPageToken = null;
  let allItems: Video[] = [];

  do {
    const response: any = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50${
        nextPageToken ? `&pageToken=${nextPageToken}` : ""
      }`
    );

    if (!response.ok) {
      throw new Error(
        `YouTube API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    allItems = allItems.concat(
      data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        channel: item.snippet.videoOwnerChannelTitle,
      }))
    );

    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return allItems;
};

export default fetchPlaylistData;
