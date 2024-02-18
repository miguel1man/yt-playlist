"use client";
import "../../app/globals.css";
import "tailwindcss/tailwind.css";
import { useState } from "react";
import CustomButtons from "@/components/CustomButtons";
import CustomInput from "@/components/CustomInput";

const getVideoRestrictionData = async (videoId: string) => {
  try {
      const response = await fetch(`/api/getVideoRestrictionData?videoId=${videoId}`);
      if (!response.ok) {
          throw new Error(`Get Video Restriction API request failed: ${response.status}`);
      }
      const data = await response.json();
      console.log("Video restriction data:", data);
      return data
  } catch (error) {
      console.error("Error fetching video restriction data:", error);
      throw error;
  }
};

const ReplacePlaylistData = () => {
  let totalVideosPermitidosPE = 0;
  const [videosBloqueadosPE, setVideosBloqueadosPE] = useState<any[]>([]);
  const [customPlaylistID, setCustomPlaylistId] = useState<string>("");
  
  const getPlaylistData = async () => {
    try {
      const responseGet = await fetch(
        `/api/getPlaylistData?playlistId=${customPlaylistID}`
      );

      if (!responseGet.ok) {
        throw new Error(
          `Get Playlist API request failed: ${responseGet.status}`
        );
      }

      const dataGet = await responseGet.json();
      console.log("full dataGet:", dataGet)

      for (const item of dataGet.allItems) {
        const videoRestrictionData = await getVideoRestrictionData(item.id);
        const blockedVideos = videoRestrictionData.allItems.filter((item: any) => item.blocked && item.blocked.includes("PE"));
        
        if (blockedVideos.length > 0) {
          const videosBloqueadosData = blockedVideos.map((video: any) => ({
            id: video.id,
            title: video.title,
            channel: video.channel
        }));
        setVideosBloqueadosPE(prevState => [...prevState, ...videosBloqueadosData]);
        } else {
            totalVideosPermitidosPE++;
        }
      }

      console.log(`# Videos permitidos en Perú: ${totalVideosPermitidosPE}`);
      if (videosBloqueadosPE.length > 0) {
        console.log(`# Videos bloqueados en Perú: ${videosBloqueadosPE.length}. Lista de videos bloqueados:`);
        videosBloqueadosPE.forEach((video: any, index: number) => {
            console.log(`Video ${index + 1}: ID ${video.id}, Título "${video.title}", Canal "${video.channel}"`);
        });
      } else {
          console.log("# No hay videos bloqueados en Perú.");
      }
      } catch (error) {
        console.error("Error processing on API:", error);
      }
    };

  return (
    <main className="w-full max-w-lg mx-auto my-8 flex flex-col gap-4">
      <CustomInput
        title="Required Playlist ID*"
        onChangeHandler={setCustomPlaylistId}
        inputValue={customPlaylistID}
      />
      <CustomButtons
        buttonText="Replace all playlist items"
        onClickHandler={getPlaylistData}
      />
      {videosBloqueadosPE.length > 0 && (
        <p>
          Videos bloqueados en Perú:
          <ul>
            {videosBloqueadosPE.map((video, index) => (
              <li key={index}>
                Video {index + 1}: ID {video.id}, Título `{video.title}`, Canal `{video.channel}`
              </li>
            ))}
          </ul>
        </p>
      )}
    </main>
  );
}

export default ReplacePlaylistData;
