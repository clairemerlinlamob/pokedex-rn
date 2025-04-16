import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';

export const Shadows = {
  dp2: {
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3, //ios
    elevation: 2, //android
  },
};

export function useShadows() {
  const { theme } = useTheme();
  
  return {
    dp2: {
      ...Shadows.dp2,
      shadowColor: theme === 'dark' ? Colors.dark.grayDark : Colors.light.grayDark,
    },
  };
} 