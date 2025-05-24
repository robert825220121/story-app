import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";

import { ExpirationPlugin } from "workbox-expiration";
import CONFIG from "./config";

// Do precaching
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);
registerRoute(
  ({ request, url }) =>
    url.pathname.includes("/login") || url.pathname.includes("/register"),
  new NetworkFirst({
    cacheName: "auth-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  ({ url }) =>
    url.origin === "https://tile.openstreetmap.org" ||
    url.origin.endsWith(".tile.openstreetmap.org"),
  new CacheFirst({
    cacheName: "osm-tiles-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Only cache successful responses
      }),
      new ExpirationPlugin({
        maxEntries: 100, // Keep last 100 tiles
        maxAgeSeconds: 30 * 24 * 60 * 60, // Expire after 30 days
      }),
    ],
  })
);
// registerRoute(navigationRoute);
// Runtime caching
// registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html")));
registerRoute(
  ({ url }) => {
    return (
      url.origin === "https://cdnjs.cloudflare.com" ||
      url.origin.includes("fontawesome")
    );
  },
  new CacheFirst({
    cacheName: "fontawesome",
  })
);
registerRoute(
  ({ url }) => {
    return url.origin === "https://ui-avatars.com";
  },
  new CacheFirst({
    cacheName: "avatars-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
   
    return baseUrl.origin === url.origin && request.destination !== "image";
  },
  new NetworkFirst({
    cacheName: "story-api",
  })
);
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
  
    return baseUrl.origin === url.origin && request.destination === "image";
  },
  new StaleWhileRevalidate({
    cacheName: "story-api-images",
  })
);

registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "html-pages",
  })
);
registerRoute(
  ({ url }) => {
    return (
      url.origin === "https://unpkg.com" && url.pathname.includes("leaflet")
    );
  },
  new CacheFirst({
    cacheName: "leaflet-library",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);

    return baseUrl.origin === url.origin && request.destination === "image";
  },
  new StaleWhileRevalidate({
    cacheName: "story-api-images",
  })
);
registerRoute(
  ({ url }) => {
    return url.origin.includes("maptiler");
  },
  new CacheFirst({
    cacheName: "maptiler-api",
  })
);
self.addEventListener("push", (event) => {

  async function chainPromise() {
    const data = await event.data.json();

    await self.registration.showNotification(data.title, {
      body: data.options.body,
    });
  }

  event.waitUntil(chainPromise());
});
