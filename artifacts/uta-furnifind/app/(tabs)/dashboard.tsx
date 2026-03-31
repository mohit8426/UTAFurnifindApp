import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ItemCard from '@/components/ItemCard';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const WEB_TOP = 67;
const WEB_BOTTOM = 34;

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const { savedItems, recentlyViewed, getItemById, userRole, setUserRole } = useApp();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? WEB_TOP : insets.top;
  const bottomPad = isWeb ? WEB_BOTTOM + 80 : insets.bottom + 80;

  const savedItemObjects = savedItems.map(id => getItemById(id)).filter(Boolean) as any[];
  const recentItemObjects = recentlyViewed.slice(0, 5).map(id => getItemById(id)).filter(Boolean) as any[];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>My Dashboard</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Student Hub</Text>
        </View>
        <Pressable
          style={[styles.avatarBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/profile' as any)}
        >
          <Feather name="user" size={22} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {/* Role Switcher */}
      <View style={[styles.roleCard, {
        backgroundColor: isDark ? '#0c2340' : '#e0f7fa',
        borderColor: isDark ? '#1e3a4a' : '#b2ebf2',
        marginHorizontal: 16,
      }]}>
        <Text style={[styles.roleLabel, { color: isDark ? '#4DD0E1' : '#00838F' }]}>Viewing as:</Text>
        <View style={styles.roleRow}>
          {(['student', 'donor', 'admin', 'community'] as const).map(role => (
            <Pressable
              key={role}
              onPress={() => setUserRole(role)}
              style={[styles.roleBtn, {
                backgroundColor: userRole === role ? '#4DD0E1' : (isDark ? '#1e293b' : '#fff'),
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

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <StatBox
          icon="heart"
          value={savedItems.length.toString()}
          label="Saved"
          color="#F59E0B"
        />
        <StatBox
          icon="clock"
          value={recentlyViewed.length.toString()}
          label="Viewed"
          color="#4DD0E1"
        />
        <StatBox
          icon="map-pin"
          value="5"
          label="Pickups"
          color="#10b981"
        />
      </View>

      {/* Saved Items */}
      <View style={styles.section}>
        <SectionHeader title={`Saved Items (${savedItemObjects.length})`} />
        {savedItemObjects.length === 0 ? (
          <EmptyState
            icon="heart"
            title="No saved items yet"
            subtitle="Browse inventory and tap the heart icon to save items"
            actionLabel="Browse Now"
            onAction={() => router.push('/(tabs)/browse' as any)}
          />
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            {savedItemObjects.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </View>
        )}
      </View>

      {/* Recently Viewed */}
      {recentItemObjects.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Recently Viewed" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {recentItemObjects.map(item => (
              <ItemCard key={item.id} item={item} compact />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Pickup Tips */}
      <View style={styles.section}>
        <SectionHeader title="Pickup Tips" />
        <View style={{ paddingHorizontal: 16 }}>
          {[
            { icon: 'clock', tip: 'Visit Mission Arlington weekday mornings for best availability', color: '#4DD0E1' },
            { icon: 'truck', tip: 'Bring your own vehicle or arrange transport before going', color: '#F59E0B' },
            { icon: 'users', tip: 'Bring a friend to help carry large furniture items', color: '#10b981' },
            { icon: 'phone', tip: 'Call ahead to confirm item availability before visiting', color: '#8b5cf6' },
          ].map((tip, i) => (
            <View key={i} style={[styles.tipRow, {
              backgroundColor: colors.card,
              borderColor: colors.border,
            }]}>
              <View style={[styles.tipIcon, { backgroundColor: tip.color + '22' }]}>
                <Feather name={tip.icon as any} size={16} color={tip.color} />
              </View>
              <Text style={[styles.tipText, { color: colors.foreground }]}>{tip.tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <SectionHeader title="Recommended for You" />
        <View style={[styles.aiCard, {
          backgroundColor: isDark ? '#1a1040' : '#f5f3ff',
          borderColor: isDark ? '#3b2f6b' : '#ddd6fe',
          marginHorizontal: 16,
        }]}>
          <Feather name="cpu" size={20} color="#8b5cf6" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#8b5cf6' }}>
              AI Furniture Advisor
            </Text>
            <Text style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', marginTop: 2 }}>
              Get personalized recommendations based on your needs
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/ai-helper' as any)}
            style={[styles.aiBtn, { backgroundColor: '#8b5cf6' }]}
          >
            <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#fff' }}>Try</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function StatBox({ icon, value, label, color }: any) {
  const colors = useColors();
  return (
    <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '22' }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
  );
}

function EmptyState({ icon, title, subtitle, actionLabel, onAction }: any) {
  const colors = useColors();
  return (
    <View style={styles.empty}>
      <Feather name={icon} size={40} color={colors.mutedForeground} />
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{subtitle}</Text>
      {onAction && (
        <Pressable style={[styles.emptyBtn, { backgroundColor: '#4DD0E1' }]} onPress={onAction}>
          <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#0a0f1e' }}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  greeting: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    flex: 1,
    lineHeight: 18,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  aiBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
  },
  empty: {
    alignItems: 'center',
    padding: 24,
    gap: 10,
    marginHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
});
