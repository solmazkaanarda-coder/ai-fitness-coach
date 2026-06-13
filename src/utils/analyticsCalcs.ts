/**
 * Pure analytics calculation functions.
 * No UI imports — safe to use anywhere.
 */

import type { ActivityLog, WeightLog, WaterLog } from '../services/api/tracking';

// ── Score calculations (0-100) ────────────────────────────────────────────────

export function calcHydrationScore(waterMl: number, targetMl: number): number {
  if (targetMl <= 0) return 0;
  return Math.min(100, Math.round((waterMl / targetMl) * 100));
}

export function calcNutritionScore(
  logs: { calories?: number | null; protein?: number | null }[],
  targetCalories: number,
): number {
  if (logs.length === 0) return 0;
  const total = logs.reduce((s, l) => s + (l.calories ?? 0), 0);
  const calorieScore =
    targetCalories > 0 ? Math.min(60, Math.round((total / targetCalories) * 60)) : 30;
  const consistencyBonus = Math.min(40, logs.length * 14); // 3 logs ≈ max bonus
  return Math.min(100, calorieScore + consistencyBonus);
}

export function calcActivityScore(
  steps: number,
  stepGoal: number,
  activityMinutes: number,
): number {
  const stepScore = stepGoal > 0 ? Math.min(70, Math.round((steps / stepGoal) * 70)) : 0;
  const minuteScore = Math.min(30, Math.round((activityMinutes / 30) * 30));
  return stepScore + minuteScore;
}

// ── Weight trend ──────────────────────────────────────────────────────────────

export type TrendDirection = 'up' | 'down' | 'stable' | 'nodata';

export interface WeightTrendResult {
  direction: TrendDirection;
  change: number;       // latest - previous
  latest: number | null;
  previous: number | null;
  sparkline: number[];  // last 7 weights for bar chart
}

export function calcWeightTrend(logs: WeightLog[]): WeightTrendResult {
  if (logs.length === 0) {
    return { direction: 'nodata', change: 0, latest: null, previous: null, sparkline: [] };
  }
  const sparkline = logs.slice(-7).map(l => l.weight);
  const latest = sparkline[sparkline.length - 1];
  if (sparkline.length === 1) {
    return { direction: 'stable', change: 0, latest, previous: null, sparkline };
  }
  const previous = sparkline[sparkline.length - 2];
  const change = +(latest - previous).toFixed(1);
  const direction: TrendDirection = change < -0.09 ? 'down' : change > 0.09 ? 'up' : 'stable';
  return { direction, change, latest, previous, sparkline };
}

// ── Consistency streak ────────────────────────────────────────────────────────

export interface StreakResult {
  current: number;
  best: number;
}

export function calcStreak(dailyLogs: { date?: string | null }[]): StreakResult {
  if (dailyLogs.length === 0) return { current: 0, best: 0 };

  const dates = [
    ...new Set(
      dailyLogs
        .map(l => (l.date ? new Date(l.date).toISOString().split('T')[0] : null))
        .filter(Boolean),
    ),
  ].sort() as string[];

  if (dates.length === 0) return { current: 0, best: 0 };

  let best = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = Math.round(
      (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / 86400000,
    );
    if (diff === 1) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }
  best = Math.max(best, run);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffToday = Math.round(
    (today.getTime() - new Date(dates[dates.length - 1]).getTime()) / 86400000,
  );
  const current = diffToday <= 1 ? run : 0;

  return { current, best };
}

// ── Weekly summary ────────────────────────────────────────────────────────────

export interface WeeklyStats {
  avgWeight: number | null;
  totalActivityMinutes: number;
  avgCalories: number | null;
  avgProtein: number | null;
  daysLogged: number;
}

function isInLastDays(isoDate: string | undefined | null, days: number): boolean {
  if (!isoDate) return false;
  return Date.now() - new Date(isoDate).getTime() < days * 86400000;
}

export function calcWeeklyStats(
  weightLogs: WeightLog[],
  nutritionLogs: { calories?: number | null; protein?: number | null; date?: string | null }[],
  activityLogs: ActivityLog[],
): WeeklyStats {
  const w7 = weightLogs.filter(l => isInLastDays(l.date, 7));
  const n7 = nutritionLogs.filter(l => isInLastDays(l.date, 7));
  const a7 = activityLogs.filter(l => isInLastDays(l.date, 7));

  const avgWeight =
    w7.length > 0
      ? +(w7.reduce((s, l) => s + l.weight, 0) / w7.length).toFixed(1)
      : null;

  const totalCalories = n7.reduce((s, l) => s + (l.calories ?? 0), 0);
  const avgCalories = n7.length > 0 ? Math.round(totalCalories / n7.length) : null;
  const avgProtein =
    n7.length > 0
      ? +(n7.reduce((s, l) => s + (l.protein ?? 0), 0) / n7.length).toFixed(1)
      : null;
  const totalActivityMinutes = a7.reduce((s, l) => s + (l.duration ?? 0), 0);

  const days = new Set(
    [...w7.map(l => l.date), ...n7.map(l => l.date), ...a7.map(l => l.date)]
      .filter(Boolean)
      .map(d => d!.split('T')[0]),
  );

  return { avgWeight, totalActivityMinutes, avgCalories, avgProtein, daysLogged: days.size };
}
