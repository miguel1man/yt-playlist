import { Video } from "../business/types";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API;

const fetchVideoRestrictionData = async (videoId: string): Promise<Video[]> => {
  let nextPageToken = null;
  let videoRestrictionData: any[] = [];
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
    // console.log(videoId, data);
    videoRestrictionData = videoRestrictionData.concat(
      data.items.map((item: any) => {
        const regionRestriction = item.contentDetails?.regionRestriction;
        return {
          id: item.id,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          allowed: regionRestriction ? regionRestriction.allowed : [],
          blocked: regionRestriction ? regionRestriction.blocked : [],
        };
      })
    );
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return videoRestrictionData;
};

export default fetchVideoRestrictionData;
