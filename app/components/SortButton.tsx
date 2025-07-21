import { Image, Modal, Pressable, StyleSheet, View, Text, Dimensions } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { useShadows } from "../hooks/useShadows";
import { useRef, useState } from "react";
import { ThemedText } from "./ThemedText";
import { Card } from "./Card";
import { Radio } from "./Radio";
import React from "react";

type Props = {
  value: "id" | "name";
  onChange: (v: "id" | "name") => void;
};

const options = [
  { label: "Number", value: "id" },
  { label: "Name", value: "name" },
] as const;

export function SortButton({ value, onChange }: Props) {
  const buttonRef = useRef<View>(null);
  const colors = useThemeColors();
  const shadows = useShadows();
  const [isModalVisible, setModalVisibility] = useState(false);
  const [position, setPosition] = useState<null | {
    top: number;
    right: number;
  }>(null);

  const onButtonPress = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height,
        right: Dimensions.get("window").width - x - width,
      });
    });
    setModalVisibility(true);
  };

  const onClose = () => {
    setModalVisibility(false);
  };

  return (
    <>
      <Pressable onPress={onButtonPress}>
        <View
          ref={buttonRef}
          style={[styles.button, { backgroundColor: colors.background, ...shadows.dp2 }]}
        >
          <Image
            source={
              value === "id"
                ? require("../../assets/images/number.png")
                : require("../../assets/images/alpha.png")
            }
            width={16}
            height={16}
          />
        </View>
      </Pressable>
      <Modal transparent animationType="fade" visible={isModalVisible} onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[styles.popup, { backgroundColor: colors.primary, ...position, ...shadows.dp2 }]}
        >
          <ThemedText style={styles.title} variant="subtitle2" color="white">
            Sort by :
          </ThemedText>
          <Card style={styles.card}>
            {options.map(o => (
              <Pressable key={o.value} style={styles.filter} onPress={() => onChange(o.value)}>
                <Radio checked={o.value === value} />
                <ThemedText>{o.label}</ThemedText>
              </Pressable>
            ))}
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popup: {
    borderRadius: 12,
    padding: 4,
    paddingTop: 16,
    gap: 16,
    position: "absolute",
    width: 113,
  },
  title: {
    paddingLeft: 20,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
