import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColors } from "../hooks/useThemeColors";
import { useTheme } from "../context/ThemeContext";

type Props = {
  language: string;
  onPress: () => void;
};

export function LanguageButton({ language, onPress }: Props) {
  const colors = useThemeColors();
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={[styles.button, { backgroundColor: colors.background }]}>
      <ThemedText color={theme === "dark" ? "white" : "primary"} variant="subtitle3">
        {language === "en" ? "EN" : "FR"}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
