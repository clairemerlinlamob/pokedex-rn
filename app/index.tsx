import { Link } from "expo-router";
import { Text, StyleSheet, View, Image, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./components/ThemedText";
import { Colors } from "./constants/Colors";
import { useThemeColors } from "./hooks/useThemeColors";
import { Card } from "./components/Card";
import { PokemonCard } from "./pokemon/PokemonCard";
import { useFetchQuery, useInfiniteFetchQuery } from "./hooks/useFetchQuery";
import { getPokemonId } from "./functions/pokemon";
import { SearchBar } from "./components/SearchBar";
import { useState } from "react";
import { SortButton } from "./components/SortButton";
import { LanguageButton } from "./components/LanguageButton";
import { ThemeToggle } from "./components/ThemeToggle";
import { useLanguage } from "./context/LanguageContext";

export default function Index() {
  const colors = useThemeColors();
  const { language, setLanguage } = useLanguage();
  const { data, isFetching, fetchNextPage } = useInfiniteFetchQuery("/pokemon?limit=21");
  const pokemons =
    data?.pages.flatMap(page =>
      page.results.map(r => ({ name: r.name, id: getPokemonId(r.url) }))
    ) ?? [];
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"id" | "name">("id");
  const filteredPokemons = [
    ...(search
      ? pokemons.filter(p => p.name.includes(search.toLowerCase()) || p.id.toString() === search)
      : pokemons),
  ].sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : 1));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.header}>
        <View style={styles.row}>
          <Image source={require("../assets/images/pokeball.png")} width={24} height={24} />
          <ThemedText variant="headline" color="white">
            Pokédex
          </ThemedText>
        </View>
        <View style={styles.row}>
          <ThemeToggle />
          <LanguageButton
            language={language}
            onPress={() => setLanguage(language === "en" ? "fr" : "en")}
          />
        </View>
      </View>
      <View style={styles.form}>
        <SearchBar value={search} onChange={setSearch} />
        <SortButton value={sortKey} onChange={setSortKey} />
      </View>
      <Card style={styles.body}>
        <FlatList
          data={filteredPokemons}
          numColumns={3}
          columnWrapperStyle={styles.gridgap}
          contentContainerStyle={[styles.gridgap, styles.list]}
          ListFooterComponent={isFetching ? <ActivityIndicator color={colors.primary} /> : null}
          onEndReached={search ? undefined : () => fetchNextPage()}
          renderItem={({ item }) => (
            <PokemonCard id={item.id} name={item.name} style={{ flex: 1 / 3 }} />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  form: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  body: {
    flex: 1,
    margin: 4,
  },
  gridgap: {
    gap: 8,
  },
  list: {
    padding: 8,
  },
});
