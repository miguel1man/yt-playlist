import { ensureCredentialsExists } from "../../youtubeAuth/domain/verifyCredentials";

try {
    ensureCredentialsExists();
    console.log("Credentials verified successfully.");
} catch (error) {
    console.error("Error:", (error as Error).message);
}
