import { ChangeEvent, useEffect, useState } from "react";

import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import CustomTextarea from "./CustomTextarea";

import extractVideoIdFromUrl from "../business/extractVideoIdFromUrl";
import extractIdFromPlaylist from "../business/extractIdFromPlaylist"

export default function AddToPlaylistPage() {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [customPlaylistID, setCustomPlaylistId] = useState<string>("");
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function createPlaylistFromHome() {
    try {
      setIsLoading(true);
      const extractedId = extractIdFromPlaylist(customPlaylistID)

      if (customPlaylistID) {
        const response = await fetch(
          `/api/createPlaylist?newItems=${encodeURIComponent(
            JSON.stringify(videoIds)
          )}&customPlaylistId=${extractedId}`
        );
        const data = await response.json();

        if (data.newPlaylistId) {
          const url = `https://www.youtube.com/playlist?list=${data.newPlaylistId}`;
          setPlaylistUrl(url);
        }
      } else {
        console.log("Create playlist without customID")
        const response = await fetch(
          `/api/createPlaylist?newItems=${encodeURIComponent(
            JSON.stringify(videoIds)
          )}`
        );
        const data = await response.json();

        if (data.newPlaylistId) {
          const url = `https://www.youtube.com/playlist?list=${data.newPlaylistId}`;
          setPlaylistUrl(url);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error function createPlaylistFromHome:", error);
    }
  }

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
      <CustomInput
        title="(Optional) Playlist ID:"
        onChangeHandler={setCustomPlaylistId}
        inputValue={customPlaylistID}
      />
      <section className="my-4">
        {videoIds.length > 0 && (
          <>
            <p># ID: {videoIds.length}</p>
            <CustomButton
              buttonText={isLoading ? "Loading..." : "Create playlist"}
              isLoading={isLoading}
              onClickHandler={createPlaylistFromHome}
            />
            {playlistUrl && (
              <p>
                Playlist URL:
                <br />
                <a
                  href={playlistUrl}
                  target="_blank"
                  className="underline hover:text-gray-200"
                >
                  {playlistUrl.length > 50
                    ? playlistUrl.substring(0, 50) + "..."
                    : playlistUrl}
                </a>
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
