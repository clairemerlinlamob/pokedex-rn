import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Pokemon() {
  const params = useLocalSearchParams();

  return (
    <View>
      <Text>Pokemon {params.id}</Text>
    </View>
  );
}
