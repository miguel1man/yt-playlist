const extractIDsFromUrls = (urls: string): string[] => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
  const matches = urls.match(regex) || [];

  return matches.map((match) => match.split("=").pop() || "");
};

export default extractIDsFromUrls;
