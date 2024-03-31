const { google } = require("googleapis");
const fs = require("fs").promises;
// const createPlaylist = require("./createPlaylist");

const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REDIRECTION_URI = "";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECTION_URI
);

async function getAccessToken(code) {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await fs.writeFile("token.json", JSON.stringify(tokens));
    console.log("Token stored to", "token.json");
    // createPlaylist(oAuth2Client);
  } catch (err) {
    console.error("Error retrieving access token", err);
  }
}

module.exports = getAccessToken;
