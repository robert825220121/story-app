import AddStoryModel from "../../models/add-story-model";

export default class AddStoryPage {
  constructor() {
    // Store references to event listeners so we can properly remove them
    this.boundStopCameraStream = this.stopCameraStream.bind(this);
    this.boundHandleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.stream = null;
  }

  async render() {
    return `
    <section class="container">
      <h1>Add Story</h1>
       <a href="/" class="skip-to-content"
            >Skip to main content</a
          >
      <form id="add-story-form" class="add-story-form">
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" required></textarea>
        </div>
        <div class="form-group">
          <label for="photo">Photo</label>
          <input type="file" id="photo" name="photo" accept="image/*" />
        </div>
        <div class="form-group">
          <label for="camera">Capture Photo</label>
          <button type="button" id="open-camera-button">Open Camera</button>
          <video id="camera-preview" autoplay style="display: none; width: 100%; height: auto;"></video>
          <canvas id="camera-canvas" style="display: none;"></canvas>
          <button type="button" id="capture-photo-button" style="display: none;">Capture Photo</button>
        </div>
        <div class="form-group">
          <label for="drag-drop-area">Drag and Drop Photo</label>
          <div id="drag-drop-area" class="drag-drop-area">
            Drag and drop your photo here or click to select a file.
          </div>
        </div>
        <div class="form-group">
          <label for="map">Select Location</label>
          <div id="map" style="height: 300px; width: 100%;"></div>
          <div id="location-info" style="margin-top: 10px; display: none;">
            Location selected! <button type="button" id="clear-location-button">Clear selection</button>
          </div>
        </div>
        <input type="hidden" id="latitude" name="latitude" />
        <input type="hidden" id="longitude" name="longitude" />
        <button type="submit">Submit</button>
      </form>
    </section>
  `;
  }

