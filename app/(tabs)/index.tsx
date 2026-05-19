import { ThemedText } from "@/components/themed-text";
import { ActionCard } from "@/components/ui/action-card";
import {
  getMostRecentActiveSession,
  SessionRow,
} from "@/lib/repositories/sessions.repository";
import { formatSessionDateDescription } from "@/lib/utils/utils";
import { useTrainingSessionStore } from "@/stores/training-session-store";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [mostRecentActiveSession, setMostRecentActiveSession] =
    useState<SessionRow | null>(null);

  const startTrainingSession = useTrainingSessionStore(
    (state) => state.startTrainingSession,
  );
  const setCurrentSession = useTrainingSessionStore(
    (state) => state.setCurrentSession,
  );

  // Esto deberia ir a un hook
  const loadMostRecentActiveSession = useCallback((): void => {
    getMostRecentActiveSession()
      .then((session: SessionRow | null) => {
        setMostRecentActiveSession(session);
      })
      .catch((error: unknown): void => {
        console.error("Failed to load most recent active session", error);
      });
  }, []);

  useFocusEffect(
    useCallback((): void => {
      loadMostRecentActiveSession();
    }, [loadMostRecentActiveSession]),
  );

  const handleContinueSession = (sessionId: number): void => {
    setCurrentSession(sessionId);
    router.push("/(tabs)/sessions");
  };

  const handleStartTraining = (): void => {
    startTrainingSession()
      .then((sessionId: number | null) => {
        if (sessionId !== null) {
          router.push("/(tabs)/sessions");
          return;
        }

        const message: string | null =
          useTrainingSessionStore.getState().startSessionError;
        Alert.alert(
          "No se pudo iniciar la sesión",
          message ?? "Probá de nuevo en un momento.",
        );
      })
      .catch((error: unknown): void => {
        console.error("Failed to start training session", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <ThemedText type="title">GymTrack!</ThemedText>
          <ThemedText>Tu progreso, tu fuerza</ThemedText>
        </View>

        {mostRecentActiveSession !== null && (
          <ActionCard
            title="Continuar entrenamiento?"
            description={formatSessionDateDescription(
              mostRecentActiveSession.date,
            )}
            iconName="play"
            onPress={(): void => {
              handleContinueSession(mostRecentActiveSession.id);
            }}
          />
        )}

        <ActionCard
          title="Listo para entrenar?"
          description="Iniciar entrenamiento"
          iconName="play"
          onPress={handleStartTraining}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  titleContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
  },
});
