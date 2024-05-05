const { google } = require("googleapis");
const fs = require("fs").promises;
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECTION_URI,
} from "../../features/playlist-management/business/credentials";
const removeVideosfromPlaylist = require("../../features/playlist-management/business/removeVideosfromPlaylist");
// const ensureCredentialsExists = require("../../features/playlist-management/business/verifyCredentials");

// ensureCredentialsExists();

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECTION_URI
);

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
