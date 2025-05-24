import { getAllBookmarks, deleteBookmark } from "../../db";

export default class BookmarkPage {
  async render() {
    return `
      <section class="container">
        <h1>Bookmarked Stories</h1>
        <div id="stories-container" class="stories-container">
          <div id="bookmark-list" class="bookmark-list"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const listEl = document.getElementById("bookmark-list");

    try {
      const bookmarks = await getAllBookmarks();

      if (!bookmarks.length) {
        listEl.innerHTML = `<p>No bookmarks found.</p>`;
        return;
      }

      listEl.innerHTML = bookmarks
        .map((story) => {
          return `
            <div class="bookmark-card" data-id="${story.id}">
              <img src="${story.photoUrl}" alt="${story.name}" class="bookmark-image" />
              <div class="bookmark-content">
                <h2>${story.name}</h2>
                <p>${story.description}</p>
                <button class="remove-bookmark-button" data-id="${story.id}">❌ Remove Bookmark</button>
                <button class="view-details-button" data-id="${story.id}">View Details</button>
              </div>
            </div>
          `;
        })
        .join("");

      // Attach event listeners to dynamically created buttons
      this.attachButtonHandlers();
    } catch (error) {
      listEl.innerHTML = `<p>Error loading bookmarks: ${error.message}</p>`;
    }
  }

  attachButtonHandlers() {
    // Handle remove bookmark
    const removeButtons = document.querySelectorAll(".remove-bookmark-button");
    removeButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const storyId = event.target.getAttribute("data-id");
        await deleteBookmark(storyId);
        this.afterRender(); // re-render the list after deletion
      });
    });

    // Handle view details
    const viewButtons = document.querySelectorAll(".view-details-button");
    viewButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const storyId = event.target.getAttribute("data-id");
        this.viewStoryDetails(storyId);
      });
    });
  }

  viewStoryDetails(storyId) {
    window.location.href = `/#/story/#/id=${storyId}`;
  }
}
