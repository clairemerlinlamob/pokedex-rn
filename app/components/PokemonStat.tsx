import { StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColors } from "../hooks/useThemeColors";
import { statShortName } from "../functions/pokemon";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

type Props = ViewProps & {
  name: string;
  value: number;
  color: string;
};

export function PokemonStat({ style, name, value, color, ...rest }: Props) {
  const colors = useThemeColors();
  const progress = useSharedValue(0);
  
  const barStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  useEffect(() => {
    progress.value = withTiming(value / 255, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });
  }, [value]);

  return (
    <View style={[style, styles.row]} {...rest}>
      <View style={[styles.name, { borderColor: colors.grayLight }]}>
        <ThemedText variant="subtitle3" style={{ color: color }}>
          {statShortName(name)}
        </ThemedText>
      </View>
      <View style={styles.value}>
        <ThemedText>{value.toString().padStart(3, "0")}</ThemedText>
      </View>
      <View style={styles.bar}>
        <Animated.View
          style={[styles.barInner, barStyle, { backgroundColor: color }]}
        />
        <View
          style={[
            styles.barBackground,
            { backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: {
    width: 40,
    paddingRight: 8,
    borderRightWidth: 1,
    borderStyle: "solid",
  },
  value: {
    width: 23,
  },
  bar: {
    flex: 1,
    borderRadius: 20,
    height: 4,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  barInner: {
    height: 4,
  },
  barBackground: { 
    flex: 1,
    height: 4, 
    opacity: 0.24 
  },
});
