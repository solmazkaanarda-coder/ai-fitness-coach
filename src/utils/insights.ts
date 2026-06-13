/**
 * Rule-based insight engine.
 * Produces 1-2 contextual insights from current tracking data.
 * No external API calls — pure logic.
 */

import type { TrendDirection } from './analyticsCalcs';

export interface Insight {
  text: string;
  type: 'positive' | 'warning' | 'neutral';
  icon: string;
}

interface InsightParams {
  hydrationScore: number;
  nutritionScore: number;
  activityScore: number;
  weightDirection: TrendDirection;
  streak: number;
  nutritionLogsCount: number;
  lang: string;
}

type PoolKey =
  | 'hydration_low'
  | 'hydration_good'
  | 'weight_down'
  | 'weight_up'
  | 'streak_strong'
  | 'streak_start'
  | 'nutrition_empty'
  | 'activity_low'
  | 'activity_good'
  | 'all_good';

const POOL_EN: Record<PoolKey, Insight> = {
  hydration_low: { text: 'Hydration is below target. Drink more water today.', type: 'warning', icon: '💧' },
  hydration_good: { text: 'Excellent hydration! Keep drinking consistently.', type: 'positive', icon: '💧' },
  weight_down: { text: 'Weight is trending down. Great work staying consistent!', type: 'positive', icon: '📉' },
  weight_up: { text: 'Weight is trending up. A small nutrition adjustment may help.', type: 'warning', icon: '📈' },
  streak_strong: { text: 'Consistency streak is strong. Habits are forming fast!', type: 'positive', icon: '🔥' },
  streak_start: { text: 'Log a daily check-in today to start your consistency streak.', type: 'neutral', icon: '📅' },
  nutrition_empty: { text: 'Start logging meals to unlock your nutrition insights.', type: 'neutral', icon: '🍎' },
  activity_low: { text: 'Activity is low today. Even a 10-minute walk counts.', type: 'warning', icon: '⚡' },
  activity_good: { text: 'Activity goal is going strong today!', type: 'positive', icon: '⚡' },
  all_good: { text: 'All metrics are looking good today. Keep the momentum!', type: 'positive', icon: '✨' },
};

const POOL_TR: Record<PoolKey, Insight> = {
  hydration_low: { text: 'Su tüketimi hedefe ulaşmadı. Bugün daha fazla su iç.', type: 'warning', icon: '💧' },
  hydration_good: { text: 'Mükemmel hidrasyon! Düzenli içmeye devam et.', type: 'positive', icon: '💧' },
  weight_down: { text: 'Kilo düşüş trendinde. Harika devam ediyorsun!', type: 'positive', icon: '📉' },
  weight_up: { text: 'Kilo artış trendinde. Küçük bir beslenme düzenlemesi yardımcı olabilir.', type: 'warning', icon: '📈' },
  streak_strong: { text: 'Süreklilik serisi güçlü. Alışkanlıklar oluşuyor!', type: 'positive', icon: '🔥' },
  streak_start: { text: 'Süreklilik serisini başlatmak için bugün check-in yap.', type: 'neutral', icon: '📅' },
  nutrition_empty: { text: 'Beslenme içgörüleri için öğünleri kaydetmeye başla.', type: 'neutral', icon: '🍎' },
  activity_low: { text: 'Bugün aktivite düşük. 10 dakikalık yürüyüş bile sayılır.', type: 'warning', icon: '⚡' },
  activity_good: { text: 'Aktivite hedefi bugün güçlü gidiyor!', type: 'positive', icon: '⚡' },
  all_good: { text: 'Tüm metrikler iyi görünüyor. Momentum devam ediyor!', type: 'positive', icon: '✨' },
};

export function generateInsights(params: InsightParams): Insight[] {
  const pool = params.lang === 'tr' ? POOL_TR : POOL_EN;
  const selected: PoolKey[] = [];

  if (params.hydrationScore < 50) selected.push('hydration_low');
  else if (params.hydrationScore >= 75) selected.push('hydration_good');

  if (params.weightDirection === 'down') selected.push('weight_down');
  else if (params.weightDirection === 'up') selected.push('weight_up');

  if (params.streak >= 5) selected.push('streak_strong');
  else if (params.streak === 0) selected.push('streak_start');

  if (params.nutritionLogsCount === 0) selected.push('nutrition_empty');

  if (params.activityScore < 25) selected.push('activity_low');
  else if (params.activityScore >= 70) selected.push('activity_good');

  if (selected.length === 0) selected.push('all_good');

  return selected.slice(0, 2).map(k => pool[k]);
}
