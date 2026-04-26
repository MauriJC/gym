import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
//import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ActionCard } from "@/components/ui/action-card";

export default function HomeScreen() {
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
        onPress={() => router.push("/(tabs)/sessions")}
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
