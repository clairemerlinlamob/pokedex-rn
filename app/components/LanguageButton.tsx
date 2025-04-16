import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColors } from "../hooks/useThemeColors";

type Props = {
  language: string;
  onPress: () => void;
};

export function LanguageButton({ language, onPress }: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors.white }]}
    >
      <ThemedText color="primary" variant="subtitle3">
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