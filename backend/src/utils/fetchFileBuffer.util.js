import axios from "axios";

export const fetchFileFromURL = async (fileUrl) => {
  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer",
    maxRedirects: 5,
    headers: {
      "User-Agent": "Mozilla/5.0", // IMPORTANT for Drive
    },
  });

  return Buffer.from(response.data);
};
