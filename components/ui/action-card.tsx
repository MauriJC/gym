import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { BorderRadius, Colors } from "@/constants/theme";

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type ActionCardProps = {
  title: string;
  description: string;
  iconName: MaterialIconName;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
};

export const ActionCard = ({
  title,
  description,
  iconName,
  onPress,
  containerStyle,
  iconSize = 50,
}: ActionCardProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View>
        <ThemedText style={styles.title} type="subtitle">
          {title}
        </ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </View>

      <Pressable onPress={onPress} style={styles.iconButton}>
        <MaterialCommunityIcons
          name={iconName}
          size={iconSize}
          color={Colors.dark.text}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: Colors.dark.background,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    color: Colors.dark.text,
  },
  description: {
    color: Colors.dark.text,
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
