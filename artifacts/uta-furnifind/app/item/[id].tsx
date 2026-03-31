import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Alert,
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
import CategoryIcon from '@/components/CategoryIcon';
import ItemCard from '@/components/ItemCard';
import { INVENTORY } from '@/constants/inventory';
import CATEGORY_IMAGES from '@/constants/categoryImages';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const CONDITION_COLORS: Record<string, string> = {
  'Like New': '#10b981',
  'Excellent': '#10b981',
  'Good': '#F59E0B',
  'Fair': '#ef4444',
};

const AVAILABILITY_COLORS: Record<string, string> = {
  'Available': '#10b981',
  'Reserved': '#F59E0B',
  'Claimed': '#ef4444',
  'Pending': '#8b5cf6',
};

const WEB_BOTTOM = 34;

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const { toggleSave, isItemSaved, addRecentlyViewed } = useApp();
  const isWeb = Platform.OS === 'web';
  const bottomPad = isWeb ? WEB_BOTTOM + 80 : insets.bottom + 80;

  const item = INVENTORY.find(i => i.id === id);

  useEffect(() => {
    if (id) addRecentlyViewed(id);
  }, [id]);

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_500Medium' }}>Item not found</Text>
      </View>
    );
  }

  const saved = isItemSaved(item.id);
  const similar = INVENTORY.filter(i => i.category === item.category && i.id !== item.id).slice(0, 4);

  const handleInterest = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Interested!',
      `We've noted your interest in "${item.name}". Visit ${item.location} during operating hours to pick it up. Call ahead to confirm availability.`,
      [{ text: 'Got it' }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Hero */}
        <View style={[styles.imageHero, { backgroundColor: isDark ? '#1e2d4a' : '#e0f7fa' }]}>
          <Image
            source={{ uri: CATEGORY_IMAGES[item.category] ?? CATEGORY_IMAGES['Miscellaneous'] }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: '#00000044' }]} />
          <View style={styles.heroLabel}>
            <Text style={[styles.categoryLabel, { color: '#fff' }]}>{item.category}</Text>
          </View>
        </View>

        {/* Back Button */}
        <View style={[styles.backRow, { top: isWeb ? 80 : insets.top + 8 }]}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.card + 'ee' }]}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              toggleSave(item.id);
            }}
            style={[styles.backBtn, { backgroundColor: colors.card + 'ee' }]}
          >
            <Feather name="heart" size={20} color={saved ? '#4DD0E1' : colors.foreground} />
          </Pressable>
        </View>

        <View style={styles.body}>
          {/* Title and Status */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[styles.donorType, { color: colors.mutedForeground }]}>Donated by {item.donorType}</Text>
            </View>
            <View style={[styles.freeBadge]}>
              <Text style={styles.freeText}>FREE</Text>
            </View>
          </View>

          {/* Tags Row */}
          <View style={styles.tagsRow}>
            <StatusBadge label={item.availability} color={AVAILABILITY_COLORS[item.availability] ?? '#64748b'} />
            <StatusBadge label={item.condition} color={CONDITION_COLORS[item.condition] ?? '#64748b'} />
            {item.tags.slice(0, 2).map(t => (
              <View key={t} style={[styles.tag, { backgroundColor: colors.secondary }]}>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }}>#{t}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: colors.foreground }]}>{item.description}</Text>

          {/* Details Grid */}
          <View style={[styles.detailsGrid, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {[
              { icon: 'box', label: 'Dimensions', value: item.dimensions },
              { icon: 'droplet', label: 'Color', value: item.color },
              { icon: 'map-pin', label: 'Location', value: item.location },
              { icon: 'truck', label: 'Pickup', value: item.pickupType },
              { icon: 'calendar', label: 'Posted', value: item.postedDate },
              { icon: 'clock', label: 'Expires', value: item.expiryDate },
            ].map((d, i) => (
              <View key={d.label} style={[
                styles.detailRow,
                i % 2 === 0 && i < 5 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : {},
              ]}>
                <Feather name={d.icon as any} size={14} color="#4DD0E1" />
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={{ fontSize: 10, color: colors.mutedForeground, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {d.label}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.foreground, fontFamily: 'Inter_500Medium', marginTop: 2 }}>
                    {d.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Pickup Instructions */}
          <View style={[styles.pickupCard, {
            backgroundColor: isDark ? '#0c2340' : '#e0f7fa',
            borderColor: isDark ? '#1e3a4a' : '#b2ebf2',
          }]}>
            <Text style={[styles.pickupTitle, { color: isDark ? '#4DD0E1' : '#00838F' }]}>Pickup Instructions</Text>
            <Text style={[styles.pickupText, { color: isDark ? '#94a3b8' : '#4a6b73' }]}>
              {item.pickupType === 'Mission Arlington'
                ? `Visit Mission Arlington at 1100 W. Pioneer Pkwy during operating hours. Mention item: "${item.name}". Bring your own transport for large items.`
                : item.pickupType === 'Curbside'
                ? 'Curbside pickup arranged through donor. Contact Mission Arlington staff to coordinate pickup timing and address.'
                : 'Scheduled pickup available. Call (817) 277-6620 to arrange a convenient time for large item delivery.'}
            </Text>
          </View>

          {/* Trust & Safety */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Feather name="shield" size={14} color="#10b981" />
              <Text style={{ fontSize: 11, color: '#10b981', fontFamily: 'Inter_500Medium', marginLeft: 4 }}>Verified Item</Text>
            </View>
            <View style={styles.trustItem}>
              <Feather name="users" size={14} color="#4DD0E1" />
              <Text style={{ fontSize: 11, color: '#4DD0E1', fontFamily: 'Inter_500Medium', marginLeft: 4 }}>{item.views} views</Text>
            </View>
            <View style={styles.trustItem}>
              <Feather name="heart" size={14} color="#F59E0B" />
              <Text style={{ fontSize: 11, color: '#F59E0B', fontFamily: 'Inter_500Medium', marginLeft: 4 }}>{item.requests} interested</Text>
            </View>
          </View>

          {/* Similar Items */}
          {similar.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={[styles.similarTitle, { color: colors.foreground }]}>Similar Items</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {similar.map(s => (
                  <ItemCard key={s.id} item={s} compact />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* CTA Footer */}
      <View style={[styles.footer, {
        backgroundColor: colors.background,
        borderTopColor: colors.border,
        paddingBottom: isWeb ? WEB_BOTTOM + 16 : insets.bottom + 16,
      }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            toggleSave(item.id);
          }}
          style={[styles.saveFooterBtn, {
            backgroundColor: saved ? '#4DD0E1' + '22' : colors.secondary,
            borderColor: saved ? '#4DD0E1' : colors.border,
          }]}
        >
          <Feather name="heart" size={20} color={saved ? '#4DD0E1' : colors.mutedForeground} />
        </Pressable>
        <Pressable
          onPress={handleInterest}
          style={[styles.interestedBtn, {
            backgroundColor: item.availability === 'Available' ? '#4DD0E1' : '#64748b',
            flex: 1,
          }]}
          disabled={item.availability !== 'Available'}
        >
          <Feather name="check-circle" size={18} color={item.availability === 'Available' ? '#0a0f1e' : '#f1f5f9'} />
          <Text style={[styles.interestedText, { color: item.availability === 'Available' ? '#0a0f1e' : '#f1f5f9' }]}>
            {item.availability === 'Available' ? "I'm Interested" : item.availability}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageHero: {
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  backRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    lineHeight: 28,
  },
  donorType: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  freeBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  freeText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#10b981',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
    marginBottom: 20,
  },
  detailsGrid: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  pickupCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  pickupTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  pickupText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginBottom: 8,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  similarTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  saveFooterBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interestedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    gap: 8,
  },
  interestedText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
