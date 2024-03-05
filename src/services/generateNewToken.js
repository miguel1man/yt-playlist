const { google } = require("googleapis");
const fs = require("fs").promises;
const readline = require("readline");

// Put Ids and execute `node src\services\generateNewToken.js`
CLIENT_ID = "";
CLIENT_SECRET = "";
REDIRECTION_URI = "";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECTION_URI
);

async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/youtube.force-ssl",
  });
  console.log("Authorize this app by visiting this url:", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise((resolve) => {
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      resolve(code);
    });
  });

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await fs.writeFile("token.json", JSON.stringify(tokens));
    console.log("Token stored to", "token.json");
    createPlaylist(oAuth2Client);
  } catch (err) {
    console.error("Error retrieving access token", err);
  }
}

async function addVideosToPlaylist(auth, playlistId, videoIds) {
  const youtube = google.youtube({
    version: "v3",
    auth,
  });

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
      console.log("Video added to playlist successfully.");
    } catch (err) {
      console.error("Error adding video to playlist:", err.message);
    }
  }
}

async function createPlaylist(auth) {
  const youtube = google.youtube({
    version: "v3",
    auth,
  });

  try {
    const res = await youtube.playlists.insert({
      part: ["snippet,status"],
      resource: {
        snippet: {
          title: "API-TEST",
          description: "Playlist",
          tags: ["Music"],
          defaultLanguage: "es_MX",
        },
        status: {
          privacyStatus: "unlisted",
        },
      },
    });

    const playlistId = res.data.id;
    console.log("Playlist created successfully. Playlist ID:", playlistId);

    const videoIds = ["ny3qvC5msVo"];
    await addVideosToPlaylist(auth, playlistId, videoIds);
  } catch (err) {
    console.error("Error creating playlist:", err);
  }
}

fs.readFile("token.json")
  .then((token) => JSON.parse(token))
  .then((parsedToken) => {
    oAuth2Client.setCredentials(parsedToken);
    return createPlaylist(oAuth2Client);
  })
  .catch((err) => getAccessToken(oAuth2Client));
