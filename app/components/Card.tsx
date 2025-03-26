import { View, ViewProps, StyleSheet } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { Shadows } from "../constants/Shadows";

type Props = ViewProps;

export function Card({ style, ...rest }: Props) {
  const colors = useThemeColors();

  return (
    <View
      style={[style, styles.view, { backgroundColor: colors.white }]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  view: {
    borderRadius: 8,
    ...Shadows.dp2,
  },
});
