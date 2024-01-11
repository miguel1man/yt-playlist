"use client";
import "../../app/globals.css";
import "tailwindcss/tailwind.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [customPlaylistID, setCustomPlaylistId] = useState<string>("");

  const getPlaylistData = async () => {
    console.log("customPlaylistID:", customPlaylistID);
    console.log("youtubeUrls:", youtubeUrls);
    try {
      const response = await fetch(
        `/api/deleteFromPlaylist?newItems=${encodeURIComponent(
          JSON.stringify(videoIds)
        )}&customPlaylistId=${customPlaylistID}`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      const allIDs = data.allItems.map((item: { id: string }) => item.id);
      console.log("IDs:", allIDs);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  useEffect(() => {
    const extractVideoIds = (urls: string): string[] => {
      const regex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
      const matches = urls.match(regex) || [];

      return matches.map((match) => match.split("=").pop() || "");
    };

    setVideoIds(extractVideoIds(youtubeUrls));
  }, [youtubeUrls]);

  return (
    <main className="w-full max-w-lg mx-auto my-8">
      <input
        className="text-black w-full p-2 rounded-md mb-4"
        value={customPlaylistID}
        onChange={(e) => setCustomPlaylistId(e.target.value)}
        placeholder="Playlist ID"
      />
      <textarea
        className="text-black w-full p-2 rounded-md"
        placeholder="Enter YouTube links..."
        value={youtubeUrls}
        onChange={(e) => setYoutubeUrls(e.target.value)}
      />
      <button
        className="bg-red-600 hover:bg-red-700 p-2 rounded-md my-4"
        onClick={getPlaylistData}
      >
        Remove from playlist
      </button>
    </main>
  );
}
