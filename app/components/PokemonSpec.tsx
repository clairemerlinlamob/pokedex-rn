import {
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewProps,
  Image,
} from "react-native";
import { ThemedText } from "./ThemedText";

type Props = ViewProps & {
  title?: string;
  description?: string;
  image?: ImageSourcePropType;
};

export function PokemonSpec({
  style,
  title,
  description,
  image,
  ...rest
}: Props) {
  return (
    <View style={[style, styles.root]} {...rest}>
      <View style={styles.row}>
        {image && <Image source={image} width={16} height={16} />}
        <ThemedText>{title}</ThemedText>
      </View>
      <ThemedText variant="caption" color="grayMedium">
        {description}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: 4, alignItems: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
  },
});