  // Function to stop camera stream
  stopCameraStream() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => track.stop());
      this.stream = null;

      // Only update UI elements if they exist
      const cameraPreview = document.getElementById("camera-preview");
      const capturePhotoButton = document.getElementById(
        "capture-photo-button"
      );
      const photoInput = document.getElementById("photo");
      const dragDropArea = document.getElementById("drag-drop-area");

      if (cameraPreview) cameraPreview.style.display = "none";
      if (capturePhotoButton) capturePhotoButton.style.display = "none";

      // Re-enable file input and drag-and-drop area
      if (photoInput) photoInput.disabled = false;
      if (dragDropArea) dragDropArea.classList.remove("disabled");

      console.log("Camera stream stopped successfully");
    }
  }

  // Handle visibility changes
  handleVisibilityChange() {
    if (document.visibilityState === "hidden") {
      this.stopCameraStream();
    }
  }

  // Add all event listeners
  addEventListeners() {
    // Global events for page navigation/close
    window.addEventListener("beforeunload", this.boundStopCameraStream);
    window.addEventListener("pagehide", this.boundStopCameraStream);
    document.addEventListener(
      "visibilitychange",
      this.boundHandleVisibilityChange
    );

    // For SPAs, listen for route changes
    // This will depend on your specific router implementation
    // For example with a custom event:
    document.addEventListener("router:navigate", this.boundStopCameraStream);
  }

  // Remove all event listeners
  removeEventListeners() {
    window.removeEventListener("beforeunload", this.boundStopCameraStream);
    window.removeEventListener("pagehide", this.boundStopCameraStream);
    document.removeEventListener(
      "visibilitychange",
      this.boundHandleVisibilityChange
    );
    document.removeEventListener("router:navigate", this.boundStopCameraStream);
  }

  async afterRender() {
    const model = new AddStoryModel();

    // Add all event listeners
    this.addEventListeners();

    // Initialize the map
    const map = L.map("map").setView([0, 0], 2); // Default view
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );

    let selectedLat = null;
    let selectedLon = null;
    let currentMarker = null;
    const locationInfo = document.getElementById("location-info");
    const clearLocationButton = document.getElementById(
      "clear-location-button"
    );

    map.on("click", (event) => {
      // If a marker already exists, don't add another one
      if (currentMarker) {
        return;
      }

      const { lat, lng } = event.latlng;
      selectedLat = lat;
      selectedLon = lng;

      // Update hidden inputs
      document.getElementById("latitude").value = lat;
      document.getElementById("longitude").value = lng;

      // Add a marker to the map
      currentMarker = L.marker([lat, lng]).addTo(map);

      // Show location info with clear button
      locationInfo.style.display = "block";
    });

    // Add clear button functionality
    clearLocationButton.addEventListener("click", () => {
      if (currentMarker) {
        map.removeLayer(currentMarker);
        currentMarker = null;
        selectedLat = null;
        selectedLon = null;
        document.getElementById("latitude").value = "";
        document.getElementById("longitude").value = "";
        locationInfo.style.display = "none";
      }
    });

    // Handle camera capture
    const openCameraButton = document.getElementById("open-camera-button");
    const capturePhotoButton = document.getElementById("capture-photo-button");
    const cameraPreview = document.getElementById("camera-preview");
    const cameraCanvas = document.getElementById("camera-canvas");
    const photoInput = document.getElementById("photo");
    const dragDropArea = document.getElementById("drag-drop-area");

    openCameraButton.addEventListener("click", async () => {
      try {
        // Disable file input and drag-and-drop area when using the camera
        photoInput.disabled = true;
        dragDropArea.classList.add("disabled");

        this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        cameraPreview.srcObject = this.stream;
        cameraPreview.style.display = "block";
        capturePhotoButton.style.display = "inline-block";
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Unable to access the camera.");
      }
    });

    capturePhotoButton.addEventListener("click", () => {
      if (!this.stream) {
        alert("Camera is not active.");
        return;
      }

      const context = cameraCanvas.getContext("2d");
      cameraCanvas.width = cameraPreview.videoWidth;
      cameraCanvas.height = cameraPreview.videoHeight;
      context.drawImage(
        cameraPreview,
        0,
        0,
        cameraCanvas.width,
        cameraCanvas.height
      );

      // Convert canvas to blob and set it as the photo input
      cameraCanvas.toBlob((blob) => {
        const file = new File([blob], "captured-photo.jpg", {
          type: "image/jpeg",
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;
      });

      // Stop the camera
      this.stopCameraStream();
    });

    // Handle file input
    photoInput.addEventListener("change", () => {
      // Disable camera button and drag-and-drop area when a file is selected
      if (photoInput.files.length > 0) {
        openCameraButton.disabled = true;
        dragDropArea.classList.add("disabled");
      } else {
        openCameraButton.disabled = false;
        dragDropArea.classList.remove("disabled");
      }
    });

    // Handle drag-and-drop
    dragDropArea.addEventListener("dragover", (event) => {
      event.preventDefault();
      dragDropArea.classList.add("drag-over");
    });

    dragDropArea.addEventListener("dragleave", () => {
      dragDropArea.classList.remove("drag-over");
    });

    dragDropArea.addEventListener("drop", (event) => {
      event.preventDefault();
      dragDropArea.classList.remove("drag-over");

      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;

        // Disable camera button when a file is dropped
        openCameraButton.disabled = true;
      } else {
        alert("Please drop a valid image file.");
      }
    });

    // Handle form submission
    const form = document.getElementById("add-story-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const description = document.getElementById("description").value;
      const photo = document.getElementById("photo").files[0];
      const latitude = document.getElementById("latitude").value;
      const longitude = document.getElementById("longitude").value;

      if (!latitude || !longitude) {
        alert("Please select a location on the map.");
        return;
      }

      if (!photo) {
        alert("Please provide a photo using either the camera or file input.");
        return;
      }

      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", photo);
      formData.append("lat", latitude);
      formData.append("lon", longitude);

      try {
        const response = await model.addStory(formData);

        // Make sure to clean up camera before redirecting
        // console.log("RESPONSE", response);

        // this.notifyToAllUser(response.data.id);
        this.stopCameraStream();

        // alert("Story added successfully!");
        window.location.href = "/"; // Redirect to the home page
      } catch (error) {
        console.error("Error adding story:", error);
        alert("Failed to add story.");
      }
    });
  }

  // Method to be called when this component is being unmounted/destroyed
  destroy() {
    this.stopCameraStream();
    this.removeEventListeners();

    // Clean up any other resources
    console.log("AddStoryPage component destroyed");
  }
}
