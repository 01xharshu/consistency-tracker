
"use client";

import { format } from "date-fns";
import { getDB } from "./db";

export const DATE_FMT = "yyyy-MM-dd";

export const getTodayKey = (d = new Date()) => format(d, DATE_FMT);

export function hasConsent() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("consent") === "1";
  } catch {
    return false;
  }
}

export function writeConsent(consented: boolean) {
  try {
    localStorage.setItem("consent", consented ? "1" : "0");
  } catch {
    // ignore (e.g., storage blocked)
  }
}

export async function initSettings(goal: string) {
  const db = await getDB();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  await db.put(
    "settings",
    { goal, createdAt: new Date().toISOString(), timezone },
    "settings"
  );
}

export async function readSettings() {
  const db = await getDB();
  return db.get("settings", "settings");
}

export async function updateGoal(goal: string) {
  const db = await getDB();
  const s = (await db.get("settings", "settings")) ?? {
    goal: "",
    createdAt: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  s.goal = goal;
  await db.put("settings", s, "settings");
}

export async function markTodayDone(date = new Date()) {
  const db = await getDB();
  const key = getTodayKey(date);
  const exists = await db.get("log", key);
  if (exists) return false;
  await db.put("log", { dateKey: key, done: true }, key);
  return true;
}

export async function isTodayDone(date = new Date()) {
  const db = await getDB();
  const key = getTodayKey(date);
  return Boolean(await db.get("log", key));
}

export async function getAllLogKeys(limitDays = 400) {
  const db = await getDB();
  const tx = db.transaction("log");
  const keys = (await tx.store.getAllKeys()) as string[];
  // sorted ascending → slice → return ascending
  const asc = keys.sort();
  const last = asc.slice(-limitDays);
  return last;
}

export async function resetAll() {
  const db = await getDB();
  await db.clear("log");
}
