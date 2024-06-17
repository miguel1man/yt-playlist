const { google } = require("googleapis");
require("dotenv").config();

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const REDIRECTION_URI = process.env.NEXT_PUBLIC_REDIRECTION_URI;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECTION_URI
);

export default async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/youtube.force-ssl",
  });
  console.log("Authorize this app by visiting this url:", authUrl);

  try {
    return authUrl;
  } catch (err) {
    console.error("Error retrieving access token", err);
  }
}
