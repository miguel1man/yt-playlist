import { useEffect, useState } from "react";

export default function HomePage() {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  // console.log("API : ", process.env.NEXT_PUBLIC_OPENAI_API);

  async function createPlaylist() {
    try {
      const response = await fetch(
        `/api/createPlaylist?newItems=${encodeURIComponent(
          JSON.stringify(videoIds)
        )}`
      );
      const data = await response.json();

      console.log(data);
      // if (data.playlistId) {
      //   console.log(`Playlist ID: ${data.playlistId}`);
      //   console.log("Video IDs:");
      //   data.videoIds.forEach((videoId: any) => {
      //     console.log(`- ${videoId}`);
      //   });
      // }
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
            <p>Video IDs:</p>
            <div className="max-h-[8em] overflow-y-auto mt-4 border border-white p-2 rounded-md">
              <p>{[...videoIds].map((id) => `"${id}"`).join(", ")}</p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
