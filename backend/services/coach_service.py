from datetime import datetime

from services.memory import memory


def _reply_tr(msg: str) -> str:
    if "protein" in msg:
        return "Protein hedefin için her öğünde kaliteli protein ekle. Tavuk, yumurta, yoğurt, balık ve kırmızı et iyi seçenekler. Hedefin genelde kilo başına 1.6–2.2 g arası olabilir."
    if "su" in msg:
        return "Su hedefini gün içine böl. 250 ml veya 300 ml gibi küçük porsiyonlarla takip etmek daha sürdürülebilir olur."
    if "kalori" in msg:
        return "Kalori hedefin kilo, boy, yaş, aktivite ve hedefine göre hesaplanıyor. Yağ kaybında agresif ama sürdürülebilir açık daha mantıklı."
    if "antrenman" in msg or "spor" in msg:
        return "Antrenmanda form, tempo, uyku ve toparlanma önemli. Hedefine göre haftalık programı birlikte düzenleyebiliriz."
    return "Seni takip ediyorum. Beslenme, antrenman, su, adım veya ilerleme hakkında yazarsan daha net koçluk yapabilirim."


def _reply_en(msg: str) -> str:
    if "protein" in msg:
        return "For your protein goal, add high-quality protein to each meal. Chicken, eggs, yogurt, fish and lean meat are good options."
    if "water" in msg:
        return "Split your water goal across the day. Small 250 ml or 300 ml portions make tracking easier."
    if "calorie" in msg:
        return "Your calorie target is based on weight, height, age, activity and goal. For fat loss, a sustainable deficit is smarter."
    if "workout" in msg or "training" in msg:
        return "Focus on form, tempo, recovery and consistency. We can adjust your weekly plan based on your goal."
    return "I am tracking you. Ask me about nutrition, training, water, steps or progress for more specific coaching."


def _reply_de(msg: str) -> str:
    if "protein" in msg:
        return "Für dein Proteinziel solltest du zu jeder Mahlzeit hochwertige Proteinquellen hinzufügen: Eier, Joghurt, Fisch, Hähnchen oder mageres Fleisch."
    if "wasser" in msg:
        return "Teile dein Wasserziel über den Tag auf. Kleine Portionen wie 250 ml oder 300 ml sind leichter zu verfolgen."
    if "kalorie" in msg:
        return "Dein Kalorienziel basiert auf Gewicht, Größe, Alter, Aktivität und Ziel. Für Fettverlust ist ein nachhaltiges Defizit sinnvoll."
    if "training" in msg:
        return "Achte auf Technik, Tempo, Erholung und Regelmäßigkeit. Wir können deinen Wochenplan an dein Ziel anpassen."
    return "Ich begleite dich. Frag mich zu Ernährung, Training, Wasser, Schritten oder Fortschritt."


def _reply_ru(msg: str) -> str:
    if "белок" in msg or "protein" in msg:
        return "Для цели по белку добавляй качественный белок в каждый прием пищи: яйца, йогурт, рыбу, курицу или нежирное мясо."
    if "вода" in msg or "water" in msg:
        return "Раздели норму воды на весь день. Порции по 250 или 300 мл удобнее отслеживать."
    if "калории" in msg or "calorie" in msg:
        return "Цель по калориям зависит от веса, роста, возраста, активности и цели. Для жиросжигания лучше устойчивый дефицит."
    if "тренировка" in msg or "workout" in msg:
        return "Следи за техникой, темпом, восстановлением и регулярностью. Мы можем настроить недельный план под твою цель."
    return "Я отслеживаю твой прогресс. Напиши про питание, тренировки, воду, шаги или прогресс — отвечу точнее."


_REPLY_DISPATCH = {
    "en": _reply_en,
    "de": _reply_de,
    "ru": _reply_ru,
}


def chat(message: str, language: str) -> dict:
    msg = message.lower()
    reply_fn = _REPLY_DISPATCH.get(language, _reply_tr)
    reply = reply_fn(msg)

    memory["chat"].append({
        "user": message,
        "coach": reply,
        "language": language,
        "time": datetime.now().isoformat(),
    })

    return {
        "reply": reply,
        "memory_count": len(memory["chat"]),
        "chat_memory": memory["chat"][-10:],
    }
