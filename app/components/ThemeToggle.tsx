import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useThemeColors } from '../hooks/useThemeColors';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.white }]}
      onPress={toggleTheme}
    >
      <Ionicons
        name={theme === 'dark' ? 'sunny' : 'moon'}
        size={18}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 8,
  },
}); 