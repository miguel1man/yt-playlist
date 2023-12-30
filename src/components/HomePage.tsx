import { useEffect, useState } from "react";

export default function HomePage() {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  console.log("API : ", process.env.NEXT_PUBLIC_OPENAI_API);

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
    <main className="w-full max-w-lg mx-auto my-16">
      <textarea
        className="text-black w-full p-1"
        placeholder="Enter YouTube links..."
        value={youtubeUrls}
        onChange={(e) => setYoutubeUrls(e.target.value)}
      />
      {videoIds.length > 0 ? (
        <>
          <p># ID: {videoIds.length}</p>
          <br></br>
          <p>Video IDs:</p>
          <p>{[...videoIds].map((id) => `"${id}"`).join(", ")}</p>
        </>
      ) : (
        <p># ID: {videoIds.length}</p>
      )}
    </main>
  );
}
