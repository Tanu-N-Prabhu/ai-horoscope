import axios from "axios";

const API_URL = "https://api.aistrology.beandev.xyz/latest"; // Your API

export const getHoroscope = async (sign) => {
  try {
    const response = await axios.get(`${API_URL}/${sign}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    return null;
  }
};
