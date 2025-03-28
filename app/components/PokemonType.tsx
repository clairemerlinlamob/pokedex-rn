import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import { ThemedText } from "./ThemedText";
import { capitalizeFirstLetter } from "../functions/utils";
import { useThemeColors } from "../hooks/useThemeColors";

type Props = {
  name: keyof (typeof Colors)["type"];
};

export function PokemonType({ name }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: Colors.type[name] }]}>
      <ThemedText color="white" variant="subtitle3">
        {capitalizeFirstLetter(name)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
