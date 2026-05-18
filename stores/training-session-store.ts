import { createEmptySession } from "@/lib/repositories/sessions.repository";
import { create } from "zustand";

type TrainingSessionState = {
  currentSessionId: number | null;
  isStartingSession: boolean;
  startSessionError: string | null;
  setCurrentSession: (sessionId: number | null) => void;
  startTrainingSession: () => Promise<number | null>;
};

export const useTrainingSessionStore = create<TrainingSessionState>((set) => ({
  currentSessionId: null,
  isStartingSession: false,
  startSessionError: null,
  setCurrentSession: (sessionId: number | null): void => {
    set({ currentSessionId: sessionId });
  },
  startTrainingSession: async (): Promise<number | null> => {
    set({ isStartingSession: true, startSessionError: null });

    let sessionId: number | null = null;

    await createEmptySession()
      .then((id) => {
        sessionId = id;
        set({
          currentSessionId: id,
          isStartingSession: false,
          startSessionError: null,
        });
      })
      .catch((error: unknown) => {
        const message: string =
          error instanceof Error
            ? error.message
            : "Unknown error starting session";
        set({
          isStartingSession: false,
          startSessionError: message,
        });
      });

    return sessionId;
  },
}));
