import CONFIG from "../config";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
};

export default class RegisterModel {
  async registerUser(userData) {
    try {
      console.log(userData);
      const response = await fetch(ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }

      return await response.json();
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  }
}
