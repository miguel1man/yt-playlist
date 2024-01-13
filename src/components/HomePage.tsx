import { useEffect, useState } from "react";
import extractIDsFromUrls from "../services/extractIDsFromUrls";
import CustomButtons from "./CustomButtons";
import CustomInput from "./CustomInput";
import CustomTextarea from "./CustomTextarea";

export default function HomePage() {
  // console.log("API : ", process.env.NEXT_PUBLIC_YOUTUBE_API);
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [customPlaylistID, setCustomPlaylistId] = useState<string>("");
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);

  async function createPlaylist() {
    // console.log("customPlaylistID:", customPlaylistID);
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
    <main className="w-full max-w-lg mx-auto my-8">
      <CustomTextarea
        onChangeHandler={setYoutubeUrls}
        placeholder="Enter youtube links..."
        textareaValue={youtubeUrls}
      />
      <p>(opcional)</p>
      <CustomInput
        onChangeHandler={setCustomPlaylistId}
        placeholder="Playlist ID:"
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
