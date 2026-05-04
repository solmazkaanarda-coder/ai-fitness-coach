from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

memory = {
    "language": "tr",
    "plan": "Free",
    "profile": {},
    "dashboard": {},
    "water_ml": 0,
    "water_logs": [],
    "step_goal": 8000,
    "progress_logs": [],
    "chat": [],
    "photo_count": 0,
    "video_count": 0,
    "photo_analysis": [],
    "video_analysis": [],
}

class LanguageUpdate(BaseModel):
    language: str

class Profile(BaseModel):
    name: str
    email: str = ""
    phone: str = ""
    age: int
    gender: str
    height: float
    weight: float
    goal: str
    activity_level: str = "moderate"
    plan: str
    step_goal: int = 8000

class WaterAdd(BaseModel):
    amount_ml: int

class StepGoalUpdate(BaseModel):
    step_goal: int

class ChatMessage(BaseModel):
    message: str
    language: str = "tr"

class ProgressLog(BaseModel):
    day_label: str
    weight: float
    body_fat: float
    steps: int = 0
    water_ml: int = 0
    note: str = ""

class AnalysisRequest(BaseModel):
    media_type: str
    plan: str
    language: str = "tr"
    note: str = ""

@app.get("/")
def home():
    return {
        "message": "AI Fitness Coach Backend Running",
        "status": "ok",
        "language": memory["language"]
    }

@app.post("/language")
def update_language(data: LanguageUpdate):
    allowed = ["tr", "en", "de", "ru"]
    memory["language"] = data.language if data.language in allowed else "tr"
    return {"language": memory["language"]}

@app.post("/create-plan")
def create_plan(profile: Profile):
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5

    multiplier = {
        "low": 1.3,
        "moderate": 1.55,
        "high": 1.75,
    }.get(profile.activity_level, 1.55)

    calories = round(bmr * multiplier)

    if profile.goal == "Fat Loss":
        calories -= 400
    elif profile.goal == "Muscle Gain":
        calories += 300

    protein = round(profile.weight * 2)
    water_liters = round(profile.weight * 0.035, 1)

    memory["profile"] = profile.dict()
    memory["plan"] = profile.plan
    memory["step_goal"] = profile.step_goal
    memory["water_ml"] = 0
    memory["water_logs"] = []
    memory["progress_logs"] = []

    memory["dashboard"] = {
        "name": profile.name,
        "goal": profile.goal,
        "plan": profile.plan,
        "calories": calories,
        "protein": protein,
        "water_liters": water_liters,
        "step_goal": profile.step_goal,
        "premium_price": "249.99 TL"
    }

    return memory["dashboard"]

@app.get("/dashboard")
def dashboard():
    return {
        "profile": memory["profile"],
        "dashboard": memory["dashboard"],
        "water_ml": memory["water_ml"],
        "water_logs": memory["water_logs"],
        "step_goal": memory["step_goal"],
        "progress_logs": memory["progress_logs"],
        "photo_count": memory["photo_count"],
        "video_count": memory["video_count"],
        "language": memory["language"]
    }

@app.post("/water/add")
def add_water(data: WaterAdd):
    memory["water_ml"] += data.amount_ml
    memory["water_logs"].append({
        "amount_ml": data.amount_ml,
        "total_ml": memory["water_ml"],
        "time": datetime.now().isoformat()
    })

    return {
        "water_ml": memory["water_ml"],
        "added": data.amount_ml,
        "message": f"{data.amount_ml} ml added"
    }

@app.post("/steps/goal")
def update_step_goal(data: StepGoalUpdate):
    memory["step_goal"] = data.step_goal
    memory["dashboard"]["step_goal"] = data.step_goal
    return {
        "step_goal": memory["step_goal"],
        "message": "Step goal updated"
    }

@app.post("/progress/add")
def add_progress(data: ProgressLog):
    log = data.dict()
    log["created_at"] = datetime.now().isoformat()
    memory["progress_logs"].append(log)

    return {
        "message": "Progress saved",
        "progress_logs": memory["progress_logs"]
    }

@app.get("/progress")
def get_progress():
    return {"progress_logs": memory["progress_logs"]}

def coach_reply_tr(msg: str):
    if "protein" in msg:
        return "Protein hedefin için her öğünde kaliteli protein ekle. Tavuk, yumurta, yoğurt, balık ve kırmızı et iyi seçenekler. Hedefin genelde kilo başına 1.6–2.2 g arası olabilir."
    if "su" in msg:
        return "Su hedefini gün içine böl. 250 ml veya 300 ml gibi küçük porsiyonlarla takip etmek daha sürdürülebilir olur."
    if "kalori" in msg:
        return "Kalori hedefin kilo, boy, yaş, aktivite ve hedefine göre hesaplanıyor. Yağ kaybında agresif ama sürdürülebilir açık daha mantıklı."
    if "antrenman" in msg or "spor" in msg:
        return "Antrenmanda form, tempo, uyku ve toparlanma önemli. Hedefine göre haftalık programı birlikte düzenleyebiliriz."
    return "Seni takip ediyorum. Beslenme, antrenman, su, adım veya ilerleme hakkında yazarsan daha net koçluk yapabilirim."

def coach_reply_en(msg: str):
    if "protein" in msg:
        return "For your protein goal, add high-quality protein to each meal. Chicken, eggs, yogurt, fish and lean meat are good options."
    if "water" in msg:
        return "Split your water goal across the day. Small 250 ml or 300 ml portions make tracking easier."
    if "calorie" in msg:
        return "Your calorie target is based on weight, height, age, activity and goal. For fat loss, a sustainable deficit is smarter."
    if "workout" in msg or "training" in msg:
        return "Focus on form, tempo, recovery and consistency. We can adjust your weekly plan based on your goal."
    return "I am tracking you. Ask me about nutrition, training, water, steps or progress for more specific coaching."

