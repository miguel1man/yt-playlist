const { google } = require("googleapis");

async function addVideosToPlaylist(auth, playlistId, videoIds) {
  const youtube = google.youtube({
    version: "v3",
    auth,
  });

  console.info(`Adding ${videoIds.length} videos to playlist.`);
  let failedItems = 0;
  let countIds = 0;

  for (const videoId of videoIds) {
    countIds++;
    try {
      await youtube.playlistItems.insert({
        part: ["snippet"],
        resource: {
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: videoId,
            },
          },
        },
      });
      console.log(`Added ${countIds} of ${videoIds.length}: ${videoId}`);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.error_description ===
          "Token has been expired or revoked."
      ) {
        console.error(
          `Error err.response.data.error_description: ${err.response.data.error_description}`
        );
      } else {
        console.error("Error function addVideosToPlaylist:", err);
      }
      console.error(`Failed ${countIds} of ${videoIds.length}: ${videoId}`);
      failedItems++;
    }
  }

  console.info(
    `${videoIds.length - failedItems} video(s) added to playlist successfully.`
  );
  failedItems && console.warn(`${failedItems} video(s) failed.`);
}

module.exports = addVideosToPlaylist;
