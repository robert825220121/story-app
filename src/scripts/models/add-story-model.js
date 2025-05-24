import CONFIG from "../config";

const ENDPOINTS = {
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
};

export default class AddStoryModel {
  async addStory(formData) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not logged in.");
    }

    const response = await fetch(ENDPOINTS.ADD_STORY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add story");
    }

    return await response.json();
  }
}
