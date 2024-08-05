import { PlaylistId } from "./types";

const extractIdFromPlaylist = (input: string): PlaylistId | null => {
  try {
    // Check if the input is already a playlist ID
    if (/^[A-Za-z0-9_-]+$/.test(input)) {
      return input;
    }

    // Try to extract the ID from a URL
    let url: URL;
    try {
      url = new URL(input);
    } catch {
      // If the input is not a valid URL, try prepending 'https://'
      url = new URL(`https://${input}`);
    }

    const listId = url.searchParams.get("list");
    if (listId) {
      return listId;
    }

    // Check if the ID is in the pathname (e.g., youtube.com/playlist?list=PLAYLIST_ID)
    const pathParts = url.pathname.split("/");
    const playlistIndex = pathParts.indexOf("playlist");
    if (playlistIndex !== -1 && pathParts[playlistIndex + 1]) {
      return pathParts[playlistIndex + 1];
    }

    throw new Error("Invalid input: Unable to extract playlist ID.");
  } catch (error) {
    console.error("Error extracting playlist ID:", error);
    return null;
  }
};

export default extractIdFromPlaylist;
