import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImpactStats from '@/components/ImpactStats';
import ItemCard from '@/components/ItemCard';
import SearchBar from '@/components/SearchBar';
import { INVENTORY } from '@/constants/inventory';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const { width } = Dimensions.get('window');
const WEB_TOP = 67;
const WEB_BOTTOM = 34;

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const { searchQuery, setSearchQuery, setSelectedCategory } = useApp();
  const scrollY = useRef(new Animated.Value(0)).current;
  const isWeb = Platform.OS === 'web';

  const featuredItems = INVENTORY.filter(i => i.availability === 'Available').slice(0, 8);
  const urgentItems = INVENTORY.filter(i => i.tags.includes('urgent-pickup')).slice(0, 4);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const topPad = isWeb ? WEB_TOP : insets.top + 8;
  const bottomPad = isWeb ? WEB_BOTTOM + 100 : insets.bottom + 90;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Hero Section */}
        <View style={[styles.hero, { paddingTop: topPad }]}>
          <Image
            source={require('@/assets/images/hero-banner.png')}
            style={[StyleSheet.absoluteFill, { opacity: 0.35, borderRadius: 0 }]}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroEyebrow}>UTA FurniFind</Text>
                <Text style={styles.heroTitle}>Find Free Furniture{'\n'}For Your Home</Text>
                <Text style={styles.heroSubtitle}>
                  Browse available items at Mission Arlington — no early morning waits
                </Text>
              </View>
            </View>
            <View style={{ paddingTop: 16 }}>
              <SearchBar
                value={searchQuery}
                onChangeText={(q) => {
                  setSearchQuery(q);
                  if (q.length > 0) router.push('/(tabs)/browse' as any);
                }}
                placeholder="Search sofas, desks, lamps..."
              />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickRow}>
            <QuickAction
              icon="search"
              label="Browse All"
              color="#4DD0E1"
              onPress={() => router.push('/(tabs)/browse' as any)}
            />
            <QuickAction
              icon="gift"
              label="Donate"
              color="#F59E0B"
              onPress={() => router.push('/(tabs)/donate' as any)}
            />
            <QuickAction
              icon="bookmark"
              label="Saved"
              color="#8b5cf6"
              onPress={() => router.push('/(tabs)/dashboard' as any)}
            />
            <QuickAction
              icon="cpu"
              label="AI Help"
              color="#10b981"
              onPress={() => router.push('/ai-helper' as any)}
            />
          </View>
        </View>

        {/* Category Shortcuts */}
        <View style={styles.section}>
          <SectionHeader title="Browse by Category" onMore={() => router.push('/(tabs)/browse' as any)} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {['Sofas', 'Study Desks', 'Appliances', 'Chairs', 'Televisions', 'Storage'].map(cat => (
              <Pressable
                key={cat}
                style={[styles.catChip, {
                  backgroundColor: isDark ? '#1e293b' : '#e0f7fa',
                  borderColor: isDark ? '#1e3a4a' : '#b2ebf2',
                }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(cat);
                  router.push('/(tabs)/browse' as any);
                }}
              >
                <Text style={[styles.catChipText, { color: isDark ? '#4DD0E1' : '#00838F' }]}>{cat}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured Items */}
        <View style={styles.section}>
          <SectionHeader title="Available Now" onMore={() => router.push('/(tabs)/browse' as any)} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {featuredItems.map(item => (
              <ItemCard key={item.id} item={item} compact />
            ))}
          </ScrollView>
        </View>

        {/* Impact Stats */}
        <View style={styles.section}>
          <SectionHeader title="Community Impact" />
          <ImpactStats />
        </View>

        {/* Urgent Pickup Banner */}
        {urgentItems.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Urgent Pickup Needed" />
            <View style={{ paddingHorizontal: 16 }}>
              {urgentItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        )}

        {/* Mission Arlington Info */}
        <View style={[styles.missionCard, {
          backgroundColor: isDark ? '#0c2340' : '#e0f7fa',
          borderColor: isDark ? '#1e3a4a' : '#b2ebf2',
          marginHorizontal: 16,
          marginBottom: 16,
        }]}>
          <Feather name="map-pin" size={20} color={isDark ? '#4DD0E1' : '#00838F'} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: isDark ? '#4DD0E1' : '#00838F' }}>
              Mission Arlington
            </Text>
            <Text style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#4a6b73', marginTop: 2 }}>
              1100 W. Pioneer Pkwy, Arlington TX{'\n'}
              Mon–Fri: 9am–5pm | Sat: 9am–1pm
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={isDark ? '#4DD0E1' : '#00838F'} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

function QuickAction({ icon, label, color, onPress }: any) {
  const colors = useColors();
  const isDark = useColorScheme() === 'dark';
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickIcon, { backgroundColor: color + '22' }]}>
        <Feather name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.quickLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </Pressable>
  );
}

function SectionHeader({ title, onMore }: { title: string; onMore?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {onMore && (
        <Pressable onPress={onMore} style={styles.seeAll}>
          <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: '#4DD0E1' }}>See all</Text>
          <Feather name="chevron-right" size={14} color="#4DD0E1" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#0a1628',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroOverlay: {
    zIndex: 1,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  heroEyebrow: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#4DD0E1',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#f1f5f9',
    lineHeight: 34,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#94a3b8',
    lineHeight: 20,
  },
  section: {
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  catRow: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    marginRight: 4,
  },
  catChipText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
  },
});
