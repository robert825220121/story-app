export class RegisterPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async registerUser(userData) {
    try {
      this.view.showLoading();
      const response = await this.model.registerUser(userData);
      this.view.showSuccessMessage("Registration successful!");
      this.view.navigateToLogin();
    } catch (error) {
      this.view.showErrorMessage(error.message);
    }
  }
}
