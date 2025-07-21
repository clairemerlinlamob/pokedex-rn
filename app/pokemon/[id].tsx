import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { ThemedText } from "../components/ThemedText";
import {
  getPokemonEvolutions,
  PokemonEvolution,
  useFetchQuery,
  useEvolutionSpecies,
} from "../hooks/useFetchQuery";
import { Colors } from "../constants/Colors";
import {
  BASE_POKEMON_STATS,
  formatHeight,
  formatWeight,
  getPokemonArtwork,
} from "../functions/pokemon";
import { Card } from "../components/Card";
import { capitalizeFirstLetter } from "../functions/utils";
import { PokemonType } from "../components/PokemonType";
import { PokemonSpec } from "../components/PokemonSpec";
import { PokemonStat } from "../components/PokemonStat";
import { LanguageButton } from "../components/LanguageButton";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";
import Animated, {
  Easing,
  interpolateColor,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import PagerView from "react-native-pager-view";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import React from "react";

export default function Pokemon() {
  const params = useLocalSearchParams() as { id: string };
  const [id, setId] = useState(parseInt(params.id, 10));
  const offset = useRef(1);
  const pager = useRef<PagerView>(null);
  const colors = useThemeColors();
  // On récupère les données du Pokémon courant pour déterminer son type principal
  const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id });
  const mainType = pokemon?.types?.[0]?.type?.name;
  const colorType = mainType ? Colors.type[mainType] : colors.primary;

  // Animation de fond
  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(progress.value, [0, 1], [colors.primary, colorType]),
    };
  });

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
  }, [colorType, colors.primary]);

  const onPageSelected = (e: { nativeEvent: { position: number } }) => {
    offset.current = e.nativeEvent.position - 1;
  };

  const onPageScrollStateChanged = (e: { nativeEvent: { pageScrollState: string } }) => {
    if (e.nativeEvent.pageScrollState !== "idle") {
      return;
    }
    if (offset.current === -1 && id === 2) {
      return;
    }
    if (offset.current === 1 && id === 200) {
      return;
    }
    if (offset.current !== 0) {
      setId(id + offset.current);
      offset.current = 0;
    }
  };

  useEffect(() => {
    if (pager.current) {
      setTimeout(() => {
        pager.current?.setPageWithoutAnimation(1);
      }, 0);
    }
  }, [id]);

  const onNext = () => {
    if (offset.current < 1) {
      pager.current?.setPage(2 + offset.current);
    } else if (Platform.OS === "ios") {
      router.replace({ pathname: "/pokemon/[id]", params: { id: Math.min(id + 2, 200) } });
    }
  };

  const onPrevious = () => {
    if (offset.current > -1) {
      pager.current?.setPage(0);
    } else if (Platform.OS === "ios") {
      router.replace({ pathname: "/pokemon/[id]", params: { id: Math.max(id - 2, 1) } });
    }
  };

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <SafeAreaView style={{ flex: 1 }}>
        <PagerView
          ref={pager}
          initialPage={1}
          style={{ flex: 1 }}
          onPageSelected={onPageSelected}
          onPageScrollStateChanged={onPageScrollStateChanged}
        >
          <PokemonView key={id - 1} id={id - 1} onNext={onNext} onPrevious={onPrevious} />
          <PokemonView key={id} id={id} onNext={onNext} onPrevious={onPrevious} />
          <PokemonView key={id + 1} id={id + 1} onNext={onNext} onPrevious={onPrevious} />
        </PagerView>
      </SafeAreaView>
    </Animated.View>
  );
}

type Props = {
  id: number;
  onPrevious: () => void;
  onNext: () => void;
};

