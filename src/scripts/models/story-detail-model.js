import CONFIG from "../config";

const ENDPOINTS = {
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
};

export default class StoryDetailModel {
  async fetchStoryDetail(storyId) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not logged in.");
    }

    const response = await fetch(ENDPOINTS.STORY_DETAIL(storyId), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch story details");
    }

    const responseData = await response.json();
    return responseData.story;
  }
}
