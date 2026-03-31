import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { INVENTORY, InventoryItem } from '@/constants/inventory';
import { useColors } from '@/hooks/useColors';

const WEB_TOP = 67;
const WEB_BOTTOM = 34;

const STATUS_OPTIONS = ['Available', 'Reserved', 'Claimed', 'Pending', 'Expired'];
const STATUS_COLORS: Record<string, string> = {
  Available: '#10b981',
  Reserved: '#F59E0B',
  Claimed: '#ef4444',
  Pending: '#8b5cf6',
  Expired: '#64748b',
};

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? WEB_TOP : insets.top;
  const bottomPad = isWeb ? WEB_BOTTOM + 80 : insets.bottom + 80;

  const [items, setItems] = useState<InventoryItem[]>(INVENTORY.slice(0, 30));
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filtered = selectedStatus === 'All'
    ? items
    : items.filter(i => i.availability === selectedStatus);

  const updateStatus = (id: string, status: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, availability: status } : i));
  };

  const stats = {
    available: items.filter(i => i.availability === 'Available').length,
    reserved: items.filter(i => i.availability === 'Reserved').length,
    claimed: items.filter(i => i.availability === 'Claimed').length,
    total: items.length,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Admin Panel</Text>
          <View style={[styles.adminBadge, { backgroundColor: '#F59E0B' + '22' }]}>
            <Feather name="shield" size={14} color="#F59E0B" />
            <Text style={{ fontSize: 11, color: '#F59E0B', fontFamily: 'Inter_600SemiBold', marginLeft: 4 }}>Admin</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total', value: stats.total, color: '#4DD0E1' },
            { label: 'Available', value: stats.available, color: '#10b981' },
            { label: 'Reserved', value: stats.reserved, color: '#F59E0B' },
            { label: 'Claimed', value: stats.claimed, color: '#ef4444' },
          ].map(s => (
            <View key={s.label} style={[styles.statChip, { backgroundColor: s.color + '22' }]}>
              <Text style={{ fontSize: 16, fontFamily: 'Inter_700Bold', color: s.color }}>{s.value}</Text>
              <Text style={{ fontSize: 10, fontFamily: 'Inter_500Medium', color: s.color }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Status Filter */}
        <View style={styles.filterRow}>
          {['All', ...STATUS_OPTIONS.slice(0, 4)].map(s => (
            <Pressable
              key={s}
              onPress={() => setSelectedStatus(s)}
              style={[styles.filterBtn, {
                backgroundColor: selectedStatus === s ? (STATUS_COLORS[s] ?? '#4DD0E1') + '22' : colors.secondary,
                borderColor: selectedStatus === s ? (STATUS_COLORS[s] ?? '#4DD0E1') : colors.border,
              }]}
            >
              <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: selectedStatus === s ? (STATUS_COLORS[s] ?? '#4DD0E1') : colors.mutedForeground }}>
                {s}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <AdminItemRow
            item={item}
            onStatusChange={(status) => updateStatus(item.id, status)}
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function AdminItemRow({ item, onStatusChange }: { item: InventoryItem; onStatusChange: (s: string) => void }) {
  const colors = useColors();
  const isDark = useColorScheme() === 'dark';
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  return (
    <View style={[styles.adminRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.adminRowMain}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.foreground }}>{item.name}</Text>
          <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 2 }}>
            {item.category} · {item.condition} · {item.postedDate}
          </Text>
        </View>
        <Pressable
          onPress={() => setShowStatusMenu(s => !s)}
          style={[styles.statusPill, { backgroundColor: (STATUS_COLORS[item.availability] ?? '#64748b') + '22' }]}
        >
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.availability] ?? '#64748b' }]} />
          <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: STATUS_COLORS[item.availability] ?? '#64748b' }}>
            {item.availability}
          </Text>
          <Feather name="chevron-down" size={12} color={STATUS_COLORS[item.availability] ?? '#64748b'} />
        </Pressable>
      </View>

      {showStatusMenu && (
        <View style={[styles.statusMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {STATUS_OPTIONS.map(s => (
            <Pressable
              key={s}
              onPress={() => {
                onStatusChange(s);
                setShowStatusMenu(false);
              }}
              style={[styles.statusOption, { borderBottomColor: colors.border }]}
            >
              <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[s] ?? '#64748b' }]} />
              <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: colors.foreground }}>{s}</Text>
              {item.availability === s && <Feather name="check" size={14} color="#4DD0E1" style={{ marginLeft: 'auto' }} />}
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.adminRowMeta}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Feather name="eye" size={11} color={colors.mutedForeground} />
          <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{item.views} views</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Feather name="heart" size={11} color={colors.mutedForeground} />
          <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{item.requests} requests</Text>
        </View>
        <Pressable>
          <Feather name="edit-2" size={14} color="#4DD0E1" />
        </Pressable>
        <Pressable>
          <Feather name="trash-2" size={14} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    flex: 1,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    gap: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
  adminRow: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  adminRowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  adminRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusMenu: {
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    overflow: 'hidden',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});
