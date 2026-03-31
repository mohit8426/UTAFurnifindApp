import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { INVENTORY, InventoryItem } from '@/constants/inventory';

export type UserRole = 'student' | 'donor' | 'admin' | 'community';

interface AppContextType {
  savedItems: string[];
  recentlyViewed: string[];
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  toggleSave: (itemId: string) => void;
  isItemSaved: (itemId: string) => boolean;
  addRecentlyViewed: (itemId: string) => void;
  getItemById: (id: string) => InventoryItem | undefined;
  inventory: InventoryItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  aiHelperVisible: boolean;
  setAiHelperVisible: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [userRole, setUserRoleState] = useState<UserRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [aiHelperVisible, setAiHelperVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedItems');
        const viewed = await AsyncStorage.getItem('recentlyViewed');
        const role = await AsyncStorage.getItem('userRole');
        if (saved) setSavedItems(JSON.parse(saved));
        if (viewed) setRecentlyViewed(JSON.parse(viewed));
        if (role) setUserRoleState(role as UserRole);
      } catch {}
    };
    load();
  }, []);

  const setUserRole = useCallback(async (role: UserRole) => {
    setUserRoleState(role);
    await AsyncStorage.setItem('userRole', role);
  }, []);

  const toggleSave = useCallback(async (itemId: string) => {
    setSavedItems(prev => {
      const next = prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId];
      AsyncStorage.setItem('savedItems', JSON.stringify(next));
      return next;
    });
  }, []);

  const isItemSaved = useCallback((itemId: string) => savedItems.includes(itemId), [savedItems]);

  const addRecentlyViewed = useCallback(async (itemId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(i => i !== itemId);
      const next = [itemId, ...filtered].slice(0, 20);
      AsyncStorage.setItem('recentlyViewed', JSON.stringify(next));
      return next;
    });
  }, []);

  const getItemById = useCallback((id: string) => INVENTORY.find(item => item.id === id), []);

  return (
    <AppContext.Provider value={{
      savedItems,
      recentlyViewed,
      userRole,
      setUserRole,
      toggleSave,
      isItemSaved,
      addRecentlyViewed,
      getItemById,
      inventory: INVENTORY,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      aiHelperVisible,
      setAiHelperVisible,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
