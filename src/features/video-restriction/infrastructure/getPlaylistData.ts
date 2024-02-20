import { Video } from "../business/types";

const getPlaylistData = async (playlistId: string): Promise<Video[]> => {
  const response = await fetch(`/api/playlists/${playlistId}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Could not fetch playlist data");
  }
  return data.allItems;
};

export default getPlaylistData;
