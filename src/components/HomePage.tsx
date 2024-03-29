import { useEffect, useState } from "react";
import extractIDsFromUrls from "../services/extractIDsFromUrls";
import CustomButtons from "./CustomButtons";
import CustomInput from "./CustomInput";
import CustomTextarea from "./CustomTextarea";

export default function HomePage() {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [customPlaylistID, setCustomPlaylistId] = useState<string>("");
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);

  async function createPlaylist() {
    try {
      const response = await fetch(
        `/api/createPlaylist?newItems=${encodeURIComponent(
          JSON.stringify(videoIds)
        )}&customPlaylistId=${customPlaylistID}`
      );
      const data = await response.json();

      if (data.newPlaylistId) {
        const url = `https://www.youtube.com/playlist?list=${data.newPlaylistId}`;
        setPlaylistUrl(url);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

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
      <CustomInput
        title="(Optional) Playlist ID:"
        onChangeHandler={setCustomPlaylistId}
        inputValue={customPlaylistID}
      />
      <section className="my-4">
        {videoIds.length > 0 && (
          <>
            <p># ID: {videoIds.length}</p>
            <CustomButtons
              buttonText="Create playlist"
              onClickHandler={createPlaylist}
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
