import { useAppTheme } from "@/src/theme/ThemeContext";
import { ThemeName } from "@/src/theme/themes";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import * as LocalAuthentication from "expo-local-authentication";
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
  View,
} from "react-native";

const API_URL = "https://ai-fitness-backend-o5h1.onrender.com";

type Screen =
  | "welcome"
  | "account"
  | "personal"
  | "security"
  | "plan"
  | "theme"
  | "dashboard"
  | "water"
  | "coach"
  | "analysis"
  | "progress"
  | "profile";

type Language = "tr" | "en" | "de" | "ru";

const L = {
  tr: {
    start: "Hadi Başlayalım",
    welcome1: "Senin için.",
    welcome2: "Seninle birlikte.",
    subtitle: "Kişiselleştirilmiş planlar, akıllı koç desteği ve ilerleme takibi.",
    account: "Hesap Oluştur",
    personal: "Kişisel Bilgiler",
    security: "Güvenlik Ayarları",
    plan: "Plan Seçimi",
    dashboard: "Ana Sayfa",
    water: "Su",
    coach: "Koç",
    analysis: "Analiz",
    progress: "İlerleme",
    profile: "Profil",
    continue: "Devam Et",
    back: "‹ Geri",
    uploadPhoto: "Profil Fotoğrafı Yükle",
    name: "Ad Soyad",
    email: "E-posta",
    phone: "Telefon Numarası",
    age: "Yaş",
    height: "Boy (cm)",
    weight: "Kilo (kg)",
    gender: "Cinsiyet",
    male: "Erkek",
    female: "Kadın",
    goal: "Hedef",
    fatLoss: "Yağ Kaybı",
    muscleGain: "Kas Kazanımı",
    activity: "Aktivite",
    low: "Düşük",
    moderate: "Orta",
    high: "Yüksek",
    faceTitle: "Face ID",
    faceDesc: "Butona basınca cihaz doğrudan yüz doğrulaması isteyecek.",
    enableFace: "Face ID ile doğrula",
    active: "AKTİF",
    off: "KAPALI",
    pin: "4 Haneli PIN",
    free: "Free",
    premium: "Premium",
    price: "249.99 TL / ay",
    createPlan: "Planı Oluştur",
    stepGoal: "Günlük Adım Hedefi",
    hello: "Merhaba",
    today: "Bugün harika bir gün, devam et.",
    calories: "Kalori",
    protein: "Protein",
    steps: "Adım",
    dailyRecord: "Süreç ve Günlük Kayıt",
    dailyRecordText: "Kilo, yağ oranı, adım, su ve notlarını kaydet.",
    add250: "+250 ml Su İçtim",
    ask: "Bir şey sor...",
    send: "Gönder",
    photoAnalysis: "Foto Analizi",
    videoAnalysis: "Video Form Analizi",
    photoText: "Foto yükle, yağ oranı tahmini ve tavsiye al.",
    videoText: "Video yükle, form skoru ve teknik tavsiye al.",
    todayRecord: "Bugünkü Kayıt",
    bodyFat: "Vücut yağ oranı (%)",
    note: "Not",
    save: "Kaydet",
    noData: "Henüz veri yok. Kayıt girince burada görünecek.",
  },
  en: {
    start: "Get Started",
    welcome1: "For you.",
    welcome2: "Together with you.",
    subtitle: "Personalized plans, smart coaching and progress tracking.",
    account: "Create Account",
    personal: "Personal Info",
    security: "Security Settings",
    plan: "Choose Plan",
    dashboard: "Home",
    water: "Water",
    coach: "Coach",
    analysis: "Analysis",
    progress: "Progress",
    profile: "Profile",
    continue: "Continue",
    back: "‹ Back",
    uploadPhoto: "Upload Profile Photo",
    name: "Full Name",
    email: "Email",
    phone: "Phone Number",
    age: "Age",
    height: "Height (cm)",
    weight: "Weight (kg)",
    gender: "Gender",
    male: "Male",
    female: "Female",
    goal: "Goal",
    fatLoss: "Fat Loss",
    muscleGain: "Muscle Gain",
    activity: "Activity",
    low: "Low",
    moderate: "Moderate",
    high: "High",
    faceTitle: "Face ID",
    faceDesc: "When you press the button, the device will request face authentication directly.",
    enableFace: "Authenticate with Face ID",
    active: "ON",
    off: "OFF",
    pin: "4 Digit PIN",
    free: "Free",
    premium: "Premium",
    price: "249.99 TL / month",
    createPlan: "Create Plan",
    stepGoal: "Daily Step Goal",
    hello: "Hello",
    today: "Great day today, keep going.",
    calories: "Calories",
    protein: "Protein",
    steps: "Steps",
    dailyRecord: "Progress and Daily Log",
    dailyRecordText: "Save weight, body fat, steps, water and notes.",
    add250: "+250 ml Water",
    ask: "Ask something...",
    send: "Send",
    photoAnalysis: "Photo Analysis",
    videoAnalysis: "Video Form Analysis",
    photoText: "Upload a photo and get body fat estimate and advice.",
    videoText: "Upload a video and get form score and technique advice.",
    todayRecord: "Today’s Log",
    bodyFat: "Body fat (%)",
    note: "Note",
    save: "Save",
    noData: "No data yet. Your logs will appear here.",
  },
  de: {
    start: "Loslegen",
    welcome1: "Für dich.",
    welcome2: "Mit dir zusammen.",
    subtitle: "Personalisierte Pläne, smarter Coach und Fortschrittsverfolgung.",
    account: "Konto erstellen",
    personal: "Persönliche Daten",
    security: "Sicherheit",
    plan: "Plan wählen",
    dashboard: "Startseite",
    water: "Wasser",
    coach: "Coach",
    analysis: "Analyse",
    progress: "Fortschritt",
    profile: "Profil",
    continue: "Weiter",
    back: "‹ Zurück",
    uploadPhoto: "Profilfoto hochladen",
    name: "Vollständiger Name",
    email: "E-Mail",
    phone: "Telefonnummer",
    age: "Alter",
    height: "Größe (cm)",
    weight: "Gewicht (kg)",
    gender: "Geschlecht",
    male: "Männlich",
    female: "Weiblich",
    goal: "Ziel",
    fatLoss: "Fettabbau",
    muscleGain: "Muskelaufbau",
    activity: "Aktivität",
    low: "Niedrig",
    moderate: "Mittel",
    high: "Hoch",
    faceTitle: "Face ID",
    faceDesc: "Beim Drücken wird direkt die Gesichtserkennung gestartet.",
    enableFace: "Mit Face ID bestätigen",
    active: "AN",
    off: "AUS",
    pin: "4-stellige PIN",
    free: "Kostenlos",
    premium: "Premium",
    price: "249.99 TL / Monat",
    createPlan: "Plan erstellen",
    stepGoal: "Tägliches Schrittziel",
    hello: "Hallo",
    today: "Heute ist ein guter Tag, weiter so.",
    calories: "Kalorien",
    protein: "Protein",
    steps: "Schritte",
    dailyRecord: "Fortschritt und Tageslog",
    dailyRecordText: "Gewicht, Körperfett, Schritte, Wasser und Notizen speichern.",
    add250: "+250 ml Wasser",
    ask: "Frag etwas...",
    send: "Senden",
    photoAnalysis: "Fotoanalyse",
    videoAnalysis: "Video-Formanalyse",
    photoText: "Foto hochladen und Körperfett-Schätzung erhalten.",
    videoText: "Video hochladen und Form-Score erhalten.",
    todayRecord: "Heutiger Eintrag",
    bodyFat: "Körperfett (%)",
    note: "Notiz",
    save: "Speichern",
    noData: "Noch keine Daten. Einträge erscheinen hier.",
  },
  ru: {
    start: "Начать",
    welcome1: "Для тебя.",
    welcome2: "Вместе с тобой.",
    subtitle: "Персональные планы, умный коучинг и отслеживание прогресса.",
    account: "Создать аккаунт",
    personal: "Личные данные",
    security: "Безопасность",
    plan: "Выбор плана",
    dashboard: "Главная",
    water: "Вода",
    coach: "Коуч",
    analysis: "Анализ",
    progress: "Прогресс",
    profile: "Профиль",
    continue: "Продолжить",
    back: "‹ Назад",
    uploadPhoto: "Загрузить фото профиля",
    name: "Имя и фамилия",
    email: "E-mail",
    phone: "Телефон",
    age: "Возраст",
    height: "Рост (см)",
    weight: "Вес (кг)",
    gender: "Пол",
    male: "Мужчина",
    female: "Женщина",
    goal: "Цель",
    fatLoss: "Снижение жира",
    muscleGain: "Набор мышц",
    activity: "Активность",
    low: "Низкая",
    moderate: "Средняя",
    high: "Высокая",
    faceTitle: "Face ID",
    faceDesc: "При нажатии устройство сразу запросит распознавание лица.",
    enableFace: "Подтвердить Face ID",
    active: "ВКЛ",
    off: "ВЫКЛ",
    pin: "PIN из 4 цифр",
    free: "Free",
    premium: "Premium",
    price: "249.99 TL / месяц",
    createPlan: "Создать план",
    stepGoal: "Цель шагов в день",
    hello: "Привет",
    today: "Отличный день, продолжай.",
    calories: "Калории",
    protein: "Белок",
    steps: "Шаги",
    dailyRecord: "Прогресс и дневной лог",
    dailyRecordText: "Сохраняй вес, жир, шаги, воду и заметки.",
    add250: "+250 мл воды",
    ask: "Спроси что-нибудь...",
    send: "Отправить",
    photoAnalysis: "Фото-анализ",
    videoAnalysis: "Видео-анализ техники",
    photoText: "Загрузи фото и получи оценку процента жира.",
    videoText: "Загрузи видео и получи оценку техники.",
    todayRecord: "Запись за сегодня",
    bodyFat: "Жир (%)",
    note: "Заметка",
    save: "Сохранить",
    noData: "Данных пока нет. Записи появятся здесь.",
  },
};

