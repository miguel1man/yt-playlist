const { google } = require("googleapis");
const addVideosToPlaylist = require("./addVideosToPlaylist");

async function createPlaylist(auth, newItems, customPlaylistId) {
  const youtube = google.youtube({
    version: "v3",
    auth,
  });

  try {
    let playlistId;
    let videoIds = JSON.parse(newItems);

    if (customPlaylistId) {
      playlistId = customPlaylistId;
      // console.log("Using custom playlist ID:", playlistId);

      const getPlaylistData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/getPlaylistData?playlistId=${playlistId}`
          );

          if (!response.ok) {
            throw new Error(
              `API request failed with status ${response.status}`
            );
          }

          const data = await response.json();
          const allIDs = data.allItems.map((item) => item.id);

          videoIds = videoIds.filter((videoId) => !allIDs.includes(videoId));
          // console.log("IDs sin duplicados:", videoIds);
          return videoIds;
        } catch (error) {
          console.error("Error fetching playlist data:", error);
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
  } catch (err) {
    console.error("Error creating playlist:", err);
    throw err;
  }
}

module.exports = createPlaylist;
