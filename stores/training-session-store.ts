import { createEmptySession } from "@/lib/repositories/sessions.repository";
import { create } from "zustand";

type TrainingSessionState = {
  activeSessionId: number | null;
  isStartingSession: boolean;
  startSessionError: string | null;
  startTrainingSession: () => Promise<number | null>;
};

export const useTrainingSessionStore = create<TrainingSessionState>((set) => ({
  activeSessionId: null,
  isStartingSession: false,
  startSessionError: null,
  startTrainingSession: async (): Promise<number | null> => {
    set({ isStartingSession: true, startSessionError: null });

    let sessionId: number | null = null;

    await createEmptySession()
      .then((id: number) => {
        sessionId = id;
        set({
          activeSessionId: id,
          isStartingSession: false,
          startSessionError: null,
        });
      })
      .catch((error: unknown) => {
        const message: string =
          error instanceof Error ? error.message : "Unknown error starting session";
        set({
          isStartingSession: false,
          startSessionError: message,
        });
      });

    return sessionId;
  },
}));
