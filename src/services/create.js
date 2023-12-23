const { google } = require("googleapis");
const fs = require("fs").promises;
const readline = require("readline");

const credentials = require("./credentials.json");

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
          title: "API-4",
          description: "Playlist",
          tags: ["Music"],
          defaultLanguage: "es",
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
      "c39yhv-Ia9Q",
      "pA4IPer3xT0",
      "xkejbXejA-0",
      "_YhkK9UnHW8",
      "3x554vRA9Ic",
      "7V3jqsIe8c0",
      "e-2KVpeEDnc",
      "KlCAW0hwEmM",
      "Ysf6UULedRk",
      "fBpcvn8a3o0",
      "zfkCI1aNzrA",
      "s89Vf6Ba-tg",
      "SYwrKHVFg_4",
      "2hCqIGsZy1s",
      "50Xl4wpmaFU",
      "FZy2B59UJ18",
      "BTe_mC3lWts",
      "yWzOT2q92f4",
      "LlV0Sz9COMw",
      "NeI-cuFvizQ",
      "KlBZ7yIZxIo",
      "qhsA6vPRVT4",
      "IuLK56UrCL0",
      "UBQPzs6WraI",
      "Ip6cw8gfHHI",
      "nePArJRgIRo",
      "j2icIBbegr0",
      "XZ9YT1EYlOk",
      "7igwMMmMhm4",
      "uoYYfIl0GnM",
      "TTMBQ-tiNVM",
      "5cj_18lEZk0",
      "0gQbRvYToFc",
      "HQYNnOcI1xY",
      "dKaA3HpA86g",
      "tuGmCFBupuY",
      "5486MZTyMhU",
      "r3cF2orymDc",
      "ijE7Es9Tdig",
      "RSoz_-NXR0w",
      "-6nNLTkJCDg",
      "lb7IhQCmvqw",
      "XCb5Bemm5LI",
      "fszcaAzcm0M",
      "Ek9eLru_YHE",
      "zB11Dx_T66A",
      "6YDWZy_62MI",
      "T71GSWzhJks",
      "pinjeUquJqU",
      "y0lNpJt4r-g",
      "EX8eOlJiSHo",
      "WKrt2JwUFYQ",
      "Ai5pGGH8-Eo",
      "VF4-5uoYp84",
      "XS8kKeJwLXk",
      "tDWHvq5Y11Q",
      "yvl376FGACI",
      "5zlDhA0_rGs",
      "CwGbMYLjIpQ",
      "U7r_NKATPtY",
      "rXCjsvRnGaE",
      "t0feOuWo3v0",
      "CiifUAYpzwM",
      "YDxLRpxI_hA",
    ];
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
