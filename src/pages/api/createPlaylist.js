const { google } = require("googleapis");
const fs = require("fs").promises;
const readline = require("readline");

const credentials = require("../../services/credentials.json");
const createPlaylist = require("../../services/createPlaylist");

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

export default async function handler(req, res) {
  const { newItems, customPlaylistId } = req.query;
  try {
    const token = await fs.readFile("token.json");
    const parsedToken = JSON.parse(token);
    oAuth2Client.setCredentials(parsedToken);
    const newPlaylistId = await createPlaylist(
      oAuth2Client,
      newItems,
      customPlaylistId
    );
    res
      .status(200)
      .json({ message: "Playlist created successfully", newPlaylistId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
