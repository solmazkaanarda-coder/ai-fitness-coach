import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserPlan, setLanguage as setLanguageService } from "@/src/services/api/onboardingService";
import { useAppTheme } from "@/src/theme/ThemeContext";
import type { AppTheme } from "@/src/theme/themes";
import { THEMES } from "@/src/theme/themes";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";


type Screen = "welcome" | "account" | "personal" | "security" | "plan" | "theme";

import { tFor } from '@/src/i18n';
import { Language, useLanguage } from '@/src/i18n/LanguageContext';



export default function OnboardingScreen() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("welcome");
  const { lang, setLang } = useLanguage();
  const t = tFor(lang);
  const { themeName, setThemeName, theme } = useAppTheme();

  const styles = createStyles(theme);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [goal, setGoal] = useState("Fat Loss");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [plan, setPlan] = useState("Free");
  const [stepGoal, setStepGoal] = useState(8000);
  const [faceEnabled, setFaceEnabled] = useState(false);
  const [pin, setPin] = useState("");
  const [isBackendLoading, setIsBackendLoading] = useState(false);

  // Network calls delegated to src/services/api/onboardingService

  const changeLang = async (next: Language) => {
    // Update global language (persists via AsyncStorage in LanguageProvider)
    await setLang(next);
    try {
      // also persist to backend when possible
      await setLanguageService(next);
    } catch (error: any) {
      console.warn(`[LANGUAGE] Failed to save language to backend: ${error?.message || error}`);
      // fallback: language is already set locally
    }
  };

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setProfilePhoto(result.assets[0].uri);
  };

  const authenticateFace = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      Alert.alert("Face ID", t.faceIdUnavailable);
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t.enableFace,
      fallbackLabel: "",
      cancelLabel: t.cancel,
      disableDeviceFallback: true,
    });
    setFaceEnabled(result.success);
    Alert.alert("Face ID", result.success ? t.active : t.off);
  };

  const createPlan = async () => {
    try {
      setIsBackendLoading(true);
      console.log(`[CREATE PLAN] Starting...`);
      const parsedTargetWeight = targetWeight.trim() ? parseFloat(targetWeight) : null;
      const payload = {
        name: name || "Athlete",
        email: email || "",
        phone: phone || "",
        age: parseInt(age) || 25,
        gender: gender || "Male",
        height: parseFloat(height) || 175,
        weight: parseFloat(weight) || 80,
        target_weight: parsedTargetWeight && !isNaN(parsedTargetWeight) ? parsedTargetWeight : null,
        goal: goal || "Fat Loss",
        activity_level: activityLevel || "moderate",
        plan: plan || "Free",
        step_goal: stepGoal || 8000,
      };
      console.log(`[CREATE PLAN] Payload ready:`, payload);
      const response = await createUserPlan(payload);
      console.log(`[CREATE PLAN] SUCCESS, response:`, response);
      await AsyncStorage.setItem('@plan_result', JSON.stringify(response)).catch(() => {});
      // Persist email separately so the main app can display it without re-fetching profile
      if (email.trim()) {
        await AsyncStorage.setItem('@user_email', email.trim()).catch(() => {});
      }
      setScreen("theme");
    } catch (error: any) {
      console.error(`[CREATE PLAN] FAILED:`, error?.message || error);
      Alert.alert(t.connectionError, error?.message || t.connectionErrorBody, [{ text: t.ok }]);
      if (__DEV__) {
        // DEV-ONLY bypass: allow onboarding to continue locally when backend is unavailable.
        // This is temporary and should be removed before production release.
        console.log("[DEV BYPASS] Backend unavailable, advancing to theme screen for local dev testing.");
        setScreen("theme");
      }
    } finally {
      setIsBackendLoading(false);
    }
  };

  const LangButton = () => (
    <View style={styles.langMiniRow}>
      {(["tr", "en", "de", "ru", "es", "ar"] as Language[]).map((x) => (
        <TouchableOpacity key={x} onPress={() => changeLang(x)}>
          <Text style={lang === x ? styles.langMiniActive : styles.langMini}>{x.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (screen === "welcome") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.logoBlue}>AI</Text>
            <Text style={styles.logo}>FITNESS COACH</Text>
          </View>
          <View>
            <Text style={styles.heroTitle}>{t.welcome1}</Text>
            <Text style={styles.heroTitle}>{t.welcome2}</Text>
            <Text style={styles.heroSub}>{t.subtitle}</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("account")}>
              <Text style={styles.primaryText}>{t.start}</Text>
            </TouchableOpacity>
            <View style={styles.langRow}>
              {(["tr", "en", "de", "ru", "es", "ar"] as Language[]).map((x) => (
                <TouchableOpacity key={x} style={[styles.langChip, lang === x && styles.langActive]} onPress={() => changeLang(x)}>
                  <Text style={styles.langText}>{x.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "account") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.page}>
          <LangButton />
          <Top title={t.account} step="1 / 5" back={() => setScreen("welcome")} backText={t.back} />
          <TouchableOpacity style={styles.avatar} onPress={pickProfilePhoto}>
            {profilePhoto ? <Image source={{ uri: profilePhoto }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>👤</Text>}
            <View style={styles.cameraBadge}><Text>📷</Text></View>
          </TouchableOpacity>
          <Text style={styles.centerHint}>{t.uploadPhoto}</Text>
          <Input placeholder={t.name} value={name} setValue={setName} localStyles={styles} theme={theme} />
          <Input placeholder={t.email} value={email} setValue={setEmail} keyboard="email-address" localStyles={styles} theme={theme} />
          <Input placeholder={t.phone} value={phone} setValue={setPhone} keyboard="phone-pad" localStyles={styles} theme={theme} />
          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("personal")}>
            <Text style={styles.primaryText}>{t.continue}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "personal") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.page}>
          <LangButton />
          <Top title={t.personal} step="2 / 5" back={() => setScreen("account")} backText={t.back} />
          <Input placeholder={t.age} value={age} setValue={setAge} keyboard="numeric" localStyles={styles} theme={theme} />
          <Input placeholder={t.height} value={height} setValue={setHeight} keyboard="numeric" localStyles={styles} theme={theme} />
          <Input placeholder={t.weight} value={weight} setValue={setWeight} keyboard="numeric" localStyles={styles} theme={theme} />
          <Input placeholder={t.targetWeightLabel} value={targetWeight} setValue={setTargetWeight} keyboard="numeric" localStyles={styles} theme={theme} />
          <Text style={[styles.sectionTitle]}>{t.gender}</Text>
          <View style={styles.row}>
            <Chip label={t.male} active={gender === "Male"} onPress={() => setGender("Male")} localStyles={styles} theme={theme} />
            <Chip label={t.female} active={gender === "Female"} onPress={() => setGender("Female")} localStyles={styles} theme={theme} />
          </View>
          <Text style={[styles.sectionTitle]}>{t.goal}</Text>
          <View style={styles.row}>
            <Chip label={t.fatLoss} active={goal === "Fat Loss"} onPress={() => setGoal("Fat Loss")} localStyles={styles} theme={theme} />
            <Chip label={t.muscleGain} active={goal === "Muscle Gain"} onPress={() => setGoal("Muscle Gain")} localStyles={styles} theme={theme} />
          </View>
          <Text style={[styles.sectionTitle]}>{t.activity}</Text>
          <View style={styles.row}>
            <Chip label={t.low} active={activityLevel === "low"} onPress={() => setActivityLevel("low")} localStyles={styles} theme={theme} />
            <Chip label={t.moderate} active={activityLevel === "moderate"} onPress={() => setActivityLevel("moderate")} localStyles={styles} theme={theme} />
            <Chip label={t.high} active={activityLevel === "high"} onPress={() => setActivityLevel("high")} localStyles={styles} theme={theme} />
          </View>
          <Text style={[styles.sectionTitle]}>{t.stepGoal}: {stepGoal}</Text>
          <Slider
            minimumValue={3000}
            maximumValue={20000}
            step={500}
            value={stepGoal}
            onValueChange={setStepGoal}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.border}
            thumbTintColor={theme.primary}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("security")}>
            <Text style={styles.primaryText}>{t.continue}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "security") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.page}>
          <LangButton />
          <Top title={t.security} step="3 / 5" back={() => setScreen("personal")} backText={t.back} />
          <View style={styles.centerCard}>
            <Text style={styles.faceIcon}>⌾</Text>
            <Text style={[styles.cardTitle]}>{t.faceTitle}</Text>
            <Text style={[styles.cardText, { marginBottom: 16 }]}>{t.faceDesc}</Text>
          </View>
          <TouchableOpacity style={styles.optionCard} onPress={authenticateFace}>
            <Text style={styles.optionText}>{t.enableFace}</Text>
            <Text style={faceEnabled ? styles.on : styles.off}>{faceEnabled ? t.active : t.off}</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input]}
            placeholder={t.pin}
            placeholderTextColor={theme.mutedText}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
          <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen("plan")}>
            <Text style={styles.primaryText}>{t.continue}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "plan") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.page}>
          <LangButton />
          <Top title={t.plan} step="4 / 5" back={() => setScreen("security")} backText={t.back} />
          <TouchableOpacity style={[styles.planCard, plan === "Free" && styles.activeCard]} onPress={() => setPlan("Free")}>
            <Text style={[styles.cardTitle]}>{t.free}</Text>
            <Text style={[styles.cardText]}>{t.planDescription}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.planCard, plan === "Premium" && styles.premiumCard]} onPress={() => setPlan("Premium")}>
            <Text style={[styles.cardTitle]}>{t.premium}</Text>
            <Text style={[styles.price]}>{t.price}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, isBackendLoading && { opacity: 0.6 }]}
            onPress={createPlan}
            disabled={isBackendLoading}
          >
            <Text style={styles.primaryText}>{isBackendLoading ? t.preparing : t.createPlan}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "theme") {
    const themeOptions: Array<{ realName: import('@/src/theme/themes').ThemeName; label: string; desc: string }> = [
      { realName: "darkFuture", label: t.themeDarkFuture, desc: t.themeDarkFutureDesc },
      { realName: "aquaCore", label: t.themeAquaCore, desc: t.themeAquaCoreDesc },
      { realName: "sandElite", label: t.themeSandElite, desc: t.themeSandEliteDesc },
    ];

    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={[styles.header]}>
            {t.themeSelection}
          </Text>
          {themeOptions.map((item) => {
            const isSelected = themeName === item.realName;
            return (
              <TouchableOpacity
                key={item.realName}
                onPress={() => setThemeName(item.realName)}
                style={[
                  styles.planCard,
                  {
                    borderColor: isSelected ? theme.primary : theme.border,
                    borderWidth: 2,
                  },
                ]}
              >
                <Text style={[styles.cardTitle]}>{item.label}</Text>
                <Text style={[styles.cardText]}>{item.desc}</Text>
                <View style={{ marginTop: 10, height: 8, borderRadius: 8, backgroundColor: theme.primary, width: "60%" }} />
                {isSelected && <Text style={{ color: theme.primary, marginTop: 8, fontWeight: "900" }}>{t.themeSelected}</Text>}
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              console.log(`[ONBOARDING] Complete. Navigating to Dashboard...`);
              router.replace("/(tabs)");
            }}
          >
            <Text style={styles.primaryText}>
              {t.themeSelectionContinue}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

function Top({ title, step, back, backText }: any) {
  return (
    <View>
      <TouchableOpacity onPress={back}>
        <Text style={[styles.back]}>{backText}</Text>
      </TouchableOpacity>
      <Text style={[styles.headerCenter]}>{title}</Text>
      {step && <Text style={[styles.step]}>{step}</Text>}
    </View>
  );
}

function Input({ placeholder, value, setValue, keyboard = "default", localStyles, theme }: any) {
  return (
    <TextInput
      style={[localStyles.input]}
      placeholder={placeholder}
      placeholderTextColor={theme.mutedText}
      value={value}
      onChangeText={setValue}
      keyboardType={keyboard}
    />
  );
}

function Chip({ label, active, onPress, localStyles, theme }: any) {
  return (
    <TouchableOpacity
      style={[
        localStyles.chip,
        { backgroundColor: active ? theme.primary : theme.card, borderColor: active ? theme.primary : theme.border },
      ]}
      onPress={onPress}
    >
      <Text style={[active ? localStyles.chipActiveText : localStyles.chipText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  page: { padding: 24, paddingBottom: 40 },
  heroCard: {
    flex: 1,
    backgroundColor: theme.card,
    margin: 18,
    padding: 26,
    borderRadius: 28,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.border,
  },
  logoBlue: { color: theme.primary, fontSize: 56, fontWeight: "900" },
  logo: { color: theme.text, fontSize: 42, fontWeight: "900" },
  heroTitle: { color: theme.text, fontSize: 34, fontWeight: "900", marginBottom: 6 },
  heroSub: { color: theme.mutedText, fontSize: 17, lineHeight: 26, marginTop: 16 },
  langRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  langChip: { backgroundColor: theme.card, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: theme.border },
  langActive: { borderWidth: 1, borderColor: theme.primary },
  langText: { color: theme.text, fontWeight: "900" },
  langMiniRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginBottom: 8 },
  langMini: { color: theme.mutedText, fontWeight: "800" },
  langMiniActive: { color: theme.primary, fontWeight: "900" },
  header: { color: theme.text, fontSize: 30, fontWeight: "900" },
  headerCenter: { color: theme.text, fontSize: 28, fontWeight: "900", textAlign: "center", marginBottom: 20 },
  back: { color: theme.primary, fontSize: 18, marginBottom: 12 },
  step: { color: theme.primary, textAlign: "center", marginBottom: 20, fontSize: 20 },
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
  avatar: {
    alignSelf: "center",
    width: 130,
    height: 130,
    backgroundColor: theme.card,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  avatarImage: { width: 130, height: 130, borderRadius: 65 },
  avatarText: { fontSize: 46, color: theme.text },
  cameraBadge: { position: "absolute", right: 0, bottom: 8, backgroundColor: theme.primary, padding: 10, borderRadius: 20 },
  centerHint: { color: theme.mutedText, textAlign: "center", marginBottom: 20 },
  sectionTitle: { color: theme.text, fontSize: 20, fontWeight: "900", marginTop: 20, marginBottom: 12 },
  row: { flexDirection: "row", gap: 10, marginBottom: 10, flexWrap: "wrap" },
  chip: {
    backgroundColor: theme.card,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  chipActiveText: { color: theme.text, fontWeight: "900" },
  chipText: { color: theme.mutedText, fontWeight: "700" },
  centerCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  faceIcon: { color: theme.primary, fontSize: 52, marginBottom: 10 },
  optionCard: {
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  optionText: { color: theme.text, fontSize: 16, fontWeight: "800" },
  on: { color: theme.primary, fontWeight: "900" },
  off: { color: theme.mutedText, fontWeight: "900" },
  planCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  activeCard: { borderColor: theme.primary },
  premiumCard: { borderColor: theme.secondary, backgroundColor: theme.cardSoft },
  cardTitle: { color: theme.text, fontSize: 24, fontWeight: "900", marginBottom: 8 },
  price: { color: theme.primary, fontSize: 18, fontWeight: "900", marginBottom: 8 },
  cardText: { color: theme.mutedText, fontSize: 16, lineHeight: 24 },
});

const styles = createStyles(THEMES.aquaCore);
