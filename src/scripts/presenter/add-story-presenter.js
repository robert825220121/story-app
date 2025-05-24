export class AddStoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async addStory(storyData) {
    try {
      this.view.showLoading();
      const response = await this.model.addStory(storyData);
        console.log("RESPONSE", response.data.id);
        this.view.showSuccessMessage(response.message);
        this.notifyToAllUser(response.data.id);
    } catch (error) {
      this.view.showErrorMessage(error.message);
    }
  }
  async notifyToAllUser(reportId) {
    try {
      const response = await this.model.sendReportToAllUserViaNotification(
        reportId
      );
      if (!response.ok) {
        console.error("#notifyToAllUser: response:", response);
        return false;
      }
      return true;
    } catch (error) {
      console.error("#notifyToAllUser: error:", error);
      return false;
    }
  }
}
