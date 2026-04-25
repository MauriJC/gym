import * as SQLite from "expo-sqlite";

type UserVersionRow = {
  user_version: number;
};

// Single source of truth for DB filename and latest schema version.
const DATABASE_NAME: string = "gym.db";
const SCHEMA_VERSION: number = 1;

// Cached connection to avoid opening multiple DB handles.
let databaseInstance: SQLite.SQLiteDatabase | null = null;

const createV1Schema = async (
  database: SQLite.SQLiteDatabase,
): Promise<void> => {
  // V1 bootstraps all core tables and indexes in one idempotent script.
  await database.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      notes TEXT CHECK (length(notes) <= 300)
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL CHECK (length(name) <= 100),
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS exercise_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      order_in_session INTEGER,
      notes TEXT CHECK (length(notes) <= 200),
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS exercise_series (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_log_id INTEGER NOT NULL,
      reps INTEGER NOT NULL CHECK (reps > 0),
      weight REAL NOT NULL CHECK (weight >= 0),
      completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
      FOREIGN KEY (exercise_log_id) REFERENCES exercise_logs(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_exercise_logs_session_id ON exercise_logs(session_id);
    CREATE INDEX IF NOT EXISTS idx_exercise_logs_exercise_id ON exercise_logs(exercise_id);
    CREATE INDEX IF NOT EXISTS idx_exercise_series_log_id ON exercise_series(exercise_log_id);
  `);
};

const getCurrentSchemaVersion = async (
  database: SQLite.SQLiteDatabase,
): Promise<number> => {
  // SQLite stores app-managed schema version in PRAGMA user_version.
  const row: UserVersionRow | null = (await database.getFirstAsync(
    "PRAGMA user_version;",
  )) as UserVersionRow | null;
  const currentVersion: number = row?.user_version ?? 0;

  return currentVersion;
};

const setSchemaVersion = async (
  database: SQLite.SQLiteDatabase,
  version: number,
): Promise<void> => {
  // We move the version only after a migration step succeeds.
  await database.execAsync(`PRAGMA user_version = ${version};`);
};

export const openDb = async (): Promise<SQLite.SQLiteDatabase> => {
  // Lazy open: connection is created on first use.
  if (!databaseInstance) {
    databaseInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databaseInstance;
};

export const runMigrations = async (
  database: SQLite.SQLiteDatabase,
): Promise<void> => {
  const currentVersion: number = await getCurrentSchemaVersion(database);

  // Sequential migrations let us upgrade old installs safely.
  if (currentVersion < 1) {
    await createV1Schema(database);
    await setSchemaVersion(database, 1);
  }
};

export const initDb = async (): Promise<SQLite.SQLiteDatabase> => {
  // App entrypoint for DB lifecycle: open connection then migrate.
  const database: SQLite.SQLiteDatabase = await openDb();
  await runMigrations(database);

  if (SCHEMA_VERSION > 1) {
    await setSchemaVersion(database, SCHEMA_VERSION);
  }

  return database;
};
