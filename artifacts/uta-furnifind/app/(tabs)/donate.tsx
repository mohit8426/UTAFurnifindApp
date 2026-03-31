import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '@/constants/inventory';
import { useColors } from '@/hooks/useColors';

const WEB_TOP = 67;
const WEB_BOTTOM = 34;
const CONDITIONS = ['Like New', 'Excellent', 'Good', 'Fair'];
const PICKUP_TYPES = ['Mission Arlington Drop-off', 'Curbside Pickup', 'Scheduled Pickup'];

export default function DonateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? WEB_TOP : insets.top;
  const bottomPad = isWeb ? WEB_BOTTOM + 80 : insets.bottom + 80;

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [pickup, setPickup] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = () => {
    if (!name || !category || !condition || !description || !pickup || !contact) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={styles.successIcon}>
          <Feather name="check-circle" size={64} color="#10b981" />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Thank You!</Text>
        <Text style={[styles.successText, { color: colors.mutedForeground }]}>
          Your donation request has been submitted. Mission Arlington staff will review and contact you within 1-2 business days.
        </Text>
        <View style={[styles.impactCard, { backgroundColor: isDark ? '#0d3d24' : '#dcfce7', borderColor: '#10b981' + '44' }]}>
          <Text style={[styles.impactText, { color: '#10b981' }]}>
            Your {name || 'item'} could help a UTA student furnish their home for free!
          </Text>
        </View>
        <Pressable
          style={[styles.btn, { backgroundColor: '#4DD0E1' }]}
          onPress={() => {
            setStep('form');
            setName('');
            setCategory('');
            setCondition('');
            setDescription('');
            setDimensions('');
            setPickup('');
            setContact('');
          }}
        >
          <Text style={styles.btnText}>Donate Another Item</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      bottomOffset={20}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Donate an Item</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Help UTA students and Arlington families by donating furniture and household items
        </Text>
      </View>

      <View style={styles.body}>
        {/* Guidelines */}
        <View style={[styles.guideCard, {
          backgroundColor: isDark ? '#0c2340' : '#e0f7fa',
          borderColor: isDark ? '#1e3a4a' : '#b2ebf2',
        }]}>
          <Text style={[styles.guideTitle, { color: isDark ? '#4DD0E1' : '#00838F' }]}>Donation Guidelines</Text>
          {[
            'Items must be clean and in usable condition',
            'No broken or hazardous items',
            'Free furniture, appliances, and household goods accepted',
            'Large items: schedule a pickup time',
          ].map((g, i) => (
            <View key={i} style={styles.guideRow}>
              <Feather name="check" size={14} color={isDark ? '#4DD0E1' : '#00838F'} />
              <Text style={[styles.guideText, { color: isDark ? '#94a3b8' : '#4a6b73' }]}>{g}</Text>
            </View>
          ))}
        </View>

        <FormLabel label="Item Name *" />
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g., Brown leather sofa"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
        />

        <FormLabel label="Category *" />
        <View style={styles.chipGrid}>
          {CATEGORIES.filter(c => c !== 'All').slice(0, 12).map(cat => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.chip, {
                backgroundColor: category === cat ? '#4DD0E1' + '22' : (isDark ? '#1e293b' : '#f1f5f9'),
                borderColor: category === cat ? '#4DD0E1' : colors.border,
              }]}
            >
              <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: category === cat ? '#4DD0E1' : colors.mutedForeground }}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        <FormLabel label="Condition *" />
        <View style={styles.row}>
          {CONDITIONS.map(c => (
            <Pressable
              key={c}
              onPress={() => setCondition(c)}
              style={[styles.condChip, {
                backgroundColor: condition === c ? '#4DD0E1' + '22' : (isDark ? '#1e293b' : '#f1f5f9'),
                borderColor: condition === c ? '#4DD0E1' : colors.border,
                flex: 1,
              }]}
            >
              <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', textAlign: 'center', color: condition === c ? '#4DD0E1' : colors.mutedForeground }}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>

        <FormLabel label="Description *" />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the item, any defects, and why you're donating it..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <FormLabel label="Dimensions (optional)" />
        <TextInput
          value={dimensions}
          onChangeText={setDimensions}
          placeholder='e.g., 80"W x 35"D x 34"H'
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
        />

        <FormLabel label="Pickup Method *" />
        <View style={styles.chipGrid}>
          {PICKUP_TYPES.map(p => (
            <Pressable
              key={p}
              onPress={() => setPickup(p)}
              style={[styles.chip, {
                backgroundColor: pickup === p ? '#4DD0E1' + '22' : (isDark ? '#1e293b' : '#f1f5f9'),
                borderColor: pickup === p ? '#4DD0E1' : colors.border,
                width: '100%',
              }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name={p.includes('Drop') ? 'map-pin' : p.includes('Curb') ? 'truck' : 'calendar'} size={14} color={pickup === p ? '#4DD0E1' : colors.mutedForeground} />
                <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: pickup === p ? '#4DD0E1' : colors.mutedForeground }}>
                  {p}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <FormLabel label="Contact Info *" />
        <TextInput
          value={contact}
          onChangeText={setContact}
          placeholder="Email or phone number"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable
          style={[styles.submitBtn, { backgroundColor: '#4DD0E1', opacity: (!name || !category || !condition || !description || !pickup || !contact) ? 0.6 : 1 }]}
          onPress={handleSubmit}
        >
          <Feather name="gift" size={18} color="#0a0f1e" />
          <Text style={styles.submitText}>Submit Donation</Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

function FormLabel({ label }: { label: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  body: {
    paddingHorizontal: 16,
  },
  guideCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  guideTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  guideText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  condChip: {
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  submitBtn: {
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0a0f1e',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  successIcon: {
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  successText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  impactCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    width: '100%',
  },
  impactText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginTop: 8,
  },
  btnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0a0f1e',
  },
});
