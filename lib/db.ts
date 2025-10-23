
import { openDB, type DBSchema } from "idb";

/**
 * IndexedDB schema.
 * - settings: one record under key "settings"
 * - log: one record per completed day (keyed by dateKey "yyyy-MM-dd")
 * - meta: misc small values (e.g., app version)
 */
interface TrackerDB extends DBSchema {
  settings: {
    key: "settings";
    value: { goal: string; createdAt: string; timezone: string };
  };
  log: {
    key: string; // dateKey "yyyy-MM-dd"
    value: { dateKey: string; done: true };
  };
  meta: {
    key: string;
    value: unknown;
  };
}

export const getDB = () =>
  openDB<TrackerDB>("consistency-tracker", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings");
      }
      if (!db.objectStoreNames.contains("log")) {
        db.createObjectStore("log");
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta");
      }
    },
  });
