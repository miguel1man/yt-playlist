import { BlockedVideo } from "../domain/types";

const getVideoRestrictionData = async (
  videoId: string
): Promise<BlockedVideo[]> => {
  console.log(
    "video-restriction/api/getVideoRestrictionData.ts videoId",
    videoId
  );
  const response = await fetch(`/api/videos/${videoId}`);
  const data = await response.json();
  console.log("video-restriction/api/getVideoRestrictionData.ts data", data);
  if (!response.ok) {
    throw new Error(data.message || "Could not fetch video restriction data");
  }
  return data.allItems;
};

export default getVideoRestrictionData;
