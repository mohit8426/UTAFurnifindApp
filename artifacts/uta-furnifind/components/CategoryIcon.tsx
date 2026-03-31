import { Feather } from '@expo/vector-icons';
import React from 'react';

interface Props {
  category: string;
  size?: number;
  color?: string;
}

const CATEGORY_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  'Sofas': 'grid',
  'Chairs': 'grid',
  'Tables': 'grid',
  'Computer Chairs': 'monitor',
  'Beds': 'moon',
  'Bed Frames': 'moon',
  'Mattresses': 'moon',
  'Couches': 'grid',
  'Televisions': 'tv',
  'Kitchen Items': 'coffee',
  'Study Desks': 'book-open',
  'Storage': 'box',
  'Lamps': 'sun',
  'Toys': 'star',
  'Bookshelves': 'book',
  'Mirrors': 'eye',
  'Rugs': 'grid',
  'Appliances': 'cpu',
  'Miscellaneous': 'package',
  'All': 'grid',
};

export default function CategoryIcon({ category, size = 24, color = '#00BCD4' }: Props) {
  const iconName = CATEGORY_ICONS[category] ?? 'package';
  return <Feather name={iconName} size={size} color={color} />;
}
