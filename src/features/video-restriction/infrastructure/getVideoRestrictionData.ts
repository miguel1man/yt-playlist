import { BlockedVideo } from "../business/types";

const getVideoRestrictionData = async (
  videoId: string
): Promise<BlockedVideo[]> => {
  const response = await fetch(`/api/videos/${videoId}`);
  const data = await response.json();
  console.log(videoId, data);
  if (!response.ok) {
    throw new Error(data.message || "Could not fetch video restriction data");
  }
  return data.allItems;
};

export default getVideoRestrictionData;
