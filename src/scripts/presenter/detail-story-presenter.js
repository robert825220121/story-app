export class StoryDetailPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async loadStoryDetail(storyId) {
    if (!storyId) {
      this.view.showErrorMessage("Story ID is missing.");
      return;
    }

    try {
      this.view.showLoading();
      const story = await this.model.fetchStoryDetail(storyId);
      this.view.showStoryDetail(story);
    } catch (error) {
      this.view.showErrorMessage(error.message);
    } finally {
      this.view.hideLoading();
    }
  }
}
