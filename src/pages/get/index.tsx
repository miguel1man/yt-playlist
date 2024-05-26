"use client";
import "../../app/globals.css";
import "tailwindcss/tailwind.css";
import { useState } from "react";
import CustomButton from "@/features/playlist-management/components/CustomButton";
import CustomInput from "@/features/playlist-management/components/CustomInput";

export default function Home() {
  const [playlistId, setPlaylistId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getPlaylistData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:3000/api/playlists/${playlistId}`
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

    setIsLoading(false);
  };

  return (
    <main className="w-full max-w-lg mx-auto my-8 flex flex-col gap-4">
      <CustomInput
        title="Required Playlist URL*"
        onChangeHandler={setPlaylistId}
        inputValue={playlistId}
      />
      <CustomButton
        buttonText="Get data from playlist"
        onClickHandler={getPlaylistData}
        isLoading={isLoading}
      />
    </main>
  );
}
