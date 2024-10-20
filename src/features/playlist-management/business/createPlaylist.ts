import { google } from "googleapis";
import addVideosToPlaylist from "./addVideosToPlaylist";
import { CreatePlaylistData } from "./types";

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
      console.log("Using custom playlist ID to createPlaylist:", playlistId);

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
          console.error(
            "Error fetching playlist data function createPlaylist:",
            error
          );
          return [];
        }
      };

      videoIds = await getPlaylistData();
    } else {
      const res = await youtube.playlists.insert({
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
  } catch (err: any) {
    if (
      err.response.data.error_description ===
      "Token has been expired or revoked."
    ) {
      console.log(
        "Error err.response.data.error_description:\n",
        err.response.data.error_description
      );
    } else {
      if (err.response && err.response.data && err.response.data.error) {
        const errors = err.response.data.error.errors;
        console.error("Quota exceeded error:", errors);
        if (errors.some((e: any) => e.reason === "quotaExceeded")) {
          console.error("Quota exceeded error:", errors);
          throw new Error("Error quota exceeded error");
        }
      }
      if (err.errors && err.errors.reason) {
        console.error(err.errors.reason);
      } else throw new Error(`Error at function createPlaylist: ${err}`);
    }
    throw new Error(`Playlist not created: ${err}`);
  }
}

export default createPlaylist;
