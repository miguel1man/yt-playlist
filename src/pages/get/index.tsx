"use client";
import "tailwindcss/tailwind.css";
import { useState } from "react";
import CustomButton from "@/components/CustomButtons";
import CustomInput from "@/components/CustomInput";

export default function Home() {
  const [playlistId, setPlaylistId] = useState("");

  const getPlaylistData = async () => {
    try {
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
  };

  return (
    <main>
      <CustomInput
        title="Required Playlist ID*"
        onChangeHandler={setPlaylistId}
        inputValue={playlistId}
      />
      <CustomButton
        buttonText="Get data from playlist"
        onClickHandler={getPlaylistData}
      />
    </main>
  );
}
