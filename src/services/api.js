import axios from "axios";

const API_URL = "https://live-casino-slots-evolution-jili-and-50-plus-provider.p.rapidapi.com";

export const getGameProviders = async () => {
  try {
    const response = await axios.get(`${API_URL}/casino/providers`, {
      headers: {
        "x-rapidapi-key": "efd5337684msh1329b1d04eb87f9p13f196jsn51afe35a503a",
        "x-rapidapi-host": "live-casino-slots-evolution-jili-and-50-plus-provider.p.rapidapi.com",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};