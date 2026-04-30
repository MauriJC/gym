import { ThemedText } from "@/components/themed-text";
import { useTrainingSessionStore } from "@/stores/training-session-store";

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Sessions = () => {
  const activeSessionId = useTrainingSessionStore(
    (state) => state.activeSessionId,
  );

  return (
    <SafeAreaView>
      <ThemedText>Sesiones</ThemedText>
      {activeSessionId !== null ? (
        <ThemedText>Sesión activa ID: {activeSessionId}</ThemedText>
      ) : (
        <ThemedText>No hay sesión activa</ThemedText>
      )}
    </SafeAreaView>
  );
};

export default Sessions;
