import axios from "axios";

export const fileUrlToBase64 = async (fileUrl) => {
  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer",
    maxRedirects: 5,
    headers: {
      "User-Agent": "Mozilla/5.0", // IMPORTANT for Drive
    },
  });

  const buffer = Buffer.from(response.data);
  return buffer.toString("base64");
};
