import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import generateToken from "../../../services/generateToken";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECTION_URI,
} from "../../../features/playlist-management/business/credentials";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECTION_URI
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const authUrl = generateToken(oAuth2Client);
    res.status(201).redirect(await authUrl);
  } catch (error) {
    console.error("Error fetchPlaylistData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
