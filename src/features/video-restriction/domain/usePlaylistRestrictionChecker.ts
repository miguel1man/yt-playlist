import { useState } from "react";
import { PlaylistRestrictionStatus, Video, BlockedVideo } from "./types";
import getPlaylistData from "../api/getPlaylistData";
import getVideoRestrictionData from "../api/getVideoRestrictionData";

const usePlaylistRestrictionChecker = (playlistId: string) => {
  const [status, setStatus] = useState<PlaylistRestrictionStatus>({
    allowedVideosCount: 0,
    blockedVideos: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPlaylistRestrictions = async () => {
    setLoading(true);
    setError(null);

    try {
      const playlistData = await getPlaylistData(playlistId);
      let allowedVideosCount = 0;
      let blockedVideos: BlockedVideo[] = [];

      for (const video of playlistData) {
        const videoRestrictionData = await getVideoRestrictionData(video.id);
        if (videoRestrictionData.blockedCountries?.includes("PE")) {
          blockedVideos.push({
            ...video,
            blockedCountries: videoRestrictionData.blockedCountries,
          });
        } else {
          allowedVideosCount++;
        }
      }

      setStatus({
        allowedVideosCount,
        blockedVideos,
      });
      setLoading(false);
    } catch (e) {
      setError("Failed to get playlist restrictions");
      setLoading(false);
    }
  };

  return { status, loading, error, checkPlaylistRestrictions };
};

export default usePlaylistRestrictionChecker;
