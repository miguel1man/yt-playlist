"use client";
import "../../app/globals.css";
import "tailwindcss/tailwind.css";
import { useEffect, useState } from "react";
import extractIDsFromUrls from "@/features/playlist-management/business/extractIDsFromUrls";
import CustomButton from "@/features/playlist-management/components/CustomButton";
import CustomTextarea from "@/features/playlist-management/components/CustomTextarea";
import CustomInput from "@/features/playlist-management/components/CustomInput";

export default function Home() {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [customPlaylistID, setCustomPlaylistId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const getPlaylistData = async () => {
    // console.log("customPlaylistID:", customPlaylistID);
    // console.log("youtubeUrls:", youtubeUrls);
    try {
      setIsLoading(true);

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

    setIsLoading(false);
  };

  useEffect(() => {
    setVideoIds(extractIDsFromUrls(youtubeUrls));
  }, [youtubeUrls]);

  return (
    <main className="w-full max-w-lg mx-auto my-8 flex flex-col gap-4">
      <CustomInput
        title="Required Playlist URL*"
        onChangeHandler={setCustomPlaylistId}
        inputValue={customPlaylistID}
      />
      <CustomTextarea
        onChangeHandler={setYoutubeUrls}
        placeholder="Enter youtube links..."
        textareaValue={youtubeUrls}
      />
      <CustomButton
        buttonText="Remove from playlist"
        onClickHandler={getPlaylistData}
        isLoading={isLoading}
      />
    </main>
  );
}
