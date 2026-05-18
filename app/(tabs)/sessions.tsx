import { ThemedText } from "@/components/themed-text";
import { useTrainingSessionStore } from "@/stores/training-session-store";

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Sessions = () => {
  const currentSessionId = useTrainingSessionStore(
    (state) => state.currentSessionId,
  );

  return (
    <SafeAreaView>
      <ThemedText>Sesiones</ThemedText>
      {currentSessionId !== null ? (
        <ThemedText>Sesión seleccionada ID: {currentSessionId}</ThemedText>
      ) : (
        <ThemedText>No hay sesión seleccionada</ThemedText>
      )}
    </SafeAreaView>
  );
};

export default Sessions;
