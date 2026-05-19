import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BorderRadius, Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type ButtonProps = {
  title: string;
  onPress: () => void;
  iconName?: MaterialIconName;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

function getButtonContentColor(colorScheme: "light" | "dark") {
  if (colorScheme === "dark") {
    return Colors.light.text;
  }

  return Colors.dark.text;
}

export function Button({
  title,
  onPress,
  iconName,
  iconSize = 24,
  style,
  disabled,
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const contentColor = getButtonContentColor(colorScheme);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isDark ? styles.buttonDark : styles.buttonLight,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" style={{ color: contentColor }}>
          {title}
        </ThemedText>
        {iconName && (
          <MaterialCommunityIcons
            name={iconName}
            size={iconSize}
            color={contentColor}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLight: {
    backgroundColor: Colors.dark.background,
  },
  buttonDark: {
    backgroundColor: Colors.light.background,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
