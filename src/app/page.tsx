"use client";
import { useEffect, useState } from "react";

export default function Home() {
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
    <main>
      <textarea
        className="text-black"
        placeholder="Enter YouTube URLs..."
        value={youtubeUrls}
        onChange={(e) => setYoutubeUrls(e.target.value)}
      />
      {videoIds.length > 0 ? (
        <p className="text-white">
          Video IDs: {[...videoIds].map((id) => `"${id}"`).join(", ")}
        </p>
      ) : (
        <p>empty</p>
      )}
    </main>
  );
}
