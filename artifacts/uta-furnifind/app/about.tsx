import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const WEB_TOP = 67;
const WEB_BOTTOM = 34;

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? WEB_TOP : insets.top;
  const bottomPad = isWeb ? WEB_BOTTOM + 80 : insets.bottom + 80;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingTop: topPad + 8, paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={{ fontSize: 26, fontFamily: 'Inter_700Bold', color: colors.foreground }}>About</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        {/* App Identity */}
        <View style={[styles.card, { backgroundColor: '#0a1628', marginBottom: 16 }]}>
          <Text style={{ fontSize: 24, fontFamily: 'Inter_700Bold', color: '#f1f5f9', marginBottom: 8 }}>
            UTA FurniFind
          </Text>
          <Text style={{ fontSize: 14, color: '#94a3b8', lineHeight: 22 }}>
            A mobile platform connecting University of Texas at Arlington students and Arlington community members with free furniture and household items through Mission Arlington.
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 16, gap: 8 }}>
            <View style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99, backgroundColor: '#4DD0E1' + '22' }}>
              <Text style={{ fontSize: 12, color: '#4DD0E1', fontFamily: 'Inter_600SemiBold' }}>v1.0.0</Text>
            </View>
            <View style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99, backgroundColor: '#10b981' + '22' }}>
              <Text style={{ fontSize: 12, color: '#10b981', fontFamily: 'Inter_600SemiBold' }}>Free Forever</Text>
            </View>
          </View>
        </View>

        {/* Partners */}
        <Text style={{ fontSize: 17, fontFamily: 'Inter_700Bold', color: colors.foreground, marginBottom: 12 }}>Our Partners</Text>
        {[
          { name: 'University of Texas at Arlington', role: 'University Partner', icon: 'book' as const, color: '#F59E0B' },
          { name: 'Mission Arlington', role: 'Primary Donation Site', icon: 'heart' as const, color: '#4DD0E1' },
          { name: 'Arlington Community', role: 'Donor Network', icon: 'users' as const, color: '#10b981' },
        ].map((p, i) => (
          <View key={i} style={[styles.partnerRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.partnerIcon, { backgroundColor: p.color + '22' }]}>
              <Feather name={p.icon} size={20} color={p.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.foreground }}>{p.name}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 2 }}>{p.role}</Text>
            </View>
          </View>
        ))}

        {/* Legal */}
        <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.mutedForeground, textAlign: 'center', marginTop: 24, lineHeight: 20 }}>
          All items are donated and provided free of charge. UTA FurniFind does not guarantee item availability. Items are subject to change or removal at any time.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 14,
  },
  partnerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
