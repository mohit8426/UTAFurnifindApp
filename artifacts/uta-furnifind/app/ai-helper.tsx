import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { INVENTORY } from '@/constants/inventory';
import { useColors } from '@/hooks/useColors';

const WEB_TOP = 67;
const WEB_BOTTOM = 34;

interface Suggestion {
  question: string;
  answer: string;
  items: string[];
}

const PRESET_QUESTIONS = [
  { label: 'Dorm setup', prompt: 'What do I need for a dorm room?' },
  { label: '1-bed apartment', prompt: 'Essentials for a one-bedroom apartment?' },
  { label: 'Study space', prompt: 'Best items for a student study space?' },
  { label: 'Budget setup', prompt: 'Minimum items needed to start living?' },
];

function generateAIResponse(prompt: string): Suggestion {
  const lower = prompt.toLowerCase();

  if (lower.includes('dorm')) {
    return {
      question: prompt,
      answer: "For a dorm room, you'll need essentials that maximize small space. I recommend focusing on a Twin XL mattress (most dorms require this size), a compact desk and desk lamp for studying, a small bookshelf for organization, a mini fridge for snacks, storage bins to keep things organized, and a floor lamp for cozy lighting. UTA FurniFind has several of these available right now!",
      items: ['70', '22', '92', '65', '26', '9'],
    };
  }

  if (lower.includes('one-bedroom') || lower.includes('1-bedroom') || lower.includes('apartment')) {
    return {
      question: prompt,
      answer: "For a one-bedroom apartment, you'll want: a bed frame + mattress, a sofa or loveseat for the living area, a dining table with chairs, a TV and TV stand, a dresser for storage, kitchen essentials (pots, pans, dishes), and a study desk. We have all of these available at Mission Arlington right now — check out the highlighted items!",
      items: ['3', '31', '12', '57', '14', '21', '40', '2'],
    };
  }

  if (lower.includes('study') || lower.includes('desk') || lower.includes('work')) {
    return {
      question: prompt,
      answer: "For the perfect student study space, I recommend: an ergonomic computer chair to avoid back pain during long sessions, a spacious desk (L-shaped if possible), a good LED desk lamp with adjustable brightness, a bookshelf for your textbooks, and a whiteboard planner to stay organized. All of these are currently available!",
      items: ['4', '34', '22', '6', '92'],
    };
  }

  if (lower.includes('budget') || lower.includes('minimum') || lower.includes('essential') || lower.includes('start')) {
    return {
      question: prompt,
      answer: "Starting from scratch? Here are the absolute must-haves: a mattress or bed to sleep on, a folding table and chair for eating and working, a lamp for lighting, basic kitchen items (utensils, pot, dishes), and storage bins. These 5 items will get you functional immediately. Mission Arlington usually has all of these in stock!",
      items: ['28', '72', '9', '85', '26'],
    };
  }

  if (lower.includes('kitchen')) {
    return {
      question: prompt,
      answer: "For a well-equipped student kitchen, grab: a pot and pan set for cooking, kitchen utensils, a dish set, a coffee maker if you're a coffee person, a microwave for quick meals, a rice cooker (great for students!), a can opener and basic tools, and a blender for smoothies. These will have you cooking real meals in no time!",
      items: ['21', '8', '40', '38', '11', '45', '85', '30'],
    };
  }

  return {
    question: prompt,
    answer: `Great question! Based on your needs, here are some key items I'd recommend from our current inventory. For most UTA students, the most popular items are study desks, comfortable chairs, storage solutions, and kitchen essentials. Browse our inventory for ${prompt.toLowerCase().includes('sofa') ? 'sofas and couches' : prompt.toLowerCase().includes('bed') ? 'beds and mattresses' : 'all available items'} — we update stock regularly!`,
    items: ['37', '4', '65', '22', '90', '100'],
  };
}

