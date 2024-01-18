const { google } = require("googleapis");
const fs = require("fs").promises;

const credentials = require("../../services/credentials.json");
const removeVideosfromPlaylist = require("../../services/removeVideosfromPlaylist");
// const getAccessToken = require("../../services/getAccessToken");

const oAuth2Client = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);

// getAccessToken(oAuth2Client);

export default async function handler(req, res) {
  const { newItems, customPlaylistId } = req.query;
  try {
    const token = await fs.readFile("token.json");
    const parsedToken = JSON.parse(token);
    oAuth2Client.setCredentials(parsedToken);
    const removeVideos = await removeVideosfromPlaylist(
      oAuth2Client,
      newItems,
      customPlaylistId
    );
    res.status(200).json({
      message: "Items deleted from playlist successfully",
      removeVideos,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
