import { PlaylistId } from "./types";

const extractIdFromPlaylist = (url: string): PlaylistId => {
  try {
    const urlParams = new URLSearchParams(new URL(url).search);
    const listId = urlParams.get("list");
    if (!listId) {
      throw new Error("Invalid URL: Missing 'list' parameter.");
    }
    return listId;
  } catch (error) {
    console.error("Error extracting playlist ID:", error);
    throw error;
  }
};

export default extractIdFromPlaylist;