def coach_reply_de(msg: str):
    if "protein" in msg:
        return "Für dein Proteinziel solltest du zu jeder Mahlzeit hochwertige Proteinquellen hinzufügen: Eier, Joghurt, Fisch, Hähnchen oder mageres Fleisch."
    if "wasser" in msg:
        return "Teile dein Wasserziel über den Tag auf. Kleine Portionen wie 250 ml oder 300 ml sind leichter zu verfolgen."
    if "kalorie" in msg:
        return "Dein Kalorienziel basiert auf Gewicht, Größe, Alter, Aktivität und Ziel. Für Fettverlust ist ein nachhaltiges Defizit sinnvoll."
    if "training" in msg:
        return "Achte auf Technik, Tempo, Erholung und Regelmäßigkeit. Wir können deinen Wochenplan an dein Ziel anpassen."
    return "Ich begleite dich. Frag mich zu Ernährung, Training, Wasser, Schritten oder Fortschritt."

def coach_reply_ru(msg: str):
    if "белок" in msg or "protein" in msg:
        return "Для цели по белку добавляй качественный белок в каждый прием пищи: яйца, йогурт, рыбу, курицу или нежирное мясо."
    if "вода" in msg or "water" in msg:
        return "Раздели норму воды на весь день. Порции по 250 или 300 мл удобнее отслеживать."
    if "калории" in msg or "calorie" in msg:
        return "Цель по калориям зависит от веса, роста, возраста, активности и цели. Для жиросжигания лучше устойчивый дефицит."
    if "тренировка" in msg or "workout" in msg:
        return "Следи за техникой, темпом, восстановлением и регулярностью. Мы можем настроить недельный план под твою цель."
    return "Я отслеживаю твой прогресс. Напиши про питание, тренировки, воду, шаги или прогресс — отвечу точнее."

@app.post("/chat")
def chat(data: ChatMessage):
    msg = data.message.lower()
    lang = data.language

    if lang == "en":
        reply = coach_reply_en(msg)
    elif lang == "de":
        reply = coach_reply_de(msg)
    elif lang == "ru":
        reply = coach_reply_ru(msg)
    else:
        reply = coach_reply_tr(msg)

    memory["chat"].append({
        "user": data.message,
        "coach": reply,
        "language": lang,
        "time": datetime.now().isoformat()
    })

    return {
        "reply": reply,
        "memory_count": len(memory["chat"]),
        "chat_memory": memory["chat"][-10:]
    }

@app.post("/analyze")
def analyze(data: AnalysisRequest):
    is_premium = data.plan == "Premium"
    lang = data.language

    if data.media_type == "photo":
        if not is_premium and memory["photo_count"] >= 3:
            return {"allowed": False, "message": "Free plan photo limit reached."}

        memory["photo_count"] += 1

        profile = memory.get("profile", {})
        weight = profile.get("weight", 80)
        height = profile.get("height", 175)

        bmi = weight / ((height / 100) ** 2)
        body_fat = round(max(8, min(35, 12 + (bmi - 22) * 1.4)), 1)

        advice_by_lang = {
            "tr": "Demo analiz: Fotoğraf üzerinden tahmini vücut yağ oranı ve genel kompozisyon takip edildi. Gerçek AI vision modelinde poz, ışık, açı ve zaman içindeki gelişim karşılaştırılacak.",
            "en": "Demo analysis: Estimated body fat and general body composition were tracked. A real AI vision model will later compare pose, lighting, angle and long-term progress.",
            "de": "Demo-Analyse: Geschätzter Körperfettanteil und allgemeine Körperkomposition wurden verfolgt. Ein echtes AI-Vision-Modell wird später Pose, Licht, Winkel und Fortschritt vergleichen.",
            "ru": "Демо-анализ: оценен примерный процент жира и общая композиция тела. Реальная AI-модель позже будет сравнивать позу, свет, угол и прогресс во времени."
        }

        result = {
            "allowed": True,
            "media_type": "photo",
            "estimated_body_fat": body_fat,
            "effect_label": f"Body fat estimate: {body_fat}%",
            "advice": advice_by_lang.get(lang, advice_by_lang["tr"])
        }

        memory["photo_analysis"].append(result)
        return result

    if data.media_type == "video":
        if not is_premium and memory["video_count"] >= 1:
            return {"allowed": False, "message": "Free plan video limit reached."}

        memory["video_count"] += 1

        advice_by_lang = {
            "tr": "Demo video analiz: Form skoru iyi. Tempo daha kontrollü olabilir. Bel, diz ve omuz pozisyonu takip edilmeli.",
            "en": "Demo video analysis: Form score is good. Tempo could be more controlled. Lower back, knees and shoulders should be tracked.",
            "de": "Demo-Videoanalyse: Die Form ist gut. Das Tempo könnte kontrollierter sein. Rücken, Knie und Schultern sollten beobachtet werden.",
            "ru": "Демо видео-анализ: техника хорошая. Темп можно сделать более контролируемым. Нужно следить за спиной, коленями и плечами."
        }

        result = {
            "allowed": True,
            "media_type": "video",
            "form_score": 78,
            "effect_label": "Form score: 78/100",
            "advice": advice_by_lang.get(lang, advice_by_lang["tr"])
        }

        memory["video_analysis"].append(result)
        return result

    return {"allowed": False, "message": "Unsupported media type"}