import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ActionCard } from "@/components/ui/action-card";
import { formatSessionDateDescription } from "@/lib/utils/utils";
import {
  getActiveSessions,
  SessionRow,
} from "@/lib/repositories/sessions.repository";
import { useTrainingSessionStore } from "@/stores/training-session-store";

export default function HomeScreen() {
  const [activeSessions, setActiveSessions] = useState<SessionRow[]>([]);

  const startTrainingSession = useTrainingSessionStore(
    (state) => state.startTrainingSession,
  );
  const setCurrentSession = useTrainingSessionStore(
    (state) => state.setCurrentSession,
  );

  // Esto deberia ir a un hook
  const loadActiveSessions = useCallback((): void => {
    getActiveSessions()
      .then((sessions: SessionRow[]) => {
        setActiveSessions(sessions);
      })
      .catch((error: unknown): void => {
        console.error("Failed to load active sessions", error);
      });
  }, []);

  useFocusEffect(
    useCallback((): void => {
      loadActiveSessions();
    }, [loadActiveSessions]),
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

        {activeSessions.map((session: SessionRow) => (
          <ActionCard
            key={session.id}
            title="Continuar entrenamiento?"
            description={formatSessionDateDescription(session.date)}
            iconName="play-circle"
            onPress={(): void => {
              handleContinueSession(session.id);
            }}
          />
        ))}

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
