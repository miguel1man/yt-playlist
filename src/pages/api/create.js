const { google } = require("googleapis");
const fs = require("fs").promises;
const readline = require("readline");

const credentials = require("../../services/credentials.json");

const oAuth2Client = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
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

    const playlistId = res.data.id;
    console.log("Playlist created successfully. Playlist ID:", playlistId);

    const videoIds = [
      "rbjWShfQMyc",
      "xkejbXejA-0",
      "pA4IPer3xT0",
      "7V3jqsIe8c0",
      "ny3qvC5msVo",
      "s89Vf6Ba-tg",
      "2hCqIGsZy1s",
      "SYwrKHVFg_4",
      "UBQPzs6WraI",
      "Ip6cw8gfHHI",
      "uoYYfIl0GnM",
      "zB11Dx_T66A",
      "Ai5pGGH8-Eo",
      "EX8eOlJiSHo",
    ];
    await addVideosToPlaylist(auth, playlistId, videoIds);
  } catch (err) {
    console.error("Error creating playlist:", err);
  }
}

export default async function handler(req, res) {
  try {
    const token = await fs.readFile("token.json");
    const parsedToken = JSON.parse(token);
    oAuth2Client.setCredentials(parsedToken);
    await createPlaylist(oAuth2Client);
    res.status(200).json({ message: "Playlist created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
