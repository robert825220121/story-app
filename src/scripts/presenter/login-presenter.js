export class LoginPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async loginUser(credentials) {
    try {
      this.view.showLoading();
      const response = await this.model.loginUser(credentials);
      document.cookie = `token=${response.token}; path=/; secure; SameSite=Strict`;
      this.view.showSuccessMessage("Login successful!");
      this.view.navigateToHome();
    } catch (error) {
      this.view.showErrorMessage(error.message);
    }
  }
}
