import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';

export function useThemeColors() {
  const { theme } = useTheme();
  return theme === 'dark' ? Colors.dark : Colors.light;
}
