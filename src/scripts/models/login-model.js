import CONFIG from "../config";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
};

export default class LoginModel {
  async loginUser(credentials) {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to log in");
    }

    const responseData = await response.json();

    const token = responseData.loginResult.token;
    if (!token) {
      throw new Error("Token not found in the response");
    }
    window.localStorage.setItem("token", token);

    console.log("Response", responseData);
    return responseData;
  }
}
