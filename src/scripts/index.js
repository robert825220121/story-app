import "../styles/styles.css";

import App from "./pages/app";
import { registerServiceWorker } from "./utils";
document.addEventListener("DOMContentLoaded", async () => {
  // if (Notification.permission !== "granted") {
  //   Notification.requestPermission();
  // }
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await registerServiceWorker();
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
