import { openDb } from "@/lib/db";
import { SessionStatus, SessionStatusValue } from "@/lib/session-status";

export type SessionRow = {
  id: number;
  date: string;
  notes: string | null;
  status: SessionStatusValue;
};

/**
 * Inserts a new session row with no exercises yet (notes optional in schema).
 * Uses ISO datetime for `date` so it stays consistent across locales.
 */
export const createEmptySession = async (): Promise<number> => {
  const database = await openDb();
  const dateIso: string = new Date().toISOString();
  const result = await database.runAsync(
    "INSERT INTO sessions (date, notes, status) VALUES (?, ?, ?)",
    dateIso,
    null,
    SessionStatus.Active,
  );

  return result.lastInsertRowId;
};

export const getActiveSessions = async (): Promise<SessionRow[]> => {
  const database = await openDb();
  const rows: SessionRow[] = await database.getAllAsync<SessionRow>(
    "SELECT id, date, notes, status FROM sessions WHERE status = ? ORDER BY date DESC",
    SessionStatus.Active,
  );

  return rows;
};
