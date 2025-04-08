import { createContext, useContext } from "react";
import { Colors } from "../constants/Colors";

type ColorContextType = {
  colorType: string;
};

export const ColorContext = createContext<ColorContextType>({ colorType: Colors.type.normal });

export const useColorContext = () => useContext(ColorContext); 