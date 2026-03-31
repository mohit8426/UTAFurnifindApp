import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryPills from '@/components/CategoryPills';
import ItemCard from '@/components/ItemCard';
import SearchBar from '@/components/SearchBar';
import { CATEGORIES, INVENTORY, ItemCondition, ItemAvailability } from '@/constants/inventory';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

type SortOption = 'newest' | 'oldest' | 'most-viewed' | 'most-requested';

const WEB_TOP = 67;
const WEB_BOTTOM = 34;

export default function BrowseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterModal, setFilterModal] = useState(false);
  const [conditionFilter, setConditionFilter] = useState<ItemCondition | 'All'>('All');
  const [availFilter, setAvailFilter] = useState<ItemAvailability | 'All'>('All');
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? WEB_TOP : insets.top;
  const bottomPad = isWeb ? WEB_BOTTOM + 80 : insets.bottom + 80;

  const filtered = useMemo(() => {
    let items = [...INVENTORY];
    if (selectedCategory !== 'All') items = items.filter(i => i.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some(t => t.includes(q))
      );
    }
    if (conditionFilter !== 'All') items = items.filter(i => i.condition === conditionFilter);
    if (availFilter !== 'All') items = items.filter(i => i.availability === availFilter);
    switch (sortBy) {
      case 'newest': return items.sort((a, b) => b.postedDate.localeCompare(a.postedDate));
      case 'oldest': return items.sort((a, b) => a.postedDate.localeCompare(b.postedDate));
      case 'most-viewed': return items.sort((a, b) => b.views - a.views);
      case 'most-requested': return items.sort((a, b) => b.requests - a.requests);
    }
  }, [selectedCategory, searchQuery, sortBy, conditionFilter, availFilter]);

  const activeFiltersCount = [
    conditionFilter !== 'All',
    availFilter !== 'All',
    sortBy !== 'newest',
  ].filter(Boolean).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: colors.background,
        paddingTop: topPad + 8,
        borderBottomColor: colors.border,
      }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>Browse</Text>
          <Pressable
            onPress={() => setFilterModal(true)}
            style={[styles.filterBtn, {
              backgroundColor: activeFiltersCount > 0
                ? (isDark ? '#4DD0E1' : '#00BCD4') + '22'
                : colors.secondary,
              borderColor: activeFiltersCount > 0 ? '#4DD0E1' : colors.border,
            }]}
          >
            <Feather name="sliders" size={16} color={activeFiltersCount > 0 ? '#4DD0E1' : colors.mutedForeground} />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
        <View style={{ marginTop: 10, marginBottom: 12 }}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />
        <View style={styles.resultRow}>
          <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
          </Text>
          <SortPicker value={sortBy} onChange={setSortBy} />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <ItemCard item={item} />
          </View>
        )}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="package" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No items found</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />

      <FilterModal
        visible={filterModal}
        onClose={() => setFilterModal(false)}
        condition={conditionFilter}
        setCondition={setConditionFilter}
        avail={availFilter}
        setAvail={setAvailFilter}
        sort={sortBy}
        setSort={setSortBy}
      />
    </View>
  );
}

function SortPicker({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  const colors = useColors();
  const options: { key: SortOption; label: string }[] = [
    { key: 'newest', label: 'Newest' },
    { key: 'most-viewed', label: 'Popular' },
    { key: 'most-requested', label: 'Requested' },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {options.map(o => (
        <Pressable
          key={o.key}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onChange(o.key);
          }}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 99,
            backgroundColor: value === o.key ? '#4DD0E1' + '22' : 'transparent',
          }}
        >
          <Text style={{
            fontSize: 12,
            fontFamily: 'Inter_500Medium',
            color: value === o.key ? '#4DD0E1' : colors.mutedForeground,
          }}>
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function FilterModal({ visible, onClose, condition, setCondition, avail, setAvail, sort, setSort }: any) {
  const colors = useColors();
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const conditions: (ItemCondition | 'All')[] = ['All', 'Like New', 'Excellent', 'Good', 'Fair'];
  const avails: (ItemAvailability | 'All')[] = ['All', 'Available', 'Reserved', 'Claimed'];
  const sorts: { key: string; label: string }[] = [
    { key: 'newest', label: 'Newest First' },
    { key: 'oldest', label: 'Oldest First' },
    { key: 'most-viewed', label: 'Most Viewed' },
    { key: 'most-requested', label: 'Most Requested' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalBg} onPress={onClose} />
      <View style={[styles.modalSheet, {
        backgroundColor: colors.card,
        paddingBottom: insets.bottom + 16,
      }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>Filters & Sort</Text>
          <Pressable onPress={() => {
            setCondition('All');
            setAvail('All');
            setSort('newest');
          }}>
            <Text style={{ color: '#4DD0E1', fontFamily: 'Inter_500Medium' }}>Reset</Text>
          </Pressable>
        </View>

        <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>CONDITION</Text>
        <View style={styles.chipRow}>
          {conditions.map(c => (
            <ChipOption key={c} label={c} active={condition === c} onPress={() => setCondition(c)} />
          ))}
        </View>

        <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>AVAILABILITY</Text>
        <View style={styles.chipRow}>
          {avails.map(a => (
            <ChipOption key={a} label={a} active={avail === a} onPress={() => setAvail(a)} />
          ))}
        </View>

        <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>SORT BY</Text>
        <View style={styles.chipRow}>
          {sorts.map(s => (
            <ChipOption key={s.key} label={s.label} active={sort === s.key} onPress={() => setSort(s.key)} />
          ))}
        </View>

        <Pressable
          style={[styles.applyBtn, { backgroundColor: '#4DD0E1' }]}
          onPress={onClose}
        >
          <Text style={{ color: '#0a0f1e', fontFamily: 'Inter_700Bold', fontSize: 15 }}>Apply Filters</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function ChipOption({ label, active, onPress }: any) {
  const colors = useColors();
  const isDark = useColorScheme() === 'dark';
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, {
        backgroundColor: active ? '#4DD0E1' + '22' : (isDark ? '#1e293b' : '#f1f5f9'),
        borderColor: active ? '#4DD0E1' : colors.border,
      }]}
    >
      <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: active ? '#4DD0E1' : colors.mutedForeground }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4DD0E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#0a0f1e',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  resultCount: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  modalBg: {
    flex: 1,
    backgroundColor: '#00000066',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  filterLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  applyBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
});
