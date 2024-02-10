const { google } = require("googleapis");
const fs = require("fs").promises;
import { CLIENT_ID, CLIENT_SECRET, REDIRECTION_URI} from "../../models/credentials"
const createPlaylist = require("../../services/createPlaylist");

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECTION_URI) {
  throw new Error("Missing credentials");
}

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECTION_URI
);

// getAccessToken(oAuth2Client);

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
