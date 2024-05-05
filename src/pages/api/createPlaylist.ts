import { google } from "googleapis";
import { promises as fs } from "fs";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECTION_URI,
} from "../../features/playlist-management/business/credentials";
import createPlaylist from "../../features/playlist-management/business/createPlaylist";
import { ensureCredentialsExists } from "../../features/playlist-management/business/verifyCredentials";

ensureCredentialsExists();

const oAuth2Client: any = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECTION_URI
);

export default async function handler(req: any, res: any) {
  try {
    const {
      newItems,
      customPlaylistId,
    }: { newItems: string; customPlaylistId?: string } = req.query;

    const token: any = await fs.readFile("token.json");
    const parsedToken = JSON.parse(token);
    oAuth2Client.setCredentials(parsedToken);

    const newPlaylistId = await createPlaylist({
      auth: oAuth2Client,
      newItems,
      customPlaylistId,
    });

    res
      .status(200)
      .json({ message: "Playlist created successfully", newPlaylistId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
