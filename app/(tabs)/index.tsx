import { ConsistencyCard } from "@/src/components/analytics/ConsistencyCard";
import { ScoreRow } from "@/src/components/analytics/ScoreRow";
import { WeeklySummaryCard } from "@/src/components/analytics/WeeklySummaryCard";
import { WeightTrendCard } from "@/src/components/analytics/WeightTrendCard";
import { DashboardHeader, DashboardQuickActions, DashboardRecentActivities } from "@/src/components/dashboard";
import { DashboardHeroCard } from "@/src/components/DashboardHeroCard";
import { InsightCard } from "@/src/components/InsightCard";
import { TargetWeightCard } from "@/src/components/TargetWeightCard";
import { addProgressLog, addWater, analyzeMedia, loadDashboard, sendCoachMessage } from "@/src/services/api/dashboardActions";
import {
  addActivityLog,
  addDailyLog,
  addNutritionLog,
  addWeightLog,
  getActivityLogs,
  getDailyLogs,
  getNutritionLogs,
  getTrackingSummary,
  getWaterLogs,
  getWeightLogs,
  type ActivityLog,
  type TrackingSummary,
  type WaterLog,
  type WeightLog,
} from "@/src/services/api/tracking";
import { useAppTheme } from "@/src/theme/ThemeContext";
import type { AppTheme } from "@/src/theme/themes";
import { THEMES } from "@/src/theme/themes";
import {
  calcActivityScore,
  calcHydrationScore,
  calcNutritionScore,
  calcStreak,
  calcWeeklyStats,
  calcWeightTrend,
} from "@/src/utils/analyticsCalcs";
import { generateInsights } from "@/src/utils/insights";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Network helpers moved to src/services/api/dashboardActions.ts

type Screen = "dashboard" | "water" | "coach" | "analysis" | "progress" | "profile" | "nutrition" | "daily";

import { tFor } from "@/src/i18n";
import { useLanguage, type Language } from "@/src/i18n/LanguageContext";

