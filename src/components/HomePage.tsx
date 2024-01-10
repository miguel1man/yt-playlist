import { useEffect, useState } from "react";

export default function HomePage() {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [customPlaylistID, setCustomPlaylistId] = useState<string>("");
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  // console.log("API : ", process.env.NEXT_PUBLIC_YOUTUBE_API);

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
    const extractVideoIds = (urls: string): string[] => {
      const regex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
      const matches = urls.match(regex) || [];

      return matches.map((match) => match.split("=").pop() || "");
    };

    setVideoIds(extractVideoIds(youtubeUrls));
  }, [youtubeUrls]);

  return (
    <main className="w-full max-w-lg mx-auto my-8">
      <input
        className="text-black w-full p-2 rounded-md mb-4"
        value={customPlaylistID}
        onChange={(e) => setCustomPlaylistId(e.target.value)}
      />
      <textarea
        className="text-black w-full p-2 rounded-md"
        placeholder="Enter YouTube links..."
        value={youtubeUrls}
        onChange={(e) => setYoutubeUrls(e.target.value)}
      />
      <section className="my-4">
        {videoIds.length > 0 && (
          <>
            <p># ID: {videoIds.length}</p>
            <button
              className="bg-red-600 hover:bg-red-700 p-2 rounded-md my-4"
              onClick={createPlaylist}
            >
              Create Playlist
            </button>
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
