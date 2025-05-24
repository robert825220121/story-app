import CONFIG from "../config";
import { saveStoriesToDB, getStoriesFromDB } from "../db"; // path to your db.js
const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
};

export default class HomeModel {
  async fetchStories(token, { page = 1, size = 20, location = 0 } = {}) {
    try {
      const url = `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=${location}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch stories");
      }
      const data = await response.json();

   
      return data;
    } catch (error) {
      console.error("Error fetching stories:", error);
      throw error;
    }
  }
}
