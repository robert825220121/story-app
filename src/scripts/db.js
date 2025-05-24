// db.js
// db.js
import { openDB } from "idb";

const DB_NAME = "StoriesDB";
const DB_VERSION = 2; // bump the version when changing structure

const STORES = {
  STORIES: "stories",
  BOOKMARKS: "bookmarks",
};

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORES.STORIES)) {
        db.createObjectStore(STORES.STORIES, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
        db.createObjectStore(STORES.BOOKMARKS, { keyPath: "id" });
      }
    },
  });
};

// Bookmark CRUD

export const addBookmark = async (story) => {
  const db = await initDB();
  const tx = db.transaction(STORES.BOOKMARKS, "readwrite");
  await tx.objectStore(STORES.BOOKMARKS).put(story);
  await tx.done;
};

export const getAllBookmarks = async () => {
  const db = await initDB();
  return db.getAll(STORES.BOOKMARKS);
};

export const getBookmarkById = async (id) => {
  const db = await initDB();
  return db.get(STORES.BOOKMARKS, id);
};

export const deleteBookmark = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORES.BOOKMARKS, "readwrite");
  await tx.objectStore(STORES.BOOKMARKS).delete(id);
  await tx.done;
};

export const updateBookmark = async (story) => {
  // Just re-use addBookmark since it does a "put" (insert or update)
  await addBookmark(story);
};
