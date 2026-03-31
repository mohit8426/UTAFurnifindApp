import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, TextInput, View, useColorScheme } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Search furniture...' }: Props) {
  const colors = useColors();
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, {
      backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
      borderColor: colors.border,
    }]}>
      <Feather name="search" size={18} color={colors.mutedForeground} style={{ marginRight: 10 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        style={[styles.input, { color: colors.foreground }]}
        returnKeyType="search"
        clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
      />
      {value.length > 0 && Platform.OS !== 'ios' && (
        <Feather
          name="x"
          size={16}
          color={colors.mutedForeground}
          onPress={() => onChangeText('')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
});
