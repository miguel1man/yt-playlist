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

      console.log(`Removing ${videoIds.length} videos to playlist.`);
      let failedItems = 0;

      for (const videoId of videoIds) {
        try {
          const playlistItemResponse = await youtube.playlistItems.list({
            part: ["id"],
            playlistId: playlistId,
            videoId: videoId,
          });
          // console.log("playlistItem Response:", playlistItemResponse);
          // console.log("item response:", playlistItemResponse.data.items);

          const playlistItemId = playlistItemResponse.data.items[0].id;

          await youtube.playlistItems.delete({
            id: playlistItemId,
          });
          console.log(`Removed: ${videoId}`);
        } catch (err) {
          console.error(`Error: ${videoId}`, err);
          failedItems++;
        }
      }

      console.log(
        `${
          videoIds.length - failedItems
        } video(s) removed from playlist successfully.`
      );
      failedItems && console.log(`${failedItems} video(s) failed.`);
    }

    await deleteVideos(auth, playlistId, videoIds);

    return playlistId;
  } catch (err) {
    console.error("Error removing videos:", err);
    throw err;
  }
}

module.exports = removeVideosfromPlaylist;
