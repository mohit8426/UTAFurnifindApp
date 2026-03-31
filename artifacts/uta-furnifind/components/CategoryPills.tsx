import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { CATEGORIES } from '@/constants/inventory';
import { useColors } from '@/hooks/useColors';
import CategoryIcon from './CategoryIcon';

interface Props {
  selected: string;
  onSelect: (cat: string) => void;
  categories?: string[];
}

export default function CategoryPills({ selected, onSelect, categories = CATEGORIES }: Props) {
  const colors = useColors();
  const isDark = useColorScheme() === 'dark';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map(cat => {
        const isSelected = selected === cat;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            style={[
              styles.pill,
              {
                backgroundColor: isSelected
                  ? (isDark ? '#4DD0E1' : '#00BCD4')
                  : (isDark ? '#1e293b' : '#f1f5f9'),
                borderColor: isSelected ? 'transparent' : colors.border,
              }
            ]}
          >
            <View style={{ marginRight: 4 }}>
              <CategoryIcon
                category={cat}
                size={14}
                color={isSelected ? (isDark ? '#0a0f1e' : '#fff') : colors.mutedForeground}
              />
            </View>
            <Text style={[
              styles.pillText,
              { color: isSelected ? (isDark ? '#0a0f1e' : '#fff') : colors.mutedForeground }
            ]}>
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
});
