import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
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
import { useColors } from '@/hooks/useColors';

const WEB_TOP = 67;
const WEB_BOTTOM = 34;

const TESTIMONIALS = [
  {
    name: 'Maria G.',
    role: 'UTA Student',
    text: 'I furnished my entire apartment with items from FurniFind. It saved me hundreds of dollars and I got great quality pieces!',
    rating: 5,
  },
  {
    name: 'James T.',
    role: 'Community Donor',
    text: "Donating through this platform was so easy. I love knowing my furniture is helping a student start their new life.",
    rating: 5,
  },
  {
    name: 'Priya S.',
    role: 'UTA Graduate Student',
    text: 'As an international student, I had nothing when I arrived. FurniFind helped me feel at home with real furniture.',
    rating: 5,
  },
  {
    name: 'Carlos R.',
    role: 'Arlington Family',
    text: 'Mission Arlington has been a blessing for our family. We got a full bedroom set for our kids completely free.',
    rating: 5,
  },
];

const ENVIRONMENTAL_STATS = [
  { icon: 'wind', label: 'CO₂ Prevented', value: '12.4 tons', desc: 'By reusing instead of buying new' },
  { icon: 'trash-2', label: 'Waste Diverted', value: '850+ items', desc: 'Kept out of landfills this year' },
  { icon: 'dollar-sign', label: 'Money Saved', value: '$127K+', desc: 'Estimated savings for students' },
];

const MONTHLY_DONATIONS = [
  { month: 'Oct', count: 45 },
  { month: 'Nov', count: 62 },
  { month: 'Dec', count: 38 },
  { month: 'Jan', count: 71 },
  { month: 'Feb', count: 84 },
  { month: 'Mar', count: 93 },
];

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? WEB_TOP : insets.top;
  const bottomPad = isWeb ? WEB_BOTTOM + 80 : insets.bottom + 80;

  const maxCount = Math.max(...MONTHLY_DONATIONS.map(m => m.count));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Community Impact</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          See how UTA FurniFind is making a difference in Arlington
        </Text>
      </View>

      {/* Hero Stats */}
      <View style={styles.section}>
        <ImpactStats />
      </View>

      {/* Monthly Chart */}
      <View style={[styles.section, { paddingHorizontal: 16 }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Monthly Donations</Text>
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.chartBars}>
            {MONTHLY_DONATIONS.map((d, i) => (
              <View key={d.month} style={styles.barGroup}>
                <Text style={[styles.barValue, { color: colors.mutedForeground }]}>{d.count}</Text>
                <View
                  style={[styles.bar, {
                    height: (d.count / maxCount) * 80,
                    backgroundColor: i === MONTHLY_DONATIONS.length - 1
                      ? '#4DD0E1'
                      : (isDark ? '#1e293b' : '#e0f7fa'),
                  }]}
                />
                <Text style={[styles.barLabel, { color: colors.mutedForeground }]}>{d.month}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.chartNote, { color: colors.mutedForeground }]}>
            Items donated per month · Last 6 months
          </Text>
        </View>
      </View>

      {/* Environmental Impact */}
      <View style={[styles.section, { paddingHorizontal: 16 }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Environmental Impact</Text>
        {ENVIRONMENTAL_STATS.map(stat => (
          <View key={stat.label} style={[styles.envRow, {
            backgroundColor: isDark ? '#0d3d24' : '#dcfce7',
            borderColor: '#10b981' + '44',
          }]}>
            <View style={[styles.envIcon, { backgroundColor: '#10b981' + '22' }]}>
              <Feather name={stat.icon as any} size={20} color="#10b981" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#4a7c5f', fontFamily: 'Inter_400Regular' }}>
                {stat.label}
              </Text>
              <Text style={{ fontSize: 20, fontFamily: 'Inter_700Bold', color: '#10b981', marginTop: 2 }}>
                {stat.value}
              </Text>
              <Text style={{ fontSize: 12, color: isDark ? '#6b7280' : '#6b7280', marginTop: 2 }}>
                {stat.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Testimonials */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, paddingHorizontal: 16 }]}>Community Stories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {TESTIMONIALS.map((t, i) => (
            <View key={i} style={[styles.testimonialCard, {
              backgroundColor: colors.card,
              borderColor: colors.border,
              width: 260,
            }]}>
              <View style={styles.testimonialStars}>
                {[...Array(t.rating)].map((_, j) => (
                  <Feather key={j} name="star" size={12} color="#F59E0B" />
                ))}
              </View>
              <Text style={{ fontSize: 13, color: colors.foreground, fontFamily: 'Inter_400Regular', lineHeight: 20, marginVertical: 12 }}>
                "{t.text}"
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.avatar, { backgroundColor: '#4DD0E1' + '22' }]}>
                  <Text style={{ fontSize: 14, fontFamily: 'Inter_700Bold', color: '#4DD0E1' }}>
                    {t.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 13, fontFamily: 'Inter_600SemiBold', color: colors.foreground }}>{t.name}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{t.role}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Mission Banner */}
      <View style={[styles.missionBanner, { marginHorizontal: 16, backgroundColor: '#0a1628' }]}>
        <Text style={styles.missionTitle}>Mission Arlington</Text>
        <Text style={styles.missionText}>
          Since 1994, Mission Arlington has been providing food, clothing, and household items to families in need across Arlington, TX — serving thousands of residents every year.
        </Text>
        <View style={styles.missionRow}>
          <Feather name="heart" size={14} color="#4DD0E1" />
          <Text style={{ fontSize: 12, color: '#4DD0E1', fontFamily: 'Inter_500Medium', marginLeft: 6 }}>
            Non-profit · Faith-based · Community-driven
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    marginBottom: 14,
  },
  chartCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 110,
    marginBottom: 8,
  },
  barGroup: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  bar: {
    width: 28,
    borderRadius: 6,
    minHeight: 8,
  },
  barValue: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
  barLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
  chartNote: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  envRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  envIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testimonialCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  testimonialStars: {
    flexDirection: 'row',
    gap: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionBanner: {
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  missionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  missionText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 12,
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
