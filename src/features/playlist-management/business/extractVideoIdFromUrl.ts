const extractVideoIdFromUrl = (urls: string): string[] => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
  const matches = urls.match(regex) || [];

  const ids = matches.map((match) => {
    const idMatch = match.match(/(?:v=|\/)([^"&?\/\s]{11})/);
    return idMatch ? idMatch[1] : "";
  });

  return ids.filter((id) => id);
};

export default extractVideoIdFromUrl;
