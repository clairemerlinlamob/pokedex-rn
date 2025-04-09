import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, Image, View, Pressable, Platform } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { ThemedText } from "../components/ThemedText";
import { useFetchQuery } from "../hooks/useFetchQuery";
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

export default function Pokemon() {
  const params = useLocalSearchParams() as { id: string };
  const [id, setId] = useState(parseInt(params.id, 10));
  const offset = useRef(1);
  const pager = useRef<PagerView>(null);

  const onPageSelected = (e: { nativeEvent: { position: number } }) => {
    offset.current = e.nativeEvent.position - 1;
  };

  const onPageScrollStateChanged = (e: { nativeEvent: { pageScrollState: string } }) => {
    if (e.nativeEvent.pageScrollState !== "idle") {
      return
    }
    if (offset.current === -1 && id === 2) {
      return
    }
    if (offset.current === 1 && id === 200) {
      return
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
    
    pager.current?.setPage(2 + offset.current)  }
     else if (Platform.OS === "ios") {
      router.replace({pathname: "/pokemon/[id]", params: {id: Math.min(id + 2, 200)}})
  }}

  const onPrevious = () => {
    if (offset.current > -1) {
      pager.current?.setPage(0) 
    } else if (Platform.OS === "ios") {
      router.replace({pathname: "/pokemon/[id]", params: {id: Math.max(id - 2, 1)}})
    }
   };

  return (
    <PagerView
      ref={pager}
      initialPage={1}
      style={{ flex: 1 }}
      onPageSelected={onPageSelected}
      onPageScrollStateChanged={onPageScrollStateChanged}
    >
      <PokemonView key={id - 1} id={id - 1} onNext={onNext} onPrevious={onPrevious}/>
      <PokemonView key={id} id={id} onNext={onNext} onPrevious={onPrevious}/>
      <PokemonView key={id + 1} id={id + 1} onNext={onNext} onPrevious={onPrevious}/>
    </PagerView> // DOESN'T WORK PROPERLY ON IOS BECAUSE OF THE LIBRARY
  );
}

type Props = {
  id: number;
  onPrevious: () => void;
  onNext: () => void;
}

function PokemonView({ id, onPrevious, onNext }: Props) {
  const colors = useThemeColors();
  const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: id });
  const { data: species } = useFetchQuery("/pokemon-species/[id]", {
    id: id,
  });

  const mainType = pokemon?.types[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.primary;
  const types = pokemon?.types ?? [];
  const bio = species?.flavor_text_entries
    ?.find(({ language }) => language.name === "en")
    ?.flavor_text.replaceAll("\n", ". ");
  const stats = pokemon?.stats ?? BASE_POKEMON_STATS;
  const isFirst = id === 1;
  const isLast = id === 200; // 200 IS AN EXAMPLE, WE NEED TO KNOW HAW MANY POKEMONS THERE ARE IN TOTALS
  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(progress.value, [0, 1], [colors.primary, colorType]),
    };
  });

  const onImagePress = async () => {
    const cry = pokemon?.cries.latest;
    if (cry) {
      const { sound } = await Audio.Sound.createAsync({ uri: cry }, { shouldPlay: true });
      await sound.playAsync(); // WORKS ONLY ON ANDROID BECAUSE POKEAPI ONLY HAVE .ogg AND IT'S NOT SUPPORTED ON IOS
    }
  };

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
  }, [colorType, colors.primary]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <SafeAreaView style={styles.container}>
        <View>
          <Image style={styles.pokeball} source={require("../../assets/images/pokeball_big.png")} />
          <View style={[styles.row, styles.header]}>
            <View style={styles.row}>
              <Pressable onPress={() => router.push("/")}>
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
              #{id.toString().padStart(3, "0")}
            </ThemedText>
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
            <View style={[styles.row, styles.types]}>
              {types.map(type => (
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
                title={
                  pokemon?.moves
                    ?.slice(0, 2)
                    ?.map((m: { move: { name: string } }) => m.move.name)
                    .join("\n") ?? "--"
                }
                description={"Moves"}
              />
            </View>
            <ThemedText>{bio}</ThemedText>

            {/* BASE STATS */}

            <ThemedText variant="subtitle1" style={{ color: colorType }}>
              Base stats
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
          </Card>
        </View>
      </SafeAreaView>
    </Animated.View>
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
