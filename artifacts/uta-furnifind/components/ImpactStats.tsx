import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useColors } from '@/hooks/useColors';

const STATS = [
  { icon: 'package' as const, value: '847', label: 'Items Donated', color: '#4DD0E1' },
  { icon: 'users' as const, value: '320+', label: 'Students Helped', color: '#10b981' },
  { icon: 'heart' as const, value: '156', label: 'Families Served', color: '#F59E0B' },
  { icon: 'check-circle' as const, value: '94%', label: 'Pickup Success', color: '#8b5cf6' },
];

export default function ImpactStats() {
  const colors = useColors();
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={styles.grid}>
      {STATS.map((stat) => (
        <View
          key={stat.label}
          style={[styles.card, {
            backgroundColor: colors.card,
            borderColor: colors.border,
          }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: stat.color + '22' }]}>
            <Feather name={stat.icon} size={18} color={stat.color} />
          </View>
          <Text style={[styles.value, { color: stat.color }]}>{stat.value}</Text>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
  },
  card: {
    width: '47%',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
});
