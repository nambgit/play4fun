"use client";

import { RECORDS, type RecordValue } from "./record-keys";

/**
 * Keeps localStorage records and the signed-in account in sync.
 * Games are unchanged: they read/write their localStorage keys; they only call
 * notifyRecordChanged() after saving a new record so it reaches the account right away.
 */

const EVENT = "p4f:record";

export function notifyRecordChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

export function onRecordChanged(fn: () => void) {
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* storage blocked: the account still holds the record */
  }
}

/** Records on this device. Quiz results ("latest") only when asked, so a stale device never overwrites a newer result. */
export function localRecords(includeLatest: boolean): RecordValue[] {
  const out: RecordValue[] = [];
  for (const def of RECORDS) {
    const raw = read(def.storage);
    if (!raw) continue;
    if (def.kind === "best") {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) out.push({ key: def.key, value: Math.round(n) });
    } else if (includeLatest) {
      out.push({ key: def.key, value: 0, meta: { result: raw } });
    }
  }
  return out;
}

/** Bring account records down to this device (higher best wins; fill quiz results this device lacks) */
export function applyToDevice(records: RecordValue[]) {
  for (const r of records) {
    const def = RECORDS.find((d) => d.key === r.key);
    if (!def) continue;
    if (def.kind === "best") {
      const local = Number(read(def.storage)) || 0;
      if (r.value > local) write(def.storage, String(r.value));
    } else if (r.meta?.result && !read(def.storage)) {
      write(def.storage, r.meta.result);
    }
  }
}

/** Push this device's records, store the merged result locally, return it */
export async function syncRecords(includeLatest: boolean): Promise<RecordValue[] | null> {
  try {
    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ records: localRecords(includeLatest) }),
      credentials: "same-origin",
    });
    if (!res.ok) return null;
    const { records } = (await res.json()) as { records: RecordValue[] };
    applyToDevice(records);
    return records;
  } catch {
    return null; // offline: try again on the next record / page load
  }
}
