import { useEffect, useState } from "react";
import extractIDsFromUrls from "../../../services/extractIDsFromUrls";
import CustomButton from "./CustomButton";
import CustomTextarea from "./CustomTextarea";
import CustomInput from "./CustomInput";

const ReplaceVideosPage = () => {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [customPlaylistID, setCustomPlaylistId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const replacePlaylistData = async () => {
    try {
      setIsLoading(true);
      const responseGet = await fetch(`/api/playlists/${customPlaylistID}`);

      if (!responseGet.ok) {
        throw new Error(
          `Get Playlist API request failed: ${responseGet.status}`
        );
      }

      const dataGet = await responseGet.json();
      const allIDs = dataGet.allItems.map((item: { id: string }) => item.id);
      const IDsToAdd = videoIds.filter((id) => !allIDs.includes(id));
      const IDsToRemove = allIDs.filter((id: string) => !videoIds.includes(id));

      const responseCreate = await fetch(
        `/api/createPlaylist?newItems=${encodeURIComponent(
          JSON.stringify(IDsToAdd)
        )}&customPlaylistId=${customPlaylistID}`
      );

      if (!responseCreate.ok) {
        throw new Error(
          `Create Playlist API request failed: ${responseCreate.status}`
        );
      }

      const responseDelete = await fetch(
        `/api/deleteFromPlaylist?newItems=${encodeURIComponent(
          JSON.stringify(IDsToRemove)
        )}&customPlaylistId=${customPlaylistID}`
      );

      if (!responseDelete.ok) {
        throw new Error(
          `Delete Playlist API request failed: ${responseDelete.status}`
        );
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error processing Replace Playlist API:", error);
    }
  };

  useEffect(() => {
    setVideoIds(extractIDsFromUrls(youtubeUrls));
  }, [youtubeUrls]);

  return (
    <main className="w-full max-w-lg mx-auto my-8 flex flex-col gap-4">
      <CustomInput
        title="Required Playlist ID*"
        onChangeHandler={setCustomPlaylistId}
        inputValue={customPlaylistID}
      />
      <CustomTextarea
        onChangeHandler={setYoutubeUrls}
        placeholder="Enter youtube links..."
        textareaValue={youtubeUrls}
      />
      {videoIds.length > 0 && (
        <>
          <p># ID: {videoIds.length}</p>
          <CustomButton
            buttonText={
              isLoading ? "Cargando..." : "Replace all playlist items"
            }
            isLoading={isLoading}
            onClickHandler={replacePlaylistData}
          />
        </>
      )}
    </main>
  );
};

export default ReplaceVideosPage;
