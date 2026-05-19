import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BorderRadius, Colors } from "@/constants/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function Button({ title, onPress, icon, style, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        <ThemedText style={styles.label} type="defaultSemiBold">
          {title}
        </ThemedText>
        {icon}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.background,
    borderRadius: BorderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: Colors.dark.text,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