export default function AIHelperScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? WEB_TOP : insets.top;
  const bottomPad = isWeb ? WEB_BOTTOM + 80 : insets.bottom + 80;

  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = (q?: string) => {
    const q_ = q ?? query;
    if (!q_) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(generateAIResponse(q_));
      setLoading(false);
    }, 1200);
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      bottomOffset={20}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.foreground }]}>AI Advisor</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Get personalized furniture recommendations
            </Text>
          </View>
          <View style={[styles.aiBadge, { backgroundColor: '#8b5cf6' + '22' }]}>
            <Feather name="cpu" size={16} color="#8b5cf6" />
          </View>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        {/* Input */}
        <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Ask me anything about furniture needs..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground }]}
            multiline
          />
          <Pressable
            onPress={() => handleAsk()}
            style={[styles.sendBtn, { backgroundColor: query.trim() ? '#8b5cf6' : colors.secondary }]}
            disabled={!query.trim()}
          >
            <Feather name="send" size={18} color={query.trim() ? '#fff' : colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Presets */}
        <View style={styles.presetRow}>
          {PRESET_QUESTIONS.map(p => (
            <Pressable
              key={p.label}
              onPress={() => {
                setQuery(p.prompt);
                handleAsk(p.prompt);
              }}
              style={[styles.presetBtn, {
                backgroundColor: isDark ? '#1a1040' : '#f5f3ff',
                borderColor: isDark ? '#3b2f6b' : '#ddd6fe',
              }]}
            >
              <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: '#8b5cf6' }}>{p.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Loading */}
        {loading && (
          <View style={[styles.thinkingCard, {
            backgroundColor: isDark ? '#1a1040' : '#f5f3ff',
            borderColor: isDark ? '#3b2f6b' : '#ddd6fe',
          }]}>
            <Feather name="cpu" size={20} color="#8b5cf6" />
            <Text style={{ color: '#8b5cf6', fontFamily: 'Inter_500Medium', marginLeft: 10 }}>
              Analyzing your needs...
            </Text>
          </View>
        )}

        {/* Result */}
        {result && !loading && (
          <View style={{ marginTop: 16 }}>
            {/* Answer */}
            <View style={[styles.answerCard, {
              backgroundColor: isDark ? '#1a1040' : '#f5f3ff',
              borderColor: isDark ? '#3b2f6b' : '#ddd6fe',
            }]}>
              <View style={styles.answerHeader}>
                <View style={[styles.aiAvatar, { backgroundColor: '#8b5cf6' }]}>
                  <Feather name="cpu" size={16} color="#fff" />
                </View>
                <Text style={[styles.answerLabel, { color: '#8b5cf6' }]}>AI Recommendation</Text>
              </View>
              <Text style={[styles.answerText, { color: colors.foreground }]}>
                {result.answer}
              </Text>
            </View>

            {/* Recommended items */}
            {result.items.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.recTitle, { color: colors.foreground }]}>Recommended Items Available Now</Text>
                {result.items.map(itemId => {
                  const item = INVENTORY.find(i => i.id === itemId);
                  if (!item) return null;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => router.push(`/item/${item.id}` as any)}
                      style={[styles.recRow, {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      }]}
                    >
                      <View style={[styles.recIcon, { backgroundColor: isDark ? '#1e2d4a' : '#e0f7fa' }]}>
                        <Feather name="package" size={20} color="#4DD0E1" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.foreground }}>
                          {item.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 2 }}>
                          {item.category} · {item.condition} · {item.availability}
                        </Text>
                      </View>
                      <View style={[{
                        backgroundColor: item.availability === 'Available' ? '#10b981' + '22' : '#F59E0B' + '22',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 99,
                      }]}>
                        <Text style={{
                          fontSize: 11,
                          fontFamily: 'Inter_600SemiBold',
                          color: item.availability === 'Available' ? '#10b981' : '#F59E0B'
                        }}>
                          {item.availability}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Ask again */}
            <Pressable
              onPress={() => setResult(null)}
              style={[styles.resetBtn, { borderColor: '#8b5cf6' }]}
            >
              <Feather name="refresh-cw" size={14} color="#8b5cf6" />
              <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: '#8b5cf6', marginLeft: 8 }}>
                Ask Another Question
              </Text>
            </Pressable>
          </View>
        )}

        {/* How it works (initial state) */}
        {!result && !loading && (
          <View style={{ marginTop: 24 }}>
            <Text style={[styles.recTitle, { color: colors.foreground }]}>How the AI Advisor Works</Text>
            {[
              { icon: 'message-circle', text: 'Tell me about your living situation and what you need', color: '#4DD0E1' },
              { icon: 'cpu', text: 'AI analyzes current inventory and matches your requirements', color: '#8b5cf6' },
              { icon: 'list', text: 'Get a personalized list of recommended items available now', color: '#10b981' },
              { icon: 'map-pin', text: 'Visit Mission Arlington to pick them up — all free!', color: '#F59E0B' },
            ].map((step, i) => (
              <View key={i} style={[styles.howStep, {
                backgroundColor: colors.card,
                borderColor: colors.border,
              }]}>
                <View style={[styles.stepNum, { backgroundColor: step.color + '22' }]}>
                  <Feather name={step.icon as any} size={16} color={step.color} />
                </View>
                <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.foreground, flex: 1, lineHeight: 18 }}>
                  {step.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </KeyboardAwareScrollViewCompat>
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
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  aiBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  presetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  thinkingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
  },
  answerCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  answerLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  answerText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  recTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    marginBottom: 12,
  },
  recRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  recIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
  },
  howStep: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 14,
  },
  stepNum: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
