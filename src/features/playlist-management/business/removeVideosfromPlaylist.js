const { google } = require("googleapis");

async function removeVideosfromPlaylist(auth, newItems, customPlaylistId) {
  try {
    let playlistId;
    let videoIds = JSON.parse(newItems);

    playlistId = customPlaylistId;
    // console.log("Using custom playlist ID:", playlistId);

    async function deleteVideos(auth, playlistId, videoIds) {
      const youtube = google.youtube({
        version: "v3",
        auth,
      });

      console.info(`Removing ${videoIds.length} videos from playlist.`);
      let failedItems = 0;
      let countIds = 0;

      for (const videoId of videoIds) {
        countIds++;
        try {
          const playlistItemResponse = await youtube.playlistItems.list({
            part: ["id"],
            playlistId: playlistId,
            videoId: videoId,
          });
          // console.log("playlistItem response:", playlistItemResponse.data.items);

          const playlistItemId = playlistItemResponse.data.items[0].id;

          await youtube.playlistItems.delete({
            id: playlistItemId,
          });
          console.log(`Removed ${countIds} of ${videoIds.length}: ${videoId}`);
        } catch (err) {
          console.error(`Error ${countIds} of ${videoIds.length}: ${videoId}`);
          if (
            err.response &&
            err.response.data &&
            err.response.data.error_description ===
              "Token has been expired or revoked."
          ) {
            console.error(`Error: ${err.response.data.error_description}`);
          } else {
            console.error("Error:", err);
          }
          failedItems++;
        }
      }

      console.info(
        `${
          videoIds.length - failedItems
        } video(s) removed from playlist successfully.`
      );
      failedItems && console.warn(`${failedItems} video(s) failed.`);
    }

    await deleteVideos(auth, playlistId, videoIds);

    return playlistId;
  } catch (err) {
    console.error("Error removing videos:", err);
    throw err;
  }
}

module.exports = removeVideosfromPlaylist;
