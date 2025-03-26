import { Image, StyleSheet, TextInput, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

type Props = {
  value: string;
  onChange: (s: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.white }]}>
      <Image
        source={require("../../assets/images/search.png")}
        width={16}
        height={16}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChange}
        value={value}
        placeholder="Search..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 12,
  },
  input: {
    height: "100%",
    fontSize: 10,
    flex: 1,
  },
});
