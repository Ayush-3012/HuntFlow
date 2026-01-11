import axios from "axios";
import config from "../config/env.js";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function generateText({ prompt, system }) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${config.openrouterkey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter error:", error.response?.data || error.message);
    throw new Error("AI_GENERATION_FAILED");
  }
}
