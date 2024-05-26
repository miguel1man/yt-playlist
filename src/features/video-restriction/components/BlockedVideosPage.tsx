import { useState } from "react";
import CustomButton from "../../playlist-management/components/CustomButton";
import CustomInput from "../../playlist-management/components/CustomInput";
import getPlaylistData from "../infrastructure/getPlaylistData";
import getVideoRestrictionData from "../infrastructure/getVideoRestrictionData";
import { BlockedVideo } from "../business/types";

const BlockedVideosPage = () => {
  const [videosBloqueadosPE, setVideosBloqueadosPE] = useState<BlockedVideo[]>(
    []
  );
  const [customPlaylistID, setCustomPlaylistId] = useState<string>("");

  const getPlaylistDataAndCheckRestrictions = async () => {
    try {
      const allItems = await getPlaylistData(customPlaylistID);
      console.log("allItems:", allItems);

      let totalVideosPermitidosPE = 0;
      const videosBloqueadosPE: any[] = [];

      for (const item of allItems) {
        const videoRestrictionData = await getVideoRestrictionData(item.id);
        // console.log("BlockedVideosPage:", videoRestrictionData);
        const blockedVideos = videoRestrictionData.filter(
          (video: any) => video.blocked && video.blocked.includes("PE")
        );

        if (blockedVideos.length > 0) {
          videosBloqueadosPE.push(
            ...blockedVideos.map((video: any) => ({
              id: video.id,
              title: video.title,
              channel: video.channel,
            }))
          );
        } else {
          totalVideosPermitidosPE++;
        }
      }

      console.log(`# Videos permitidos en Perú: ${totalVideosPermitidosPE}`);
      if (videosBloqueadosPE.length > 0) {
        console.log(
          `# Videos bloqueados en Perú: ${videosBloqueadosPE.length}. Lista de videos bloqueados:`
        );
        videosBloqueadosPE.forEach((video: any, index: number) => {
          console.log(
            `Video ${index + 1}: ID ${video.id}, Título "${video.title}", Canal "${video.channel}"`
          );
        });
      } else {
        console.log("# No hay videos bloqueados en Perú.");
      }

      setVideosBloqueadosPE(videosBloqueadosPE);
    } catch (error) {
      console.error("Error processing on API:", error);
    }
  };

  return (
    <main className="w-full max-w-lg mx-auto my-8 flex flex-col gap-4">
      <CustomInput
        title="Required Playlist URL*"
        onChangeHandler={setCustomPlaylistId}
        inputValue={customPlaylistID}
      />
      <CustomButton
        buttonText="Find blocked videos"
        onClickHandler={getPlaylistDataAndCheckRestrictions}
        isLoading={false}
      />
      {videosBloqueadosPE.length > 0 && (
        <div>
          Videos bloqueados en Perú:
          <ul>
            {videosBloqueadosPE.map((video, index) => (
              <li key={index}>
                Video {index + 1}: ID {video.id}, Título `{video.title}`, Canal
                `{video.channel}`
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default BlockedVideosPage;