export default function HomeScreen() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [lang, setLang] = useState<Language>("tr");
  const t = L[lang];

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [analysisPhoto, setAnalysisPhoto] = useState<string | null>(null);
  const [analysisVideo, setAnalysisVideo] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("Fat Loss");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [plan, setPlan] = useState("Free");
  const [stepGoal, setStepGoal] = useState(8000);

  const [faceEnabled, setFaceEnabled] = useState(false);
  const [pin, setPin] = useState("");

  const [dashboard, setDashboard] = useState<any>(null);
  const [waterMl, setWaterMl] = useState(0);

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<any[]>([
    { from: "coach", text: "Merhaba! Beslenme, su, adım, antrenman veya ilerleme hakkında yazabilirsin." },
  ]);

  const [progressWeight, setProgressWeight] = useState("");
  const [progressFat, setProgressFat] = useState("");
  const [progressSteps, setProgressSteps] = useState("");
  const [progressNote, setProgressNote] = useState("");
  const [progressLogs, setProgressLogs] = useState<any[]>([]);

  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const post = async (endpoint: string, body: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.log("Backend error:", endpoint, res.status, errorText);
      throw new Error(errorText || `HTTP ${res.status}`);
    }

    return await res.json();
  };

  const get = async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) {
      const errorText = await res.text();
      console.log("Backend GET error:", endpoint, res.status, errorText);
      throw new Error(errorText || `HTTP ${res.status}`);
    }
    return await res.json();
  };

  const changeLang = async (next: Language) => {
    setLang(next);
    try {
      await post("/language", { language: next });
    } catch {}
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

  const pickAnalysisPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setAnalysisPhoto(result.assets[0].uri);
      const data = await post("/analyze", {
        media_type: "photo",
        plan,
        language: lang,
        note: "photo analysis",
      });
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
      const data = await post("/analyze", {
        media_type: "video",
        plan,
        language: lang,
        note: "video analysis",
      });
      setAnalysisResult(data);
    }
  };

  const authenticateFace = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert("Face ID", "Bu cihazda Face ID / biyometrik doğrulama hazır değil.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t.enableFace,
      fallbackLabel: "",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });

    setFaceEnabled(result.success);
    Alert.alert("Face ID", result.success ? t.active : t.off);
  };

  const createPlan = async () => {
    try {
      const data = await post("/create-plan", {
        name: name || "Athlete",
        email,
        phone,
        age: Number(age || 25),
        gender,
        height: Number(height || 175),
        weight: Number(weight || 80),
        goal,
        activity_level: activityLevel,
        plan,
        step_goal: stepGoal,
      });

      setDashboard(data);
      setWaterMl(0);
      setScreen("theme");
    } catch (error) {
  console.log("Create plan failed:", error);
  Alert.alert("Backend Error", JSON.stringify(error));

    }
  };

  const addWater = async (amount: number) => {
    try {
      const data = await post("/water/add", { amount_ml: amount });
      setWaterMl(data.water_ml);
    } catch {
      setWaterMl((prev) => prev + amount);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setChatInput("");

    try {
      const data = await post("/chat", { message: userMsg, language: lang });
      setMessages((prev) => [...prev, { from: "coach", text: data.reply }]);
    } catch (error) {
      console.log("Chat request failed:", error);
      setMessages((prev) => [...prev, { from: "coach", text: "..." }]);
    }
  };

  const saveProgress = async () => {
    if (!progressWeight || !progressFat) return;

    const newLog = {
      day_label: `${progressLogs.length + 1}. Gün`,
      weight: Number(progressWeight),
      body_fat: Number(progressFat),
      steps: Number(progressSteps || 0),
      water_ml: waterMl,
      note: progressNote,
    };

    try {
      const data = await post("/progress/add", newLog);
      setProgressLogs(data.progress_logs);
    } catch {
      setProgressLogs((prev) => [...prev, newLog]);
    }

    setProgressWeight("");
    setProgressFat("");
    setProgressSteps("");
    setProgressNote("");
  };

  const LangButton = () => (
    <View style={styles.langMiniRow}>
      {(["tr", "en", "de", "ru"] as Language[]).map((x) => (
        <TouchableOpacity key={x} onPress={() => changeLang(x)}>
          <Text style={lang === x ? styles.langMiniActive : styles.langMini}>{x.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const BottomNav = () => (
    <View style={styles.bottomNav}>
      <Nav label={t.dashboard} active={screen === "dashboard"} onPress={() => setScreen("dashboard")} />
      <Nav label={t.water} active={screen === "water"} onPress={() => setScreen("water")} />
      <Nav label={t.coach} active={screen === "coach"} onPress={() => setScreen("coach")} />
      <Nav label={t.analysis} active={screen === "analysis"} onPress={() => setScreen("analysis")} />
      <Nav label={t.profile} active={screen === "profile"} onPress={() => setScreen("profile")} />
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
              {(["tr", "en", "de", "ru"] as Language[]).map((x) => (
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
          <Top title={t.account} step="1 / 4" back={() => setScreen("welcome")} backText={t.back} />

          <TouchableOpacity style={styles.avatar} onPress={pickProfilePhoto}>
            {profilePhoto ? <Image source={{ uri: profilePhoto }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>👤</Text>}
            <View style={styles.cameraBadge}><Text>📷</Text></View>
          </TouchableOpacity>

          <Text style={styles.centerHint}>{t.uploadPhoto}</Text>

          <Input placeholder={t.name} value={name} setValue={setName} />
          <Input placeholder={t.email} value={email} setValue={setEmail} />
          <Input placeholder={t.phone} value={phone} setValue={setPhone} />

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
          <Top title={t.personal} step="2 / 4" back={() => setScreen("account")} backText={t.back} />

          <Input placeholder={t.age} value={age} setValue={setAge} keyboard="numeric" />
          <Input placeholder={t.height} value={height} setValue={setHeight} keyboard="numeric" />
          <Input placeholder={t.weight} value={weight} setValue={setWeight} keyboard="numeric" />

          <Text style={styles.sectionTitle}>{t.gender}</Text>
          <View style={styles.row}>
            <Chip label={t.male} active={gender === "Male"} onPress={() => setGender("Male")} />
            <Chip label={t.female} active={gender === "Female"} onPress={() => setGender("Female")} />
          </View>

          <Text style={styles.sectionTitle}>{t.goal}</Text>
          <View style={styles.row}>
            <Chip label={t.fatLoss} active={goal === "Fat Loss"} onPress={() => setGoal("Fat Loss")} />
            <Chip label={t.muscleGain} active={goal === "Muscle Gain"} onPress={() => setGoal("Muscle Gain")} />
          </View>

          <Text style={styles.sectionTitle}>{t.activity}</Text>
          <View style={styles.row}>
            <Chip label={t.low} active={activityLevel === "low"} onPress={() => setActivityLevel("low")} />
            <Chip label={t.moderate} active={activityLevel === "moderate"} onPress={() => setActivityLevel("moderate")} />
            <Chip label={t.high} active={activityLevel === "high"} onPress={() => setActivityLevel("high")} />
          </View>

          <Text style={styles.sectionTitle}>{t.stepGoal}: {stepGoal}</Text>
          <Slider
            minimumValue={3000}
            maximumValue={20000}
            step={500}
            value={stepGoal}
            onValueChange={setStepGoal}
            minimumTrackTintColor="#2F9BFF"
            maximumTrackTintColor="#202A3A"
            thumbTintColor="#2F9BFF"
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
          <Top title={t.security} step="3 / 4" back={() => setScreen("personal")} backText={t.back} />

          <View style={styles.centerCard}>
            <Text style={styles.faceIcon}>⌾</Text>
            <Text style={styles.cardTitle}>{t.faceTitle}</Text>
            <Text style={styles.cardText}>{t.faceDesc}</Text>
          </View>

          <TouchableOpacity style={styles.optionCard} onPress={authenticateFace}>
            <Text style={styles.optionText}>{t.enableFace}</Text>
            <Text style={faceEnabled ? styles.on : styles.off}>{faceEnabled ? t.active : t.off}</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>{t.pin}</Text>
          <TextInput
            style={styles.input}
            placeholder="PIN"
            placeholderTextColor="#8A92A6"
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
          <Top title={t.plan} step="4 / 4" back={() => setScreen("security")} backText={t.back} />

          <TouchableOpacity style={[styles.planCard, plan === "Free" && styles.activeCard]} onPress={() => setPlan("Free")}>
            <Text style={styles.cardTitle}>{t.free}</Text>
            <Text style={styles.cardText}>3 photo + 1 video / day</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.planCard, plan === "Premium" && styles.premiumCard]} onPress={() => setPlan("Premium")}>
            <Text style={styles.cardTitle}>{t.premium}</Text>
            <Text style={styles.price}>{t.price}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={createPlan}>
            <Text style={styles.primaryText}>{t.createPlan}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  if (screen === "theme") {
  const { theme, themeName, setThemeName } = useAppTheme();

  const themeOptions = [
    { name: "aquaCore", label: "Aqua Core", desc: "Clean blue health-tech look" },
    { name: "sandElite", label: "Sand Elite", desc: "Warm beige premium wellness" },
    { name: "darkFuture", label: "Dark Future", desc: "Futuristic black-orange look" },
    { name: "roseGlow", label: "Rose Glow", desc: "Soft pink premium lifestyle" },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={[styles.header, { color: theme.text }]}>
          Theme Selection
        </Text>

        {themeOptions.map((item) => {
          const isSelected = themeName === item.name;

          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => setThemeName(item.name as ThemeName)}
              style={[
                styles.planCard,
                {
                  backgroundColor: theme.card,
                  borderColor: isSelected ? theme.primary : "transparent",
                  borderWidth: 2,
                },
              ]}
            >
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700" }}>
                {item.label}
              </Text>

              <Text style={{ color: theme.mutedText, marginTop: 4 }}>
                {item.desc}
              </Text>

              <View
                style={{
                  marginTop: 10,
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: theme.primary,
                  width: "60%",
                }}
              />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={() => setScreen("dashboard")}
        >
          <Text style={styles.primaryText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


  if (screen === "dashboard") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <LangButton />
          <Text style={styles.header}>{t.hello}, {dashboard?.name || name || "Athlete"} 👋</Text>
          <Text style={styles.subHeader}>{t.today}</Text>

          <View style={styles.grid}>
            <Stat title={t.calories} value={`${dashboard?.calories || 0} kcal`} />
            <Stat title={t.protein} value={`${dashboard?.protein || 0} g`} />
            <Stat title={t.water} value={`${(waterMl / 1000).toFixed(1)} / ${dashboard?.water_liters || 2.8} L`} />
            <Stat title={t.steps} value={`${stepGoal}`} />
          </View>

          <TouchableOpacity style={styles.actionCard} onPress={() => setScreen("progress")}>
            <Text style={styles.cardTitle}>{t.dailyRecord}</Text>
            <Text style={styles.cardText}>{t.dailyRecordText}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => setScreen("analysis")}>
            <Text style={styles.cardTitle}>{t.photoAnalysis} / {t.videoAnalysis}</Text>
            <Text style={styles.cardText}>{t.photoText}</Text>
          </TouchableOpacity>
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  if (screen === "water") {
    const targetMl = Math.round((dashboard?.water_liters || 2.8) * 1000);
    const percent = Math.min(100, Math.round((waterMl / targetMl) * 100));

    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <LangButton />
          <Top title={t.water} back={() => setScreen("dashboard")} backText={t.back} />

          <View style={styles.waterCircle}>
            <Text style={styles.waterBig}>{(waterMl / 1000).toFixed(1)} L</Text>
            <Text style={styles.cardText}>/ {(targetMl / 1000).toFixed(1)} L</Text>
            <Text style={styles.percent}>{percent}%</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => addWater(250)}>
            <Text style={styles.primaryText}>{t.add250}</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            {[100, 250, 500].map((amount) => (
              <TouchableOpacity key={amount} style={styles.smallButton} onPress={() => addWater(amount)}>
                <Text style={styles.smallButtonText}>+{amount} ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  if (screen === "coach") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <LangButton />
          <Top title={t.coach} back={() => setScreen("dashboard")} backText={t.back} />

          {messages.map((msg, i) => (
            <View key={i} style={msg.from === "user" ? styles.userBubble : styles.coachBubble}>
              <Text style={styles.bubbleText}>{msg.text}</Text>
            </View>
          ))}

          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder={t.ask}
              placeholderTextColor="#8A92A6"
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendChat}>
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
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <LangButton />
          <Top title={t.analysis} back={() => setScreen("dashboard")} backText={t.back} />

          <TouchableOpacity style={styles.planCard} onPress={pickAnalysisPhoto}>
            <Text style={styles.cardTitle}>{t.photoAnalysis}</Text>
            <Text style={styles.cardText}>{t.photoText}</Text>
          </TouchableOpacity>

          {analysisPhoto && (
            <View style={styles.imageWrap}>
              <Image source={{ uri: analysisPhoto }} style={styles.analysisImage} />
              {analysisResult?.effect_label && (
                <View style={styles.effectBadge}>
                  <Text style={styles.effectText}>{analysisResult.effect_label}</Text>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.planCard} onPress={pickAnalysisVideo}>
            <Text style={styles.cardTitle}>{t.videoAnalysis}</Text>
            <Text style={styles.cardText}>{t.videoText}</Text>
          </TouchableOpacity>

          {analysisVideo && <Text style={styles.limitText}>Video selected ✅</Text>}

          {analysisResult?.advice && (
            <View style={styles.actionCard}>
              <Text style={styles.cardTitle}>{t.analysis}</Text>
              <Text style={styles.cardText}>{analysisResult.advice}</Text>
            </View>
          )}
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  if (screen === "progress") {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.pageWithNav}>
          <LangButton />
          <Top title={t.progress} back={() => setScreen("dashboard")} backText={t.back} />

          <View style={styles.planCard}>
            <Text style={styles.cardTitle}>{t.todayRecord}</Text>
            <Input placeholder={t.weight} value={progressWeight} setValue={setProgressWeight} keyboard="numeric" />
            <Input placeholder={t.bodyFat} value={progressFat} setValue={setProgressFat} keyboard="numeric" />
            <Input placeholder={t.steps} value={progressSteps} setValue={setProgressSteps} keyboard="numeric" />
            <Input placeholder={t.note} value={progressNote} setValue={setProgressNote} />
            <TouchableOpacity style={styles.primaryButton} onPress={saveProgress}>
              <Text style={styles.primaryText}>{t.save}</Text>
            </TouchableOpacity>
          </View>

          {progressLogs.length === 0 ? (
            <Text style={styles.cardText}>{t.noData}</Text>
          ) : (
            progressLogs.map((log, i) => (
              <View key={i} style={styles.chartCard}>
                <Text style={styles.cardTitle}>{log.day_label}</Text>
                <Text style={styles.chartLine}>{t.weight}: {log.weight} kg</Text>
                <Text style={styles.chartLine}>{t.bodyFat}: %{log.body_fat}</Text>
                <Text style={styles.chartLine}>{t.steps}: {log.steps}</Text>
                <Text style={styles.chartLine}>{t.water}: {log.water_ml} ml</Text>
                {!!log.note && <Text style={styles.cardText}>{log.note}</Text>}
              </View>
            ))
          )}
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.pageWithNav}>
        <LangButton />
        <Top title={t.profile} back={() => setScreen("dashboard")} backText={t.back} />

        <View style={styles.centerCard}>
          {profilePhoto ? <Image source={{ uri: profilePhoto }} style={styles.avatarImageLarge} /> : <Text style={styles.avatarText}>👤</Text>}
          <Text style={styles.cardTitle}>{name || "Athlete"}</Text>
          <Text style={styles.cardText}>{email || "No email"}</Text>
          <Text style={styles.price}>{plan}</Text>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

function Top({ title, step, back, backText }: any) {
  return (
    <View>
      <TouchableOpacity onPress={back}>
        <Text style={styles.back}>{backText}</Text>
      </TouchableOpacity>
      <Text style={styles.headerCenter}>{title}</Text>
      {step && <Text style={styles.step}>{step}</Text>}
    </View>
  );
}

function Input({ placeholder, value, setValue, keyboard = "default" }: any) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#8A92A6"
      value={value}
      onChangeText={setValue}
      keyboardType={keyboard}
    />
  );
}

function Chip({ label, active, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={active ? styles.chipActiveText : styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Stat({ title, value }: any) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function Nav({ label, active, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={active ? styles.navActive : styles.navText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#05070A" },
  page: { padding: 24, paddingBottom: 40 },
  pageWithNav: { padding: 24, paddingBottom: 130 },

  heroCard: {
    flex: 1,
    backgroundColor: "#07101B",
    margin: 18,
    padding: 26,
    borderRadius: 28,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#162131",
  },

  logoBlue: { color: "#2F9BFF", fontSize: 56, fontWeight: "900" },
  logo: { color: "#FFFFFF", fontSize: 42, fontWeight: "900" },
  heroTitle: { color: "#FFFFFF", fontSize: 34, fontWeight: "900", marginBottom: 6 },
  heroSub: { color: "#9EA7B8", fontSize: 17, lineHeight: 26, marginTop: 16 },

  langRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  langChip: { backgroundColor: "#121826", padding: 12, borderRadius: 14 },
  langActive: { borderWidth: 1, borderColor: "#2F9BFF" },
  langText: { color: "#FFFFFF", fontWeight: "900" },

  langMiniRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginBottom: 8 },
  langMini: { color: "#8A92A6", fontWeight: "800" },
  langMiniActive: { color: "#2F9BFF", fontWeight: "900" },

  header: { color: "#FFFFFF", fontSize: 30, fontWeight: "900" },
  headerCenter: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", textAlign: "center", marginBottom: 20 },
  subHeader: { color: "#9EA7B8", fontSize: 16, marginTop: 6, marginBottom: 24 },
  back: { color: "#2F9BFF", fontSize: 18, marginBottom: 12 },
  step: { color: "#2F9BFF", textAlign: "center", marginBottom: 20, fontSize: 20 },

  input: {
    backgroundColor: "#121826",
    color: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#202A3A",
    fontSize: 16,
  },

  primaryButton: {
    backgroundColor: "#2F9BFF",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 18,
  },
  primaryText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },

  avatar: {
    alignSelf: "center",
    width: 130,
    height: 130,
    backgroundColor: "#121826",
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#202A3A",
  },
  avatarImage: { width: 130, height: 130, borderRadius: 65 },
  avatarImageLarge: { width: 140, height: 140, borderRadius: 70, marginBottom: 18 },
  avatarText: { fontSize: 46, color: "#FFFFFF" },
  cameraBadge: { position: "absolute", right: 0, bottom: 8, backgroundColor: "#2F9BFF", padding: 10, borderRadius: 20 },
  centerHint: { color: "#9EA7B8", textAlign: "center", marginBottom: 20 },

  sectionTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginTop: 20, marginBottom: 12 },
  row: { flexDirection: "row", gap: 10, marginBottom: 10, flexWrap: "wrap" },

  chip: {
    backgroundColor: "#121826",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#202A3A",
  },
  chipActive: { borderColor: "#2F9BFF", backgroundColor: "#0B2744" },
  chipText: { color: "#9EA7B8", fontWeight: "700" },
  chipActiveText: { color: "#FFFFFF", fontWeight: "900" },

  centerCard: {
    backgroundColor: "#121826",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#202A3A",
  },

  faceIcon: { color: "#2F9BFF", fontSize: 52, marginBottom: 10 },
  optionCard: {
    backgroundColor: "#121826",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#202A3A",
  },
  optionText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  on: { color: "#2F9BFF", fontWeight: "900" },
  off: { color: "#8A92A6", fontWeight: "900" },

  planCard: {
    backgroundColor: "#121826",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#202A3A",
  },
  activeCard: { borderColor: "#2F9BFF" },
  premiumCard: { borderColor: "#FFD166", backgroundColor: "#171A20" },
  cardTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "900", marginBottom: 8 },
  price: { color: "#FFD166", fontSize: 18, fontWeight: "900", marginBottom: 8 },
  cardText: { color: "#9EA7B8", fontSize: 16, lineHeight: 24 },
  limitText: { color: "#2F9BFF", fontWeight: "800", marginTop: 10 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    width: "48%",
    backgroundColor: "#121826",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#202A3A",
  },
  statTitle: { color: "#9EA7B8", fontSize: 14 },
  statValue: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginTop: 8 },

  actionCard: {
    backgroundColor: "#121826",
    borderRadius: 22,
    padding: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#202A3A",
  },

  waterCircle: {
    height: 260,
    borderRadius: 130,
    borderWidth: 14,
    borderColor: "#2F9BFF",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  waterBig: { color: "#FFFFFF", fontSize: 46, fontWeight: "900" },
  percent: { color: "#2F9BFF", fontSize: 22, fontWeight: "900", marginTop: 8 },
  smallButton: { flex: 1, backgroundColor: "#121826", padding: 16, borderRadius: 16, alignItems: "center" },
  smallButtonText: { color: "#FFFFFF", fontWeight: "900" },

  coachBubble: {
    backgroundColor: "#121826",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    alignSelf: "flex-start",
    maxWidth: "82%",
  },
  userBubble: {
    backgroundColor: "#1E62B8",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    alignSelf: "flex-end",
    maxWidth: "82%",
  },
  bubbleText: { color: "#FFFFFF", fontSize: 16, lineHeight: 23 },
  chatInputRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  chatInput: { flex: 1, backgroundColor: "#121826", color: "#FFFFFF", padding: 16, borderRadius: 18 },
  sendButton: { backgroundColor: "#2F9BFF", width: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  chartCard: {
    backgroundColor: "#121826",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#202A3A",
  },
  chartLine: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", marginTop: 8 },

  imageWrap: { marginBottom: 18 },
  analysisImage: { width: "100%", height: 320, borderRadius: 24 },
  effectBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(47,155,255,0.92)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  effectText: { color: "#FFFFFF", fontWeight: "900" },

  bottomNav: {
    position: "absolute",
    bottom: 56,
    left: 0,
    right: 0,
    backgroundColor: "#0B0F16",
    borderTopWidth: 1,
    borderTopColor: "#202A3A",
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navText: { color: "#8A92A6", fontWeight: "800" },
  navActive: { color: "#2F9BFF", fontWeight: "900" },
});