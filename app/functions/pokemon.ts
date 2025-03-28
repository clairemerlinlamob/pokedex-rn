export function getPokemonId(url: string): number {
  return parseInt(url.split("/").at(-2)!, 10);
}

export function getPokemonArtwork(id: number | string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formatWeight(weight?: number) {
  if (!weight) {
    return "";
  }
  return (weight / 10).toString().replace(".", ",") + " kg";
}

export function formatHeight(height?: number) {
  if (!height) {
    return "";
  }
  return (height / 10).toString().replace(".", ",") + " m";
}

export function statShortName(name: string): string {
  return name
    .replaceAll("special", "S")
    .replaceAll("-", "")
    .replaceAll("attack", "ATK")
    .replaceAll("defense", "DEF")
    .replaceAll("speed", "SPD")
    .toUpperCase();
}
