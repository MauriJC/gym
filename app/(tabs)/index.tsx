import { Alert, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
//import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ActionCard } from "@/components/ui/action-card";
import { useTrainingSessionStore } from "@/stores/training-session-store";

export default function HomeScreen() {
  const startTrainingSession = useTrainingSessionStore(
    (state) => state.startTrainingSession,
  );

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
      <View style={styles.titleContainer}>
        <ThemedText type="title">GymTrack!</ThemedText>
        <ThemedText>Tu progreso, tu fuerza</ThemedText>
      </View>

      <ActionCard
        title="Listo para entrenar?"
        description="Iniciar entrenamiento"
        iconName="play"
        onPress={handleStartTraining}
      />

      {/*  
      Dejo comentado esto para usarlo de guia despues
      <View style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
        </Link>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
