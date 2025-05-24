export class HomePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async loadStories() {
    try {
      const token = this.getToken();
      if (!token) {
        this.view.showErrorMessage("You must be logged in to view stories.");
        return;
      }

      this.view.showLoading();
      const response = await this.model.fetchStories(token);
      this.view.showStories(response.listStory);
    } catch (error) {
      this.view.showErrorMessage(error.message);
    } finally {
      this.view.hideLoading();
    }
  }

  getToken() {
    const tokenCookie = localStorage.getItem("token");
    return tokenCookie;
  }
}