export default function DashboardScreen() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const { lang, setLang } = useLanguage();
  const t = tFor(lang);
  const { theme: appTheme, themeName, setThemeName } = useAppTheme();

  const theme = appTheme;
  const styles = createStyles(theme);

  const [dashboard, setDashboard] = useState<any>(null);
  const [dailyData, setDailyData] = useState<any>(null);
  const [waterMl, setWaterMl] = useState(0);

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<any[]>([
    { from: "coach", text: t.ask || "Merhaba! Beslenme, su, adım, antrenman veya ilerleme hakkında yazabilirsin." },
  ]);

  const [progressWeight, setProgressWeight] = useState("");
  const [progressFat, setProgressFat] = useState("");
  const [progressSteps, setProgressSteps] = useState("");
  const [progressNote, setProgressNote] = useState("");
  const [progressLogs, setProgressLogs] = useState<any[]>([]);

  const [analysisPhoto, setAnalysisPhoto] = useState<string | null>(null);
  const [analysisVideo, setAnalysisVideo] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const [name, setName] = useState("Athlete");
  const [plan, setPlan] = useState("Free");

  // Tracking layer state
  const [trackingSummary, setTrackingSummary] = useState<TrackingSummary | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [waterLogHistory, setWaterLogHistory] = useState<WaterLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<any[]>([]);
  const [dailyCheckLogs, setDailyCheckLogs] = useState<any[]>([]);

  // Activity type picker (progress screen)
  const [progressActivityType, setProgressActivityType] = useState("manual");

  // Nutrition screen state
  const [nutritionCalories, setNutritionCalories] = useState("");
  const [nutritionProtein, setNutritionProtein] = useState("");
  const [nutritionCarbs, setNutritionCarbs] = useState("");
  const [nutritionFat, setNutritionFat] = useState("");
  const [nutritionMealType, setNutritionMealType] = useState("other");
  const [nutritionNote, setNutritionNote] = useState("");
  const [nutritionSaving, setNutritionSaving] = useState(false);

  // Daily check-in screen state
  const [dailyMood, setDailyMood] = useState("");
  const [dailyNote, setDailyNote] = useState("");
  const [dailyActivityMinutes, setDailyActivityMinutes] = useState("");
  const [dailySaving, setDailySaving] = useState(false);

  // Profile / Settings state
  const [userEmail, setUserEmail] = useState("");
  const [saveMsg, setSaveMsg] = useState("");  // transient "Saved!" feedback

  // Network calls are delegated to src/services/api/dashboardActions

  useEffect(() => {
    (async () => {
      // Load cached plan result first so the UI shows targets instantly
      try {
        const cached = await AsyncStorage.getItem('@plan_result');
        if (cached) {
          const parsed = JSON.parse(cached);
          setDashboard(parsed);
          if (parsed.name) setName(parsed.name);
          if (parsed.plan) setPlan(parsed.plan);
        }
        // Email is stored separately (create-plan response has no email field)
        const savedEmail = await AsyncStorage.getItem('@user_email');
        if (savedEmail) setUserEmail(savedEmail);
      } catch {}

      // Fetch live dashboard from backend: daily values + fresh targets
      try {
        const data = await loadDashboard();
        if (data?.dashboard) {
          setDashboard(data.dashboard);
          if (data.dashboard.name) setName(data.dashboard.name);
          if (data.dashboard.plan) setPlan(data.dashboard.plan);
        }
        // profile contains the email from memory (set at plan creation)
        if (data?.profile?.email) setUserEmail(data.profile.email);
        setDailyData(data);
        if (typeof data?.water_ml === 'number') setWaterMl(data.water_ml);
        if (Array.isArray(data?.progress_logs)) setProgressLogs(data.progress_logs);
      } catch {}

      // Load tracking layer data in parallel (non-blocking)
      Promise.allSettled([
        getTrackingSummary(),
        getWeightLogs(),
        getWaterLogs(),
        getActivityLogs(),
        getNutritionLogs(),
        getDailyLogs(),
      ]).then(([summary, weights, waters, activities, nutrition, daily]) => {
        if (summary.status === 'fulfilled') setTrackingSummary(summary.value?.data ?? null);
        if (weights.status === 'fulfilled') setWeightLogs(weights.value?.data ?? []);
        if (waters.status === 'fulfilled') setWaterLogHistory(waters.value?.data ?? []);
        if (activities.status === 'fulfilled') setActivityLogs(activities.value?.data ?? []);
        if (nutrition.status === 'fulfilled') setNutritionLogs(nutrition.value?.data ?? []);
        if (daily.status === 'fulfilled') setDailyCheckLogs(daily.value?.data ?? []);
      }).catch(() => {});
    })();
  }, []);

  const formatLiters = (ml: number) => {
    return (ml / 1000).toFixed(2).replace(/\.00$/, "").replace(/\.0$/, "");
  };

  const addWaterMl = async (amountMl: number) => {
    try {
      const data = await addWater(amountMl);
      setWaterMl(data.water_ml);
    } catch (error) {
      setWaterMl(waterMl + amountMl);
    }
  };

  const pickAnalysisPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setAnalysisPhoto(result.assets[0].uri);
      const data = await analyzeMedia('photo', plan, lang, 'photo analysis');
      setAnalysisResult(data);
    }
  };

  const pickAnalysisVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    });
    if (!result.canceled) {
      setAnalysisVideo(result.assets[0].uri);
      const data = await analyzeMedia('video', plan, lang, 'video analysis');
      setAnalysisResult(data);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setChatInput("");
    try {
      const data = await sendCoachMessage(userMsg, lang);
      setMessages((prev) => [...prev, { from: "coach", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { from: "coach", text: "..." }]);
    }
  };

  const saveProgress = async () => {
    if (!progressWeight || !progressFat) return;
    const newLog = {
      day_label: `Day ${progressLogs.length + 1}`,
      weight: Number(progressWeight),
      body_fat: Number(progressFat),
      steps: Number(progressSteps || 0),
      water_ml: waterMl,
      note: progressNote,
    };
    try {
      const data = await addProgressLog(newLog);
      setProgressLogs(data.progress_logs);
      // Refresh dashboard so readiness score and daily steps update immediately
      try {
        const fresh = await loadDashboard();
        if (fresh?.dashboard) setDashboard(fresh.dashboard);
        setDailyData(fresh);
      } catch {}
    } catch {
      setProgressLogs((prev) => [...prev, newLog]);
    }

    // Also log to tracking layer (fire-and-forget — does not block the UI)
    addWeightLog({ weight: Number(progressWeight), note: progressNote }).catch(() => {});
    if (progressSteps) {
      addActivityLog({
        steps: Number(progressSteps),
        source: 'manual',
        type: progressActivityType,
      }).catch(() => {});
    }
    // Refresh tracking data after short delay so the new entries are captured
    setTimeout(() => {
      getWeightLogs().then(r => setWeightLogs(r?.data ?? [])).catch(() => {});
      getActivityLogs().then(r => setActivityLogs(r?.data ?? [])).catch(() => {});
    }, 400);

    setProgressWeight("");
    setProgressFat("");
    setProgressSteps("");
    setProgressNote("");
  };

  const saveNutrition = async () => {
    if (!nutritionCalories && !nutritionProtein) return;
    setNutritionSaving(true);
    try {
      await addNutritionLog({
        calories: nutritionCalories ? Number(nutritionCalories) : undefined,
        protein: nutritionProtein ? Number(nutritionProtein) : undefined,
        carbs: nutritionCarbs ? Number(nutritionCarbs) : undefined,
        fat: nutritionFat ? Number(nutritionFat) : undefined,
        meal_type: nutritionMealType,
        note: nutritionNote,
      });
      const r = await getNutritionLogs();
      setNutritionLogs(r?.data ?? []);
      setNutritionCalories("");
      setNutritionProtein("");
      setNutritionCarbs("");
      setNutritionFat("");
      setNutritionNote("");
      // Refresh tracking summary so dashboard card updates
      getTrackingSummary().then(r => setTrackingSummary(r?.data ?? null)).catch(() => {});
    } catch {}
    setNutritionSaving(false);
  };

  const saveDaily = async () => {
    setDailySaving(true);
    try {
      await addDailyLog({
        mood: dailyMood || undefined,
        steps: progressSteps ? Number(progressSteps) : undefined,
        weight: progressWeight ? Number(progressWeight) : undefined,
        water: waterMl || undefined,
        activity_minutes: dailyActivityMinutes ? Number(dailyActivityMinutes) : undefined,
        note: dailyNote,
      });
      const r = await getDailyLogs();
      setDailyCheckLogs(r?.data ?? []);
      setDailyMood("");
      setDailyNote("");
      setDailyActivityMinutes("");
    } catch {}
    setDailySaving(false);
  };

  const showSaveMsg = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 2000);
  };

  const BottomNav = () => (
    <View style={[styles.bottomNav, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
      <Nav label={t.dashboard} active={screen === "dashboard"} onPress={() => setScreen("dashboard")} localStyles={styles} theme={theme} />
      <Nav label={t.water} active={screen === "water"} onPress={() => setScreen("water")} localStyles={styles} theme={theme} />
      <Nav label={t.coach} active={screen === "coach"} onPress={() => setScreen("coach")} localStyles={styles} theme={theme} />
      <Nav label={t.analysis} active={screen === "analysis"} onPress={() => setScreen("analysis")} localStyles={styles} theme={theme} />
      <Nav label={t.profile} active={screen === "profile"} onPress={() => setScreen("profile")} localStyles={styles} theme={theme} />
    </View>
  );

  if (screen === "dashboard") {
    const targetMl = Math.round((dashboard?.water_liters || 2.8) * 1000);
    // Prepare hero card metrics
    const heroMetrics = [
      {
        label: t.calories,
        current: dailyData?.calories_consumed ?? 0,
        target: dashboard?.calorie_target || 2500,
        unit: 'kcal',
        color: (theme as any).calorieColor || '#F4A860',
      },
      {
        label: t.protein,
        current: dailyData?.protein_consumed ?? 0,
        target: dashboard?.protein_target || 120,
        unit: 'g',
        color: (theme as any).proteinColor || '#7FE4D9',
      },
      {
        label: t.water,
        current: Math.round(waterMl / 1000),
        target: Math.round(targetMl / 1000),
        unit: 'L',
        color: (theme as any).waterColor || '#60B4FF',
      },
      {
        label: t.steps,
        current: dailyData?.daily_steps ?? 0,
        target: dashboard?.step_goal || 8000,
        unit: 'steps',
        color: (theme as any).successColor || '#A4D65E',
      },
    ];

    // Map activity logs to the WorkoutRow format
    const ACTIVITY_ICONS: Record<string, string> = {
      run: '🏃', walk: '🚶', gym: '💪', cycling: '🚴', swim: '🏊', manual: '⚡',
    };
    const recentWorkouts = activityLogs.slice(-5).reverse().map((log) => ({
      activityType: log.type === 'manual' ? 'Activity' : (log.type ?? 'Activity'),
      icon: ACTIVITY_ICONS[log.type] ?? '⚡',
      duration: log.duration ? `${log.duration} min` : log.steps ? `${log.steps} steps` : '-',
      distance: log.distance ? `${log.distance} km` : undefined,
      calories: log.calories ? `${log.calories} kcal` : '-',
    }));

    // Analytics scores
    const hydrationScore = calcHydrationScore(waterMl, targetMl);
    const nutritionScore = calcNutritionScore(nutritionLogs, dashboard?.calorie_target || 2500);
    const totalActivityMins = activityLogs.reduce((s: number, l: any) => s + (l.duration ?? 0), 0);
    const activityScore = calcActivityScore(
      dailyData?.daily_steps ?? 0,
      dashboard?.step_goal || 8000,
      totalActivityMins,
    );
    const streak = calcStreak(dailyCheckLogs);
    const weightTrend = calcWeightTrend(weightLogs);
    const insights = generateInsights({
      hydrationScore,
      nutritionScore,
      activityScore,
      weightDirection: weightTrend.direction,
      streak: streak.current,
      nutritionLogsCount: nutritionLogs.length,
      lang,
    });

    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          {/* Dashboard Header */}
          <DashboardHeader
            name={name}
            theme={theme}
            onSettingsPress={() => setScreen('profile')}
            lang={lang}
          />

          {/* Hero Card - Daily Readiness */}
          <DashboardHeroCard
            score={dailyData?.readiness_score ?? 0}
            maxScore={100}
            metrics={heroMetrics}
            subText={dailyData?.readiness_status === 'no_data' ? t.startLoggingToday : undefined}
          />

          {/* Target Weight Card */}
          <TargetWeightCard
            currentWeight={dashboard?.weight ?? dailyData?.profile?.weight ?? 0}
            targetWeight={dashboard?.target_weight ?? null}
            startingWeight={dashboard?.starting_weight ?? dashboard?.weight}
          />

          {/* Analytics Score Row */}
          <ScoreRow
            hydrationScore={hydrationScore}
            nutritionScore={nutritionScore}
            activityScore={activityScore}
            streak={streak.current}
            hydrationLabel={(t as any).hydrationScore ?? 'Hydration'}
            nutritionLabel={(t as any).nutritionScore ?? 'Nutrition'}
            activityLabel={(t as any).activityScore ?? 'Activity'}
            streakLabel={(t as any).consistencyStreak ?? 'Streak'}
            daysLabel={(t as any).days ?? 'days'}
          />

          {/* Quick Actions */}
          <DashboardQuickActions
            theme={theme}
            onWaterPress={() => setScreen('water')}
            onMealPress={() => setScreen('nutrition')}
            onWorkoutPress={() => setScreen('progress')}
            onWeightPress={() => setScreen('progress')}
            lang={lang}
          />

          {/* AI Coach Insight — rule-based dynamic insights */}
          <InsightCard
            insights={insights}
            onButtonPress={() => setScreen('coach')}
          />

          {/* Recent Activities */}
          <DashboardRecentActivities
            theme={theme}
            workouts={recentWorkouts}
            onWorkoutPress={() => setScreen('progress')}
            lang={lang}
          />

          {/* Bottom spacer for tab bar */}
          <View style={{ height: 20 }} />
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  if (screen === "water") {
    const targetMl = Math.round((dashboard?.water_liters || 2.8) * 1000);
    const percent = Math.min(100, Math.round((waterMl / targetMl) * 100));
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <Top title={t.water} back={() => setScreen("dashboard")} backText={t.back} localStyles={styles} />
          <View style={[styles.waterCircle, { borderColor: theme.primary, backgroundColor: theme.card }]}>
            <Text style={[styles.waterBig, { color: theme.text }]}>{formatLiters(waterMl)} L</Text>
            <Text style={[styles.cardText, { color: theme.mutedText }]}>/ {formatLiters(targetMl)} L</Text>
            <Text style={[styles.percent, { color: theme.primary }]}>{percent}%</Text>
          </View>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={() => addWaterMl(200)}>
            <Text style={styles.primaryText}>+200 ml</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            {[100, 200, 500].map((amount) => (
              <TouchableOpacity key={amount} style={[styles.smallButton, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]} onPress={() => addWaterMl(amount)}>
                <Text style={[styles.smallButtonText, { color: theme.text }]}>+{amount} ml</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Water log history */}
          {waterLogHistory.length > 0 && (
            <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t.todayRecord}</Text>
              {waterLogHistory.slice(-8).reverse().map((log, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: i < Math.min(waterLogHistory.length, 8) - 1 ? 1 : 0, borderBottomColor: theme.border }}>
                  <Text style={[styles.cardText, { color: theme.text }]}>+{log.amount_ml} ml</Text>
                  <Text style={[styles.cardText, { color: theme.mutedText }]}>{log.total_ml ? `${log.total_ml} ml total` : ''}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  if (screen === "coach") {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <Top title={t.coach} back={() => setScreen("dashboard")} backText={t.back} localStyles={styles} />
          {messages.map((msg, i) => (
            <View key={i} style={[msg.from === "user" ? styles.userBubble : styles.coachBubble, { backgroundColor: msg.from === "user" ? theme.primary : theme.card, borderColor: theme.border, borderWidth: 1 }]}>
              <Text style={[styles.bubbleText, { color: theme.text }]}>{msg.text}</Text>
            </View>
          ))}
          <View style={styles.chatInputRow}>
            <TextInput
              style={[styles.chatInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              placeholder={t.ask}
              placeholderTextColor={theme.mutedText}
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.primary }]} onPress={sendChat}>
              <Text style={styles.primaryText}>➤</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  if (screen === "analysis") {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <Top title={t.analysis} back={() => setScreen("dashboard")} backText={t.back} localStyles={styles} />
          <TouchableOpacity style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={pickAnalysisPhoto}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{t.photoAnalysis}</Text>
            <Text style={[styles.cardText, { color: theme.mutedText }]}>{t.photoText}</Text>
          </TouchableOpacity>
          {analysisPhoto && (
            <View style={styles.imageWrap}>
              <Image source={{ uri: analysisPhoto }} style={styles.analysisImage} />
              {analysisResult?.effect_label && (
                <View style={[styles.effectBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.effectText}>{analysisResult.effect_label}</Text>
                </View>
              )}
            </View>
          )}
          <TouchableOpacity style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={pickAnalysisVideo}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{t.videoAnalysis}</Text>
            <Text style={[styles.cardText, { color: theme.mutedText }]}>{t.videoText}</Text>
          </TouchableOpacity>
          {analysisVideo && <Text style={[styles.limitText, { color: theme.primary }]}>Video selected ✅</Text>}
          {analysisResult?.advice && (
            <View style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t.analysis}</Text>
              <Text style={[styles.cardText, { color: theme.mutedText }]}>{analysisResult.advice}</Text>
            </View>
          )}
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  if (screen === "progress") {
    const progressWeightTrend = calcWeightTrend(weightLogs);
    const progressStreak = calcStreak(dailyCheckLogs);
    const progressWeeklyStats = calcWeeklyStats(weightLogs, nutritionLogs, activityLogs);

    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <Top title={t.progress} back={() => setScreen("dashboard")} backText={t.back} localStyles={styles} />
          <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{t.todayRecord}</Text>
            <Input placeholder={t.weight} value={progressWeight} setValue={setProgressWeight} keyboard="numeric" localStyles={styles} theme={theme} />
            <Input placeholder={t.bodyFat} value={progressFat} setValue={setProgressFat} keyboard="numeric" localStyles={styles} theme={theme} />
            <Input placeholder={t.steps} value={progressSteps} setValue={setProgressSteps} keyboard="numeric" localStyles={styles} theme={theme} />
            {/* Activity type picker */}
            {!!progressSteps && (
              <>
                <Text style={[styles.cardText, { color: theme.mutedText, marginBottom: 8 }]}>{t.activityType}</Text>
                <View style={styles.activityTypeRow}>
                  {(['run','walk','gym','cycling','swim','other'] as const).map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.activityChip, progressActivityType === type && styles.activityChipActive]}
                      onPress={() => setProgressActivityType(type)}
                    >
                      <Text style={progressActivityType === type ? styles.activityChipTextActive : styles.activityChipText}>
                        {t[type] ?? type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
            <Input placeholder={t.note} value={progressNote} setValue={setProgressNote} localStyles={styles} theme={theme} />
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={saveProgress}>
              <Text style={styles.primaryText}>{t.save}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, marginTop: 10 }]} onPress={() => setScreen('daily')}>
              <Text style={[styles.primaryText, { color: theme.text }]}>{t.logDaily}</Text>
            </TouchableOpacity>
          </View>
          {progressLogs.length === 0 ? (
            <Text style={[styles.cardText, { color: theme.mutedText }]}>{t.noData}</Text>
          ) : (
            progressLogs.map((log, i) => (
              <View key={i} style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{log.day_label}</Text>
                <Text style={[styles.chartLine, { color: theme.text }]}>{t.weight}: {log.weight} kg</Text>
                <Text style={[styles.chartLine, { color: theme.text }]}>{t.bodyFat}: %{log.body_fat}</Text>
                <Text style={[styles.chartLine, { color: theme.text }]}>{t.steps}: {log.steps}</Text>
                <Text style={[styles.chartLine, { color: theme.text }]}>{t.water}: {log.water_ml} ml</Text>
                {!!log.note && <Text style={[styles.cardText, { color: theme.mutedText }]}>{log.note}</Text>}
              </View>
            ))
          )}

          {/* Weight tracking log */}
          {weightLogs.length > 0 && (
            <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 8 }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t.weight} {t.progress ?? 'History'}</Text>
              {weightLogs.slice(-5).reverse().map((log, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: i < Math.min(weightLogs.length, 5) - 1 ? 1 : 0, borderBottomColor: theme.border }}>
                  <Text style={[styles.chartLine, { color: theme.text, fontSize: 16 }]}>{log.weight} kg</Text>
                  <Text style={[styles.cardText, { color: theme.mutedText }]}>{log.date ? new Date(log.date).toLocaleDateString() : ''}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Analytics: Weight Trend with sparkline */}
          <WeightTrendCard
            trend={progressWeightTrend}
            title={(t as any).weightTrend ?? 'Weight Trend'}
            noDataText={(t as any).noTrendData ?? 'Log weight to see your trend'}
          />

          {/* Analytics: 7-day summary */}
          <WeeklySummaryCard
            stats={progressWeeklyStats}
            title={(t as any).weeklySummary ?? 'This Week'}
            noDataText={(t as any).noWeeklyData ?? 'Log this week to see your summary'}
            labels={{
              avgWeight: (t as any).avgWeight ?? 'Avg Weight',
              avgCalories: (t as any).avgCalories ?? 'Avg Calories',
              avgProtein: (t as any).avgProtein ?? 'Avg Protein',
              totalActivity: (t as any).totalActivity ?? 'Activity Total',
              daysLogged: (t as any).daysLogged ?? 'Days Logged',
              minutes: (t as any).minutes ?? 'min',
              days: (t as any).days ?? 'days',
            }}
          />

          {/* Analytics: Consistency streak */}
          <ConsistencyCard
            streak={progressStreak}
            title={(t as any).yourStreak ?? 'Consistency'}
            currentLabel={(t as any).currentStreak ?? 'Current'}
            bestLabel={(t as any).bestStreak ?? 'Best'}
            daysLabel={(t as any).days ?? 'days'}
            buildLabel={(t as any).buildStreak ?? 'Log a daily check-in to start your streak'}
          />

          <View style={{ height: 20 }} />
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  if (screen === "nutrition") {
    const MEAL_TYPES = ['breakfast','lunch','dinner','snack','other'] as const;
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <Top title={t.nutritionLog} back={() => setScreen("dashboard")} backText={t.back} localStyles={styles} />

          <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{t.logNutrition}</Text>

            {/* Meal type chips */}
            <Text style={[styles.cardText, { color: theme.mutedText, marginBottom: 8 }]}>{t.mealType}</Text>
            <View style={styles.mealTypeRow}>
              {MEAL_TYPES.map(mt => (
                <TouchableOpacity
                  key={mt}
                  style={[styles.mealChip, nutritionMealType === mt && styles.mealChipActive]}
                  onPress={() => setNutritionMealType(mt)}
                >
                  <Text style={nutritionMealType === mt ? styles.mealChipTextActive : styles.mealChipText}>
                    {t[mt] ?? mt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input placeholder={t.caloriesKcal} value={nutritionCalories} setValue={setNutritionCalories} keyboard="numeric" localStyles={styles} theme={theme} />
            <Input placeholder={t.proteinG} value={nutritionProtein} setValue={setNutritionProtein} keyboard="numeric" localStyles={styles} theme={theme} />
            <Input placeholder={t.carbsG} value={nutritionCarbs} setValue={setNutritionCarbs} keyboard="numeric" localStyles={styles} theme={theme} />
            <Input placeholder={t.fatG} value={nutritionFat} setValue={setNutritionFat} keyboard="numeric" localStyles={styles} theme={theme} />
            <Input placeholder={t.note} value={nutritionNote} setValue={setNutritionNote} localStyles={styles} theme={theme} />

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary, opacity: nutritionSaving ? 0.6 : 1 }]}
              onPress={saveNutrition}
              disabled={nutritionSaving}
            >
              <Text style={styles.primaryText}>{nutritionSaving ? t.preparing : t.save}</Text>
            </TouchableOpacity>
          </View>

          {/* Nutrition history */}
          {nutritionLogs.length > 0 && (
            <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t.nutritionHistory}</Text>
              {nutritionLogs.slice(-6).reverse().map((log, i) => (
                <View key={i} style={[styles.logRow, { borderBottomWidth: i < Math.min(nutritionLogs.length, 6) - 1 ? 1 : 0 }]}>
                  <View>
                    <Text style={styles.logRowText}>{t[log.meal_type] ?? log.meal_type}</Text>
                    {!!log.note && <Text style={styles.logRowMeta}>{log.note}</Text>}
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    {log.calories != null && <Text style={[styles.logRowText, { color: theme.primary }]}>{log.calories} kcal</Text>}
                    {log.protein != null && <Text style={styles.logRowMeta}>{log.protein}g protein</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  if (screen === "daily") {
    const MOODS = ['great','good','ok','bad'] as const;
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <Top title={t.dailyLog} back={() => setScreen("progress")} backText={t.back} localStyles={styles} />

          <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{t.logDaily}</Text>

            {/* Mood picker */}
            <Text style={[styles.cardText, { color: theme.mutedText, marginBottom: 8 }]}>{t.mood}</Text>
            <View style={styles.moodRow}>
              {MOODS.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.moodChip, dailyMood === m && styles.moodChipActive]}
                  onPress={() => setDailyMood(m)}
                >
                  <Text style={dailyMood === m ? styles.moodChipTextActive : styles.moodChipText}>
                    {t[m] ?? m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input placeholder={t.activityMinutes} value={dailyActivityMinutes} setValue={setDailyActivityMinutes} keyboard="numeric" localStyles={styles} theme={theme} />
            <Input placeholder={t.note} value={dailyNote} setValue={setDailyNote} localStyles={styles} theme={theme} />

            {/* Summary row pulled from current session */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
              <Text style={[styles.cardText, { color: theme.mutedText }]}>{t.water}: {waterMl} ml</Text>
              {!!progressWeight && <Text style={[styles.cardText, { color: theme.mutedText }]}>{t.weight}: {progressWeight} kg</Text>}
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary, opacity: dailySaving ? 0.6 : 1 }]}
              onPress={saveDaily}
              disabled={dailySaving}
            >
              <Text style={styles.primaryText}>{dailySaving ? t.preparing : t.save}</Text>
            </TouchableOpacity>
          </View>

          {/* Daily check-in history */}
          {dailyCheckLogs.length > 0 && (
            <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t.dailyLogHistory}</Text>
              {dailyCheckLogs.slice(-5).reverse().map((log, i) => (
                <View key={i} style={[styles.logRow, { borderBottomWidth: i < Math.min(dailyCheckLogs.length, 5) - 1 ? 1 : 0 }]}>
                  <View>
                    {!!log.mood && <Text style={styles.logRowText}>{t[log.mood] ?? log.mood}</Text>}
                    {!!log.note && <Text style={styles.logRowMeta}>{log.note}</Text>}
                    {log.activity_minutes != null && <Text style={styles.logRowMeta}>{log.activity_minutes} {t.activityMinutes}</Text>}
                  </View>
                  <Text style={styles.logRowMeta}>{log.date ? new Date(log.date).toLocaleDateString() : ''}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  // ── Profile / Settings screen ────────────────────────────────────────────────
  const THEME_OPTS: { name: import('@/src/theme/themes').ThemeName; label: string; color: string }[] = [
    { name: 'aquaCore',    label: t.themeAquaCore,  color: '#2F9BFF' },
    { name: 'darkFuture',  label: t.themeDarkFuture, color: '#FF8A00' },
    { name: 'sandElite',   label: t.themeSandElite,  color: '#9A6A3A' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.pageWithNav}>
        <Top title={t.profile} back={() => setScreen("dashboard")} backText={t.back} localStyles={styles} />

        {/* Profile card */}
        <View style={[styles.profileHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={styles.profileAvatar}>👤</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 2 }]}>{name}</Text>
            <Text style={[styles.cardText, { color: theme.mutedText, fontSize: 14, marginBottom: 0 }]}>
              {userEmail || t.noEmail}
            </Text>
          </View>
          <View style={[styles.planTag, { backgroundColor: theme.primary + '22', borderColor: theme.primary }]}>
            <Text style={[styles.planTagText, { color: theme.primary }]}>{plan}</Text>
          </View>
        </View>

        {/* Theme section */}
        <Text style={[styles.sectionLabel, { color: theme.mutedText }]}>{t.themeSelection}</Text>
        <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border, paddingVertical: 6, paddingHorizontal: 20 }]}>
          {THEME_OPTS.map((opt, idx) => (
            <TouchableOpacity
              key={opt.name}
              style={[
                styles.settingsRow,
                { borderBottomColor: theme.border, borderBottomWidth: idx < THEME_OPTS.length - 1 ? 1 : 0 },
              ]}
              onPress={() => setThemeName(opt.name)}
              activeOpacity={0.7}
            >
              <View style={[styles.themeColorDot, { backgroundColor: opt.color }]} />
              <Text style={[styles.settingsRowLabel, { color: theme.text }]}>{opt.label}</Text>
              {themeName === opt.name && (
                <Text style={{ color: theme.primary, fontWeight: '900', fontSize: 20 }}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Language section */}
        <Text style={[styles.sectionLabel, { color: theme.mutedText }]}>Language</Text>
        <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.langPillRow}>
            {(['tr', 'en', 'de', 'ru', 'es', 'ar'] as Language[]).map((l) => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.langPill,
                  {
                    borderColor: lang === l ? theme.primary : theme.border,
                    backgroundColor: lang === l ? theme.primary : theme.background,
                  },
                ]}
                onPress={() => setLang(l)}
                activeOpacity={0.7}
              >
                <Text style={{ color: lang === l ? '#fff' : theme.mutedText, fontWeight: '700', fontSize: 13 }}>
                  {l.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

function Top({ title, step, back, backText, localStyles }: any) {
  return (
    <View>
      <TouchableOpacity onPress={back}>
        <Text style={localStyles.back}>{backText}</Text>
      </TouchableOpacity>
      <Text style={localStyles.headerCenter}>{title}</Text>
      {step && <Text style={localStyles.step}>{step}</Text>}
    </View>
  );
}

function Input({ placeholder, value, setValue, keyboard = "default", localStyles, theme }: any) {
  return (
    <TextInput
      style={[localStyles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
      placeholder={placeholder}
      placeholderTextColor={theme.mutedText}
      value={value}
      onChangeText={setValue}
      keyboardType={keyboard}
    />
  );
}

function Stat({ title, value, localStyles, theme }: any) {
  return (
    <View style={[localStyles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[localStyles.statTitle, { color: theme.mutedText }]}>{title}</Text>
      <Text style={[localStyles.statValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

function Nav({ label, active, onPress, localStyles, theme }: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[active ? localStyles.navActive : localStyles.navText, { color: active ? theme.primary : theme.mutedText }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  page: { padding: 24, paddingBottom: 40 },
  pageWithNav: { padding: 24, paddingBottom: 130 },
  header: { color: theme.text, fontSize: 30, fontWeight: "900" },
  headerCenter: { color: theme.text, fontSize: 28, fontWeight: "900", textAlign: "center", marginBottom: 20 },
  subHeader: { color: theme.mutedText, fontSize: 16, marginTop: 6, marginBottom: 24 },
  back: { color: theme.primary, fontSize: 18, marginBottom: 12 },
  input: {
    backgroundColor: theme.card,
    color: theme.text,
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: theme.border,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: theme.primary,
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 18,
  },
  primaryText: { color: theme.text, fontSize: 18, fontWeight: "900" },
  avatarText: { fontSize: 46, color: theme.text },
  row: { flexDirection: "row", gap: 10, marginBottom: 10, flexWrap: "wrap" },
  centerCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  planCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardTitle: { color: theme.text, fontSize: 24, fontWeight: "900", marginBottom: 8 },
  price: { color: theme.primary, fontSize: 18, fontWeight: "900", marginBottom: 8 },
  cardText: { color: theme.mutedText, fontSize: 16, lineHeight: 24 },
  limitText: { color: theme.primary, fontWeight: "800", marginTop: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    width: "48%",
    backgroundColor: theme.card,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  statTitle: { color: theme.mutedText, fontSize: 14 },
  statValue: { color: theme.text, fontSize: 20, fontWeight: "900", marginTop: 8 },
  actionCard: {
    backgroundColor: theme.card,
    borderRadius: 22,
    padding: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  waterCircle: {
    height: 260,
    borderRadius: 130,
    borderWidth: 14,
    borderColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  waterBig: { color: theme.text, fontSize: 46, fontWeight: "900" },
  percent: { color: theme.primary, fontSize: 22, fontWeight: "900", marginTop: 8 },
  smallButton: { flex: 1, backgroundColor: theme.card, padding: 16, borderRadius: 16, alignItems: "center" },
  smallButtonText: { color: theme.text, fontWeight: "900" },
  coachBubble: {
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    alignSelf: "flex-start",
    maxWidth: "82%",
  },
  userBubble: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    alignSelf: "flex-end",
    maxWidth: "82%",
  },
  bubbleText: { color: theme.text, fontSize: 16, lineHeight: 23 },
  chatInputRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  chatInput: { flex: 1, backgroundColor: theme.card, color: theme.text, padding: 16, borderRadius: 18 },
  sendButton: { backgroundColor: theme.primary, width: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  chartCard: {
    backgroundColor: theme.card,
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  chartLine: { color: theme.text, fontSize: 18, fontWeight: "800", marginTop: 8 },
  imageWrap: { marginBottom: 18 },
  analysisImage: { width: "100%", height: 320, borderRadius: 24 },
  effectBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: theme.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  effectText: { color: theme.text, fontWeight: "900" },
  bottomNav: {
    position: "absolute",
    bottom: 56,
    left: 0,
    right: 0,
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navText: { fontWeight: "800" },
  navActive: { fontWeight: "900" },
  summaryChip: {
    backgroundColor: theme.background,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: "center",
  },
  summaryChipLabel: { color: theme.mutedText, fontSize: 11, fontWeight: "600" },
  summaryChipValue: { color: theme.text, fontSize: 15, fontWeight: "900", marginTop: 2 },
  mealTypeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  mealChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
  },
  mealChipActive: { borderColor: theme.primary, backgroundColor: theme.primary },
  mealChipText: { color: theme.mutedText, fontWeight: "700", fontSize: 14 },
  mealChipTextActive: { color: theme.text, fontWeight: "900", fontSize: 14 },
  activityTypeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  activityChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
  },
  activityChipActive: { borderColor: theme.primary, backgroundColor: theme.primary },
  activityChipText: { color: theme.mutedText, fontWeight: "700", fontSize: 14 },
  activityChipTextActive: { color: theme.text, fontWeight: "900", fontSize: 14 },
  moodRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  moodChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    alignItems: "center",
  },
  moodChipActive: { borderColor: theme.primary, backgroundColor: theme.primary },
  moodChipText: { color: theme.mutedText, fontWeight: "700" },
  moodChipTextActive: { color: theme.text, fontWeight: "900" },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  logRowText: { color: theme.text, fontSize: 15, fontWeight: "700" },
  logRowMeta: { color: theme.mutedText, fontSize: 13 },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
  },
  profileAvatar: { fontSize: 44 },
  planTag: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.primary,
    backgroundColor: theme.cardSoft,
  },
  planTagText: { color: theme.primary, fontWeight: "800", fontSize: 13 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
    color: theme.mutedText,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  themeColorDot: { width: 14, height: 14, borderRadius: 7 },
  settingsRowLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: theme.text },
  langPillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  langPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
  },
});

const styles = createStyles(THEMES.aquaCore);
