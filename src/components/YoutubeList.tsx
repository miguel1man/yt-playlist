import React, { useState, useEffect } from "react";

const extractVideoId = (url: string) => {
  const match = url.match(/[?&]v=([^?&]+)/);
  return match ? match[1] : "";
};

const YoutubeList: React.FC = () => {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);

  useEffect(() => {
    const ids = youtubeUrls
      .split("\n")
      .map((url) => extractVideoId(url.trim()))
      .filter((id) => id !== "");

    setVideoIds(ids);
  }, [youtubeUrls]);

  return (
    <div>
      <textarea
        placeholder="Enter YouTube URLs..."
        value={youtubeUrls}
        onChange={(e) => setYoutubeUrls(e.target.value)}
      />
      {typeof window !== "undefined" && (
        <p>
          Video IDs:{" "}
          {videoIds.length > 0
            ? `[${videoIds.map((id) => `"${id}"`).join(", ")}]`
            : "[]"}
        </p>
      )}
    </div>
  );
};

export const useClient = true;

export default YoutubeList;
