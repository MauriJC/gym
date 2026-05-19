import { ThemedText } from "@/components/themed-text";
import { ActionCard } from "@/components/ui/action-card";
import { Button } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useTrainingSessionStore } from "@/stores/training-session-store";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";

import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Sessions = () => {
  const currentSessionId = useTrainingSessionStore(
    (state) => state.currentSessionId,
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentSessionId !== null ? (
          <ThemedText>Sesión seleccionada ID: {currentSessionId}</ThemedText>
        ) : (
          <ActionCard
            title="Iniciar entrenamiento?"
            description="Empezar a entrenar"
            iconName="play"
            onPress={() => {
              console.log("Seleccionando sesión");
            }}
          />
        )}
      </ScrollView>

      {currentSessionId !== null && (
        <Button
          style={styles.footerButton}
          title="FINALIZAR SESIÓN"
          icon={
            <MaterialCommunityIcons
              name="flag-checkered"
              size={24}
              color={Colors.dark.text}
            />
          }
          onPress={() => {
            console.log("Finalizando session");
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  footerButton: {
    marginHorizontal: 6,
    marginBottom: 16,
  },
});

export default Sessions;
