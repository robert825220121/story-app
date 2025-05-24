import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { subscribe } from "../utils/notification-helper";
import { isServiceWorkerAvailable } from "../utils";
class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #transitionContainer = null;

  constructor({
    navigationDrawer,
    drawerButton,
    content,
    transitionContainer,
  }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#transitionContainer = transitionContainer || content;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }
  async #setupPushNotification() {
    // const pushNotificationTools = document.getElementById(
    //   "push-notification-tools"
    // );

    // pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    document
      .getElementById("subscribe-button")
      .addEventListener("click", () => {
        subscribe();
      });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    // this.#transitionContainer.classList.add("page-transition-out");

    await new Promise((resolve) => setTimeout(resolve, 300));

    this.#content.innerHTML = await page.render();
    await page.afterRender();

    this.#transitionContainer.classList.remove("page-transition-out");
    this.#transitionContainer.classList.add("page-transition-in");

    await new Promise((resolve) => setTimeout(resolve, 300));
    this.#transitionContainer.classList.remove("page-transition-in");
  
    // transition.ready.catch(console.error);
    // transition.updateCallbackDone.then(() => {
    //   scrollTo({ top: 0, behavior: "instant" });
    //   this.setupNavigationList();

    //   if (isServiceWorkerAvailable()) {
    //     this.setupPushNotification();
    //   }
    // });
  }

  setPageTransition(options = {}) {
    const {
      transitionOutClass = "page-transition-out",
      transitionInClass = "page-transition-in",
      duration = 300,
    } = options;

    this.transitionOutClass = transitionOutClass;
    this.transitionInClass = transitionInClass;
    this.transitionDuration = duration;
  }
}

export default App;
