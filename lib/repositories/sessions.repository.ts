import { openDb } from "@/lib/db";

/**
 * Inserts a new session row with no exercises yet (notes optional in schema).
 * Uses ISO datetime for `date` so it stays consistent across locales.
 */
export const createEmptySession = async (): Promise<number> => {
  const database = await openDb();
  const dateIso: string = new Date().toISOString();
  const result = await database.runAsync(
    "INSERT INTO sessions (date, notes) VALUES (?, ?)",
    dateIso,
    null,
  );

  return result.lastInsertRowId;
};
