import { View, ViewProps } from "react-native";
import { useShadows } from "../hooks/useShadows";
import { useThemeColors } from "../hooks/useThemeColors";

type Props = ViewProps;

export function Card({ style, ...rest }: Props) {
  const shadows = useShadows();
  const colors = useThemeColors();
  
  return (
    <View
      style={[
        {
          backgroundColor: colors.background, 
          borderRadius: 8,
          ...shadows.dp2,
        },
        style,
      ]}
      {...rest}
    />
  );
}
