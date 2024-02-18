import { API_KEY, CLIENT_ID, CLIENT_SECRET, REDIRECTION_URI } from "./credentials";

export function ensureCredentialsExists(): void {
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECTION_URI) {
        throw new Error("Missing credentials");
    }
}

export function ensureYoutubeApiExists(): void {
    if (!API_KEY) {
        throw new Error("Missing credentials");
    }
}
