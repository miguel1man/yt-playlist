"use client";
import "../../app/globals.css";
import "tailwindcss/tailwind.css";
import { useEffect, useState } from "react";
import extractVideoIdFromUrl from "../../features/playlist-management/business/extractVideoIdFromUrl";
import CustomButton from "../../features/playlist-management/components/CustomButton";
import CustomTextarea from "../../features/playlist-management/components/CustomTextarea";

const CreatePage = () => {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createPlaylist = async () => {
    try {
      setIsLoading(true)
      const responseCreate = await fetch(
        `/api/createPlaylist?newItems=${encodeURIComponent(
          JSON.stringify(videoIds)
        )}`
      );

      if (!responseCreate.ok) {
        setIsLoading(false)
        throw new Error(
          `Create Playlist API request failed: ${responseCreate.status}`
        );
      }

      const dataCreate = await responseCreate.json();
      console.log("dataCreate:", dataCreate);
      setIsLoading(false)
    } catch (error) {
      console.error("Error processing Replace Playlist API:", error);
    }
  };

  useEffect(() => {
    setVideoIds(extractVideoIdFromUrl(youtubeUrls));
  }, [youtubeUrls]);

  return (
    <main className="w-full max-w-lg mx-auto my-8 flex flex-col gap-4">
      <CustomTextarea
        onChangeHandler={setYoutubeUrls}
        placeholder="Enter youtube links..."
        textareaValue={youtubeUrls}
      />
      {videoIds.length > 0 && (
        <>
          <p># ID: {videoIds.length}</p>
          <CustomButton
            buttonText="Create a playlist"
            onClickHandler={createPlaylist}
            isLoading={isLoading}
          />
        </>
      )}
    </main>
  );
};

export default CreatePage;
