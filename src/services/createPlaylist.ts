import { google } from "googleapis";
import addVideosToPlaylist from "./addVideosToPlaylist";

interface CreatePlaylistData {
  auth: any;
  newItems: string;
  customPlaylistId?: string;
}

async function createPlaylist({
  auth,
  newItems,
  customPlaylistId,
}: CreatePlaylistData): Promise<string> {
  const youtube: any = google.youtube({ version: "v3", auth });

  try {
    let playlistId: string;
    let videoIds: string[] = JSON.parse(newItems);

    if (customPlaylistId) {
      playlistId = customPlaylistId;
      console.log("Using custom playlist ID:", playlistId);

      const getPlaylistData = async (): Promise<string[]> => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/playlists/${playlistId}`
          );

          if (!response.ok) {
            throw new Error(
              `API request failed with status ${response.status}`
            );
          }

          const data = await response.json();
          const allIDs = data.allItems.map((item: any) => item.id);

          videoIds = videoIds.filter((videoId) => !allIDs.includes(videoId));
          return videoIds;
        } catch (error) {
          console.error("Error fetching playlist data:", error);
          return [];
        }
      };

      videoIds = await getPlaylistData();
    } else {
      const res = youtube.playlists.insert({
        part: ["snippet,status"],
        resource: {
          snippet: {
            title: "Música",
            description: "Descripción",
            tags: ["Music"],
            defaultLanguage: "es_MX",
          },
          status: {
            privacyStatus: "unlisted",
          },
        },
      });

      playlistId = res.data.id;
      console.log("Playlist created:", playlistId);
    }

    await addVideosToPlaylist(auth, playlistId, videoIds);

    return playlistId;
  } catch (err) {
    console.error("Error creating playlist:", err);
    throw err;
  }
}

export default createPlaylist;
