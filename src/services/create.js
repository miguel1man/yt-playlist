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
      "A5I3Y7tqgaE",
      "OpiL38sFa6w",
      "r-u1gY4WAI8",
      "EqA0OW7uC-4",
      "ny3qvC5msVo",
      "SKM8XI8svxQ",
      "h6hazR5T3Vw",
      "CiftK1ToZSc",
      "SYwrKHVFg_4",
      "LEkKRJ-unyU",
      "LXFL5mdfP40",
      "99E2PHpsw6U",
      "ybhNZqEnkYQ",
      "LDhaPasA2TM",
      "vUn10QHFmDM",
      "NbXwi_Kmhpc",
      "5xIGSaeEH9A",
      "-nqhkgdNg-A",
      "pXq3YqI_n3k",
      "rJAZtuQqerE",
      "2hCqIGsZy1s",
      "h2hGBfNQYag",
      "eNBe7W_B9eY",
      "ngn-pFSJRic",
      "AoFuIT0D-ZA",
      "wvR7EtLuJfg",
      "XRZS1NrkpJQ",
      "JGJyU6sdO_4",
      "FaJXa88-QNE",
      "V8YfuvXdVbs",
      "0Kz7zdJ02B8",
      "zxdOkAW31x4",
      "loqm4OOlywc",
      "q-LwWUH4tI8",
      "s34j9Lk_C04",
      "tbfCKtmqFQo",
      "CkJDkVeWKEM",
      "53hsFyX4Hh8",
      "IVEkeWbCFxs",
      "vtCk4sNgj48",
      "f0SG-aGlOxE",
      "iO8GvjEZbN0",
      "2fxjPm2w5UE",
      "xGctMiSYmV0",
      "fLQ7QnWJ3EU",
      "D5OsyIhlUF4",
      "LO3M4T1iZxA",
      "IdGsABkTIlU",
      "mgXN0cHAAEY",
      "QaFtF7XLEBI",
      "j-PPo4vHubc",
      "lmg-nmQOzZE",
      "rbjWShfQMyc",
      "97QaSXW9Brc",
      "CljSWY_VpBs",
      "l3i0zQ7Lg1A",
      "-ZFNMB2uvdQ",
      "GbwYzBZljSc",
      "HWpqlYO4WTo",
      "Gq46XNXg1GI",
      "VXEnQzTUT4s",
      "qNMcriDkGQA",
      "elZq6rJlMek",
      "bIWb-Vd3Qjs",
      "LSV3O18mjjI",
      "splAVwX7R7c",
      "X1O7CXFsk4s",
      "kTJ_T8AYImw",
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
