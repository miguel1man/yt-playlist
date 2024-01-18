"use client";
import "tailwindcss/tailwind.css";
import { useState } from "react";
import CustomButton from "@/components/CustomButtons";
import CustomTextarea from "@/components/CustomTextarea";

export default function Home() {
  const [playlistId, setPlaylistId] = useState("");

  const getPlaylistData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/getPlaylistData?playlistId=${playlistId}`
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
      <CustomTextarea
        onChangeHandler={setPlaylistId}
        placeholder="Enter playlist URL..."
        textareaValue={playlistId}
      />
      <CustomButton
        buttonText="Get data from playlist"
        onClickHandler={getPlaylistData}
      />
    </main>
  );
}
