import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const WEB_TOP = 67;
const WEB_BOTTOM = 34;

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const { userRole, setUserRole, savedItems } = useApp();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? WEB_TOP : insets.top;
  const bottomPad = isWeb ? WEB_BOTTOM + 80 : insets.bottom + 80;

  const [name, setName] = useState('Alex Student');
  const [email, setEmail] = useState('alex@uta.edu');
  const [housing, setHousing] = useState('');

  const housingTypes = ['Dorm', 'Studio Apartment', '1-Bedroom', '2-Bedroom+', 'Shared Housing'];

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
          <Text style={{ fontSize: 26, fontFamily: 'Inter_700Bold', color: colors.foreground }}>Profile</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: '#4DD0E1' + '22' }]}>
            <Text style={{ fontSize: 36, fontFamily: 'Inter_700Bold', color: '#4DD0E1' }}>
              {name.charAt(0)}
            </Text>
          </View>
          <Text style={{ fontSize: 20, fontFamily: 'Inter_700Bold', color: colors.foreground, marginTop: 12 }}>{name}</Text>
          <Text style={{ fontSize: 14, color: colors.mutedForeground, marginTop: 4, textTransform: 'capitalize' }}>
            {userRole} · UTA FurniFind Member
          </Text>
          <View style={styles.statRow}>
            <View style={styles.profileStat}>
              <Text style={{ fontSize: 20, fontFamily: 'Inter_700Bold', color: '#4DD0E1' }}>{savedItems.length}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Saved</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.profileStat}>
              <Text style={{ fontSize: 20, fontFamily: 'Inter_700Bold', color: '#10b981' }}>0</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Pickups</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.profileStat}>
              <Text style={{ fontSize: 20, fontFamily: 'Inter_700Bold', color: '#F59E0B' }}>0</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Donations</Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <Text style={{ fontSize: 15, fontFamily: 'Inter_700Bold', color: colors.foreground, marginBottom: 12, marginTop: 24 }}>Account Info</Text>
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.formRow}>
            <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: 'Inter_500Medium', marginBottom: 4 }}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={{ fontSize: 14, color: colors.foreground, fontFamily: 'Inter_400Regular' }}
            />
          </View>
          <View style={[styles.formRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: 'Inter_500Medium', marginBottom: 4 }}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={{ fontSize: 14, color: colors.foreground, fontFamily: 'Inter_400Regular' }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Housing */}
        <Text style={{ fontSize: 15, fontFamily: 'Inter_700Bold', color: colors.foreground, marginBottom: 12, marginTop: 20 }}>Housing Type</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {housingTypes.map(h => (
            <Pressable
              key={h}
              onPress={() => setHousing(h)}
              style={[styles.housingChip, {
                backgroundColor: housing === h ? '#4DD0E1' + '22' : (isDark ? '#1e293b' : '#f1f5f9'),
                borderColor: housing === h ? '#4DD0E1' : colors.border,
              }]}
            >
              <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: housing === h ? '#4DD0E1' : colors.mutedForeground }}>
                {h}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Role */}
        <Text style={{ fontSize: 15, fontFamily: 'Inter_700Bold', color: colors.foreground, marginBottom: 12, marginTop: 20 }}>Role</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['student', 'donor', 'admin', 'community'] as const).map(role => (
            <Pressable
              key={role}
              onPress={() => setUserRole(role)}
              style={[styles.roleBtn, {
                flex: 1,
                backgroundColor: userRole === role ? '#4DD0E1' : (isDark ? '#1e293b' : '#f1f5f9'),
                borderColor: userRole === role ? '#4DD0E1' : colors.border,
              }]}
            >
              <Text style={{
                fontSize: 11,
                fontFamily: 'Inter_600SemiBold',
                color: userRole === role ? '#0a0f1e' : colors.mutedForeground,
                textTransform: 'capitalize',
              }}>
                {role}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 24,
    alignItems: 'center',
  },
  profileStat: {
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    width: 1,
    height: 32,
  },
  formCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  formRow: {
    padding: 14,
  },
  housingChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  roleBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
});