function PokemonView({ id, onPrevious, onNext }: Props) {
  const colors = useThemeColors();
  const { theme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: id });
  const { data: species } = useFetchQuery("/pokemon-species/[id]", {
    id: id,
  });
  const evolutions: PokemonEvolution[] | undefined = getPokemonEvolutions(
    Number(species?.evolution_chain?.url?.split("/").slice(0, -1).pop()) ?? 0
  );

  const mainType = pokemon?.types?.[0]?.type?.name;
  const colorType = mainType ? Colors.type[mainType] : colors.primary;
  const types = pokemon?.types ?? [];
  const bio = species?.flavor_text_entries
    ?.find(({ language: lang }) => lang.name === language)
    ?.flavor_text.replaceAll("\n", " ");
  const pokemonName =
    species?.names?.find(({ language: lang }) => lang.name === language)?.name ??
    pokemon?.name ??
    "";
  const stats = pokemon?.stats ?? BASE_POKEMON_STATS;
  const isFirst = id === 1;
  const isLast = id === 200; // 200 IS AN EXEMPLE

  const onImagePress = async () => {
    const cry = pokemon?.cries?.latest;
    if (cry) {
      const { sound } = await Audio.Sound.createAsync({ uri: cry }, { shouldPlay: true });
      await sound.playAsync();
    }
  };

  const speciesQueries = useEvolutionSpecies(evolutions?.map(evo => evo.id) ?? []);

  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.pokeball} source={require("../../assets/images/pokeball_big.png")} />
        <View style={[styles.row, styles.header]}>
          <View style={styles.row}>
            <Pressable onPress={() => router.back()}>
              <Image
                source={require("../../assets/images/arrow_back.png")}
                width={32}
                height={32}
              />
            </Pressable>
            <ThemedText color="white" variant="headline">
              {capitalizeFirstLetter(pokemonName)}
            </ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText color={theme === "dark" ? "black" : "white"} variant="subtitle2">
              #{id.toString().padStart(3, "0")}
            </ThemedText>
            <ThemeToggle />
            <LanguageButton
              language={language}
              onPress={() => setLanguage(language === "en" ? "fr" : "en")}
            />
          </View>
        </View>
        <Card style={styles.body}>
          <View style={[styles.row, styles.artwork, styles.swipe]}>
            {isFirst ? (
              <View style={styles.chevron} />
            ) : (
              <Pressable onPress={onPrevious}>
                <Image
                  source={require("../../assets/images/chevron_left.png")}
                  width={24}
                  height={24}
                />
              </Pressable>
            )}
            <Pressable onPress={onImagePress}>
              <Image
                source={{
                  uri: getPokemonArtwork(id),
                }}
                width={200}
                height={200}
              />
            </Pressable>
            {isLast ? (
              <View style={styles.chevron} />
            ) : (
              <Pressable onPress={onNext}>
                <Image
                  source={require("../../assets/images/chevron_right.png")}
                  width={24}
                  height={24}
                />
              </Pressable>
            )}
          </View>
          <ScrollView
            contentContainerStyle={{ alignItems: "center", gap: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.row, styles.types]}>
              {types.map(type => (
                <PokemonType name={type.type.name} key={type.type.name} />
              ))}
            </View>

            {/* ABOUT */}

            <ThemedText variant="subtitle1" style={{ color: colorType }}>
              {t("common.about")}
            </ThemedText>
            <View style={styles.row}>
              <PokemonSpec
                style={{
                  borderStyle: "solid",
                  borderRightWidth: 1,
                  borderColor: colors.grayLight,
                }}
                title={formatWeight(pokemon?.weight)}
                description={t("common.weight")}
                image={require("../../assets/images/weight.png")}
              />
              <PokemonSpec
                style={{
                  borderStyle: "solid",
                  borderRightWidth: 1,
                  borderColor: colors.grayLight,
                }}
                title={formatHeight(pokemon?.height)}
                description={t("common.height")}
                image={require("../../assets/images/height.png")}
              />
              <PokemonSpec
                title={
                  pokemon?.moves
                    ?.slice(0, 2)
                    ?.map((m: { move: { name: string } }) =>
                      capitalizeFirstLetter(m.move.name.replaceAll("-", " "))
                    )
                    .join("\n") ?? "--"
                }
                description={t("common.moves")}
              />
            </View>
            <ThemedText>{bio}</ThemedText>

            {/* BASE STATS */}

            <ThemedText variant="subtitle1" style={{ color: colorType }}>
              {t("common.baseStats")}
            </ThemedText>
            <View style={styles.stats}>
              {stats.map(stat => (
                <PokemonStat
                  key={stat.stat.name}
                  name={stat.stat.name}
                  value={stat.base_stat}
                  color={colorType}
                />
              ))}
            </View>

            {/* EVOLUTIONS */}

            <ThemedText variant="subtitle1" style={{ color: colorType }}>
              {t("common.evolutions")}
            </ThemedText>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {evolutions?.map((evo: any, idx: number, arr: any[]) => {
                const names = speciesQueries[idx]?.data?.names;
                const localizedName =
                  names?.find((n: any) => n.language.name === language)?.name || evo.names[0].name;
                return (
                  <React.Fragment key={evo.id}>
                    <View>
                      <Image
                        source={{
                          uri: getPokemonArtwork(evo.id),
                        }}
                        width={80}
                        height={80}
                      />
                      <ThemedText>{localizedName}</ThemedText>
                    </View>
                    {idx < arr.length - 1 && (
                      <ThemedText style={{ fontSize: 16, marginHorizontal: 4 }}>→</ThemedText>
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          </ScrollView>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  swipe: {
    justifyContent: "space-between",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  chevron: {
    width: 24,
    height: 24,
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
    paddingBottom: 20,
    gap: 16,
    alignItems: "center",
    margin: 4,
  },
  stats: {
    alignSelf: "stretch",
  },
  types: {
    height: 20,
  },
});
