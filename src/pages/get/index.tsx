"use client";
import { useState } from "react";

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const getPlaylistData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/getPlaylistData?playlistId=${youtubeUrl}`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      console.log("Playlist Data:", data);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  return (
    <main>
      <textarea
        className="text-black w-full p-2 rounded-md"
        placeholder="Enter playlist URL..."
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />
      <button
        className="bg-red-600 hover:bg-red-700 p-2 rounded-md my-4"
        onClick={getPlaylistData}
      >
        Get Data
      </button>
    </main>
  );
}
