import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, Image, View, Pressable } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { ThemedText } from "../components/ThemedText";
import { useFetchQuery } from "../hooks/useFetchQuery";
import { Colors } from "../constants/Colors";
import {
  formatHeight,
  formatWeight,
  getPokemonArtwork,
} from "../functions/pokemon";
import { Card } from "../components/Card";
import { capitalizeFirstLetter } from "../functions/utils";
import { PokemonType } from "../components/PokemonType";
import { PokemonSpec } from "../components/PokemonSpec";

export default function Pokemon() {
  const params = useLocalSearchParams() as { id: string };
  const colors = useThemeColors();
  const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id });
  const { data: species } = useFetchQuery("/pokemon-species/[id]", {
    id: params.id,
  });

  const mainType = pokemon?.types[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.primary;
  const types = pokemon?.types ?? [];
  const bio = species?.flavor_text_entries
    ?.find(({ language }) => language.name === "en")
    ?.flavor_text.replaceAll("\n", ". ");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorType }]}>
      <View>
        <Image
          style={styles.pokeball}
          source={require("../../assets/images/pokeball_big.png")}
        />
        <View style={[styles.row, styles.header]}>
          <View style={styles.row}>
            <Pressable onPress={router.back}>
              <Image
                source={require("../../assets/images/arrow_back.png")}
                width={32}
                height={32}
              />
            </Pressable>
            <ThemedText color="white" variant="headline">
              {capitalizeFirstLetter(pokemon?.name ?? "")}
            </ThemedText>
          </View>
          <ThemedText color="white" variant="subtitle2">
            #{params.id.padStart(3, "0")}
          </ThemedText>
        </View>
        <Card style={styles.body}>
          <Image
            style={styles.artwork}
            source={{
              uri: getPokemonArtwork(params.id),
            }}
            width={200}
            height={200}
          />
          <View style={styles.row}>
            {types.map((type) => (
              <PokemonType name={type.type.name} key={type.type.name} />
            ))}
          </View>

          {/* ABOUT */}

          <ThemedText variant="subtitle1" style={{ color: colorType }}>
            About
          </ThemedText>
          <View style={styles.row}>
            <PokemonSpec
              style={{
                borderStyle: "solid",
                borderRightWidth: 1,
                borderColor: colors.grayLight,
              }}
              title={formatWeight(pokemon?.weight)}
              description={"Weight"}
              image={require("../../assets/images/weight.png")}
            />
            <PokemonSpec
              style={{
                borderStyle: "solid",
                borderRightWidth: 1,
                borderColor: colors.grayLight,
              }}
              title={formatHeight(pokemon?.height)}
              description={"Height"}
              image={require("../../assets/images/height.png")}
            />
            <PokemonSpec
              title={pokemon?.moves
                .slice(0, 2)
                .map((m) => m.move.name)
                .join("\n")}
              description={"Moves"}
            />
          </View>
          <ThemedText>{bio}</ThemedText>

          {/* BASE STATS */}

          <ThemedText variant="subtitle1" style={{ color: colorType }}>
            Base stats
          </ThemedText>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  header: {
    margin: 20,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pokeball: { position: "absolute", right: 8, top: 8 },
  artwork: {
    alignSelf: "center",
    position: "absolute",
    top: -140,
  },
  body: {
    marginTop: 144,
    paddingHorizontal: 20,
    paddingTop: 60,
    gap: 16,
    alignItems: "center",
  },
});
