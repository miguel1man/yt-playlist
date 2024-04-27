import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import generateToken from "../../../services/generateToken";
require("dotenv").config();

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const REDIRECTION_URI = process.env.NEXT_PUBLIC_REDIRECTION_URI;

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
