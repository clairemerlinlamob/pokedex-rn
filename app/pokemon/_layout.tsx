import { Stack } from "expo-router";
import { useThemeColors } from "../hooks/useThemeColors";
import Animated, {
  Easing,
  interpolateColor,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Colors } from "../constants/Colors";
import { ColorContext } from "./ColorContext";

export default function PokemonLayout() {
  const colors = useThemeColors();
  const progress = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.primary, Colors.type.normal]
      ),
    };
  });

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      reduceMotion: ReduceMotion.System,
    });
  }, [colors.primary]);

  return (
    <ColorContext.Provider value={{ colorType: Colors.type.normal }}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </Animated.View>
    </ColorContext.Provider>
  );
} 