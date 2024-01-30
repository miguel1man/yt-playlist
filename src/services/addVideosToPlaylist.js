const { google } = require("googleapis");

async function addVideosToPlaylist(auth, playlistId, videoIds) {
  const youtube = google.youtube({
    version: "v3",
    auth,
  });

  console.log(`Adding ${videoIds.length} videos to playlist.`);
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
      console.error(`Error ${countIds} of ${videoIds.length}: ${videoId}`);
      failedItems++;
    }
  }

  console.log(
    `${videoIds.length - failedItems} video(s) added to playlist successfully.`
  );
  failedItems && console.log(`${failedItems} video(s) failed.`);
}

module.exports = addVideosToPlaylist;
