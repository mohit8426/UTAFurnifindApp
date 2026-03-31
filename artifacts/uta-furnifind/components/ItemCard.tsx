import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Image, Platform, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { InventoryItem } from '@/constants/inventory';
import CATEGORY_IMAGES from '@/constants/categoryImages';
import CategoryIcon from './CategoryIcon';

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

interface ItemCardProps {
  item: InventoryItem;
  compact?: boolean;
}

export default function ItemCard({ item, compact = false }: ItemCardProps) {
  const colors = useColors();
  const router = useRouter();
  const { toggleSave, isItemSaved } = useApp();
  const isDark = useColorScheme() === 'dark';
  const scale = React.useRef(new Animated.Value(1)).current;
  const saved = isItemSaved(item.id);
  const [imgError, setImgError] = useState(false);

  const imageUrl = CATEGORY_IMAGES[item.category] ?? CATEGORY_IMAGES['Miscellaneous'];
  const imageHeight = compact ? 110 : 168;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/item/${item.id}` as any);
  };

  const handleSave = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleSave(item.id);
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, compact && { width: 190, marginRight: 12 }]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, {
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...(Platform.OS !== 'web' ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: 8,
            elevation: 3,
          } : {}),
        }]}
      >
        {/* Image */}
        <View style={[styles.imageWrap, { height: imageHeight, backgroundColor: isDark ? '#1e2d4a' : '#e0f7fa' }]}>
          {!imgError ? (
            <Image
              source={{ uri: imageUrl }}
              style={[StyleSheet.absoluteFill, { borderRadius: 0 }]}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <CategoryIcon category={item.category} size={compact ? 32 : 48} color={isDark ? '#4DD0E1' : '#00BCD4'} />
          )}
          {/* Availability overlay badge */}
          <View style={[styles.availBadge, {
            backgroundColor: (AVAILABILITY_COLORS[item.availability] ?? '#64748b'),
          }]}>
            <Text style={styles.availText}>{item.availability}</Text>
          </View>
          {/* Save button overlay */}
          <Pressable
            onPress={handleSave}
            style={[styles.saveBtn, {
              backgroundColor: saved ? '#4DD0E1' : colors.card + 'cc',
            }]}
            hitSlop={8}
          >
            <Feather name="heart" size={14} color={saved ? '#0a0f1e' : colors.foreground} />
          </Pressable>
        </View>

        {/* Body */}
        <View style={[styles.body, { padding: compact ? 10 : 14 }]}>
          <Text style={[styles.name, { fontSize: compact ? 13 : 15, color: colors.foreground }]} numberOfLines={2}>
            {item.name}
          </Text>
          {!compact && (
            <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 4 }} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.tagRow}>
            <View style={styles.freeTag}>
              <Text style={styles.freeTagText}>FREE</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: (CONDITION_COLORS[item.condition] ?? '#64748b') + '22' }]}>
              <Text style={[styles.tagText, { color: CONDITION_COLORS[item.condition] ?? '#64748b' }]}>
                {item.condition}
              </Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={10} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]} numberOfLines={1}>
                {item.location.split(' - ')[0]}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="eye" size={10} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.views}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  imageWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  availBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  availText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  saveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {},
  name: {
    fontFamily: 'Inter_700Bold',
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  freeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    backgroundColor: '#dcfce7',
  },
  freeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
});
