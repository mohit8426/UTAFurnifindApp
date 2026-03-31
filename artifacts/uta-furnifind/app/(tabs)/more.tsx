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
import { useColors } from '@/hooks/useColors';

const WEB_TOP = 67;
const WEB_BOTTOM = 34;

const FAQ_ITEMS = [
  {
    q: 'Who can use UTA FurniFind?',
    a: 'Any UTA student, faculty, staff, or Arlington community member can browse available items. Items are free to those who need them most.',
  },
  {
    q: 'How do I pick up an item?',
    a: 'Visit Mission Arlington at 1100 W. Pioneer Pkwy, Arlington TX during operating hours. Bring a vehicle for large items. Call ahead to confirm availability.',
  },
  {
    q: 'What items are accepted for donation?',
    a: 'Clean, usable furniture, appliances, kitchen items, and household goods in good condition. No broken, hazardous, or contaminated items.',
  },
  {
    q: 'Is there a limit on how many items I can take?',
    a: 'Please take only what you need. Mission Arlington serves many families and students, so fair distribution is important.',
  },
  {
    q: 'How long are items available?',
    a: 'Items are typically listed for 30 days. After that, they may be relisted or redistributed.',
  },
];

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? WEB_TOP : insets.top;
  const bottomPad = isWeb ? WEB_BOTTOM + 80 : insets.bottom + 80;

  const menuItems = [
    { icon: 'shield' as const, label: 'Admin Panel', route: '/admin', color: '#F59E0B', adminOnly: true },
    { icon: 'bar-chart-2' as const, label: 'Community Impact', route: '/community', color: '#10b981' },
    { icon: 'cpu' as const, label: 'AI Furniture Advisor', route: '/ai-helper', color: '#8b5cf6' },
    { icon: 'info' as const, label: 'About UTA FurniFind', route: '/about', color: '#4DD0E1' },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingTop: topPad + 8, paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={[styles.title, { color: colors.foreground }]}>More</Text>
      </View>

      {/* Mission Card */}
      <View style={[styles.missionCard, {
        backgroundColor: '#0a1628',
        marginHorizontal: 16,
        marginBottom: 24,
      }]}>
        <Text style={styles.missionTitle}>About UTA FurniFind</Text>
        <Text style={styles.missionText}>
          A community platform connecting UTA students with free furniture and household items through Mission Arlington — helping families and students furnish their homes with dignity.
        </Text>
        <View style={styles.missionStats}>
          <View style={styles.missionStat}>
            <Text style={styles.missionStatValue}>100+</Text>
            <Text style={styles.missionStatLabel}>Items Available</Text>
          </View>
          <View style={styles.missionDivider} />
          <View style={styles.missionStat}>
            <Text style={styles.missionStatValue}>5yrs</Text>
            <Text style={styles.missionStatLabel}>Serving UTA</Text>
          </View>
          <View style={styles.missionDivider} />
          <View style={styles.missionStat}>
            <Text style={styles.missionStatValue}>Free</Text>
            <Text style={styles.missionStatLabel}>For Students</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={{ paddingHorizontal: 16, gap: 10, marginBottom: 24 }}>
        {menuItems.map(item => (
          <Pressable
            key={item.route}
            onPress={() => router.push(item.route as any)}
            style={[styles.menuItem, {
              backgroundColor: colors.card,
              borderColor: colors.border,
            }]}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '22' }]}>
              <Feather name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>

      {/* Contact */}
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Contact</Text>
        <View style={[styles.contactCard, {
          backgroundColor: colors.card,
          borderColor: colors.border,
        }]}>
          {[
            { icon: 'map-pin' as const, text: '1100 W. Pioneer Pkwy, Arlington TX 76013' },
            { icon: 'phone' as const, text: '(817) 277-6620' },
            { icon: 'mail' as const, text: 'info@missionarlington.org' },
            { icon: 'clock' as const, text: 'Mon–Fri: 9am–5pm | Sat: 9am–1pm' },
          ].map((c, i) => (
            <View key={i} style={[styles.contactRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Feather name={c.icon} size={16} color="#4DD0E1" />
              <Text style={[styles.contactText, { color: colors.foreground }]}>{c.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* FAQ */}
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Frequently Asked Questions</Text>
        {FAQ_ITEMS.map((faq, i) => (
          <FAQItem key={i} question={faq.q} answer={faq.a} />
        ))}
      </View>

      {/* UTA Branding */}
      <View style={[styles.utaCard, {
        backgroundColor: isDark ? '#1a0a00' : '#fff8f0',
        borderColor: isDark ? '#3d1f00' : '#fed7aa',
        marginHorizontal: 16,
        marginBottom: 16,
      }]}>
        <Text style={{ fontSize: 12, color: '#F59E0B', fontFamily: 'Inter_600SemiBold', letterSpacing: 1 }}>
          POWERED BY
        </Text>
        <Text style={{ fontSize: 18, fontFamily: 'Inter_700Bold', color: isDark ? '#fed7aa' : '#c2410c', marginTop: 4 }}>
          University of Texas at Arlington
        </Text>
        <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 4 }}>
          In partnership with Mission Arlington
        </Text>
      </View>
    </ScrollView>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const colors = useColors();
  const [open, setOpen] = React.useState(false);

  return (
    <View style={[styles.faqItem, {
      backgroundColor: colors.card,
      borderColor: colors.border,
      marginBottom: 8,
    }]}>
      <Pressable
        onPress={() => setOpen(o => !o)}
        style={styles.faqHeader}
      >
        <Text style={[styles.faqQ, { color: colors.foreground }]}>{question}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.mutedForeground} />
      </Pressable>
      {open && (
        <Text style={[styles.faqA, { color: colors.mutedForeground }]}>{answer}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  missionCard: {
    padding: 20,
    borderRadius: 16,
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
    marginBottom: 16,
  },
  missionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  missionStat: {
    alignItems: 'center',
  },
  missionStatValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#4DD0E1',
  },
  missionStatLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: '#64748b',
    marginTop: 2,
  },
  missionDivider: {
    width: 1,
    backgroundColor: '#1e293b',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    marginBottom: 12,
  },
  contactCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  contactText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  faqQ: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
    marginRight: 8,
  },
  faqA: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    padding: 14,
    paddingTop: 0,
    lineHeight: 20,
  },
  utaCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
});
