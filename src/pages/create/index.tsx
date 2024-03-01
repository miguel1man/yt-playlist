"use client";
import "../../app/globals.css";
import "tailwindcss/tailwind.css";
import { useEffect, useState } from "react";
import extractIDsFromUrls from "../../services/extractIDsFromUrls";
import CustomButtons from "../../shared/components/CustomButtons";
import CustomTextarea from "../../shared/components/CustomTextarea";

const CreatePage = () => {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);

  const replacePlaylistData = async () => {
    try {
      const responseCreate = await fetch(
        `/api/createPlaylist?newItems=${encodeURIComponent(
          JSON.stringify(videoIds)
        )}`
      );

      if (!responseCreate.ok) {
        throw new Error(
          `Create Playlist API request failed: ${responseCreate.status}`
        );
      }

      const dataCreate = await responseCreate.json();
      console.log("dataCreate:", dataCreate);
    } catch (error) {
      console.error("Error processing Replace Playlist API:", error);
    }
  };

  useEffect(() => {
    setVideoIds(extractIDsFromUrls(youtubeUrls));
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
          <CustomButtons
            buttonText="Replace all playlist items"
            onClickHandler={replacePlaylistData}
          />
        </>
      )}
    </main>
  );
};

export default CreatePage;
