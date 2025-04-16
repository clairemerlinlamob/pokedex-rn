import { StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "../constants/Colors";
import { capitalizeFirstLetter } from "../functions/utils";
import { useLanguage } from "../context/LanguageContext";
import { useFetchQuery } from "../hooks/useFetchQuery";

type Props = ViewProps & {
  name: keyof (typeof Colors)["type"];
};

export function PokemonType({ name, ...rest }: Props) {
  const { language } = useLanguage();
  const { data: typeData } = useFetchQuery("/type/[id]", { id: name });
  
  const typeName = typeData?.names
    ?.find(({ language: lang }) => lang.name === language)
    ?.name ?? name;

  return (
    <View style={[styles.container, { backgroundColor: Colors.type[name] }]} {...rest}>
      <ThemedText color="white" variant="subtitle3">
        {capitalizeFirstLetter(typeName)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
});
