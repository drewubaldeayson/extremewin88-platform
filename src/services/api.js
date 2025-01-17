import axios from "axios";

const API_URL = "https://live-casino-slots-evolution-jili-and-50-plus-provider.p.rapidapi.com";

export const getGameProviders = async () => {
  try {
    const response = await axios.get(`${API_URL}/casino/providers`, {
      headers: {
        "x-rapidapi-key": "8369852d85msh22d517e3367939ap10d24bjsn9a90b0f65d69",
        "x-rapidapi-host": "live-casino-slots-evolution-jili-and-50-plus-provider.p.rapidapi.com",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};