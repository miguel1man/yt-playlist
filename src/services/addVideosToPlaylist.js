const { google } = require("googleapis");

async function addVideosToPlaylist(auth, playlistId, videoIds) {
  const youtube = google.youtube({
    version: "v3",
    auth,
  });

  console.log(`Adding ${videoIds.length} videos to playlist.`);
  let failedItems = 0;

  for (const videoId of videoIds) {
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
      console.log(`Video added: ${videoId}`);
    } catch (err) {
      console.error("Error:", videoId);
      failedItems++;
    }
  }

  console.log(
    `${videoIds.length - failedItems} video(s) added to playlist successfully.`
  );
  failedItems && console.log(`${failedItems} video(s) failed.`);
}

module.exports = addVideosToPlaylist;
