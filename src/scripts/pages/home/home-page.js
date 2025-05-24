import HomeModel from "../../models/home-model";
import { HomePresenter } from "../../presenter/home-presenter";
import { subscribe, unSubscribe } from "../../utils/notification-helper";
export default class HomePage {
  async render() {
    return `
      <section class="container">
        <button id="login-button" class="login-button">Login</button>
        <button id="subscribe-button" class="subscribe-button">Subscribe</button>
     
        <button id="add-story-button" class="login-button">Add Story</button>
        <button id="bookmark" class="bookmark">Bookmark</button>
        <div id="loading-message" class="loading-message" style="display: none;">Loading...</div>
        <div id="error-message" class="error-message" style="display: none;"></div>
        <div id="map" style="height: 300px; margin-top: 30px; margin-bottom: 30px ; border-radius:10px"></div>
        
        <div id="stories-container" class="stories-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const model = new HomeModel();
    const presenter = new HomePresenter(model, this);
    this.setupButtonListeners();
    presenter.loadStories();
    document
      .getElementById("subscribe-button")
      .addEventListener("click", () => {
        Notification.requestPermission().then((perm) => {
          alert(perm);
        });
        subscribe();
      });
  }

  setupButtonListeners() {
    const bookmarkButton = document.getElementById("bookmark");
    if (bookmarkButton) {
      bookmarkButton.addEventListener("click", () => {
        window.location.href = "/#/book-mark";
      });
    }
    const loginButton = document.getElementById("login-button");
    if (loginButton) {
      loginButton.addEventListener("click", () => {
        window.location.href = "/#/login";
      });
    }

    const addStoryButton = document.getElementById("add-story-button");
    if (addStoryButton) {
      addStoryButton.addEventListener("click", () => {
        window.location.href = "/#/add-story";
      });
    }
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

  showStories(stories) {
    const storiesContainer = document.getElementById("stories-container");
    storiesContainer.innerHTML = stories
      .map(
        (story) => `
          <div class="story-card">
            <img class="story-image" src="${story.photoUrl}" alt="${
          story.name
        }" />
            <div class="story-content">
              <h3 class="story-title">Name : ${story.name}</h3>
              <p class="story-description">Description : ${
                story.description
              }</p>
              <small class="story-date">Created at: ${new Date(
                story.createdAt
              ).toLocaleString()}</small>
              <button class="view-details-button" data-id="${
                story.id
              }">View Details</button>
            </div>
          </div>
        `
      )
      .join("");
    const detailButtons = document.querySelectorAll(".view-details-button");
    detailButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const storyId = event.target.getAttribute("data-id");
        this.viewStoryDetails(storyId);
      });
    });
    const mapContainer = document.getElementById("map");
    const map = L.map(mapContainer).setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data © OpenStreetMap contributors",
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }

  viewStoryDetails(storyId) {
    console.log(storyId);
    window.location.href = `/#/story/#/id=${storyId}`;
  }
}
