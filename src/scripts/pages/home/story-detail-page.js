import StoryDetailModel from "../../models/story-detail-model";
import { StoryDetailPresenter } from "../../presenter/detail-story-presenter";
import { addBookmark, getBookmarkById, deleteBookmark } from "../../db";
export default class StoryDetailPage {
  async render() {
    return `
      <section class="container">
        <h1>Story Detail</h1>
     
        <div id="loading-message" class="loading-message" style="display: none;">Loading...</div>
        <div id="error-message" class="error-message" style="display: none;"></div>
        <div id="story-detail" class="story-detail"></div>
      </section>
    `;
  }

  async afterRender() {
    const model = new StoryDetailModel();
    const presenter = new StoryDetailPresenter(model, this);

    const hash = window.location.hash;
    const storyId = hash.split("=")[1];
    presenter.loadStoryDetail(storyId);
  }

  showLoading() {
    const loadingMessage = document.getElementById("loading-message");
    loadingMessage.style.display = "block";
  }

  hideLoading() {
    const loadingMessage = document.getElementById("loading-message");
    loadingMessage.style.display = "none";
  }

  showErrorMessage(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }
  showMap(lat, lon) {
    const map = L.map("map").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([lat, lon]).addTo(map).bindPopup("Story Location").openPopup();
  }

  showStoryDetail(story) {
    const storyDetail = document.getElementById("story-detail");
    storyDetail.innerHTML = `
    <div class="story-detail-card">
      <img class="story-detail-image" src="${story.photoUrl}" alt="${
      story.name
    }" />
      <div class="story-detail-content">
        <h2>${story.name}</h2>
        <p>${story.description}</p>
        <small>Created at: ${new Date(story.createdAt).toLocaleString()}</small>
        <p>Latitude: ${story.lat}</p>
        <p>Longitude: ${story.lon}</p>
        <button id="bookmark-btn">🔖 Bookmark</button>
        <div id="bookmark-status" style="margin-top: 8px; color: green;"></div>
        <div id="map" style="height: 300px; width: 100%; margin-top: 16px;"></div>
      </div>
    </div>
  `;
    // document.getElementById("bookmark-btn").addEventListener("click", () => {
    this.setupBookmarkHandler(story);
    // });

    this.showMap(story.lat, story.lon);
    // this.setupBookmarkHandler(story);
  }
  // adjust the path if needed

  setupBookmarkHandler(story) {
    const bookmarkBtn = document.getElementById("bookmark-btn");
    const status = document.getElementById("bookmark-status");

    const updateStatus = (bookmarked) => {
      bookmarkBtn.textContent = bookmarked ? "🔖 Bookmarked" : "🔖 Bookmark";
      status.textContent = bookmarked ? "Bookmarked!" : "";
    };

    // Check if the story is already bookmarked
    getBookmarkById(story.id).then((existing) => {
      const isBookmarked = !!existing;
      updateStatus(isBookmarked);

      bookmarkBtn.onclick = async () => {
        if (isBookmarked) {
          await deleteBookmark(story.id);
          updateStatus(false);
        } else {
          await addBookmark(story);
          updateStatus(true);
        }
        // Update internal state
        isBookmarked = !isBookmarked;
      };
    });
  }
}
