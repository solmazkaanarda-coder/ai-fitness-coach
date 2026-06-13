from services.memory import memory

_PHOTO_ADVICE = {
    "tr": "Demo analiz: Fotoğraf üzerinden tahmini vücut yağ oranı ve genel kompozisyon takip edildi. Gerçek AI vision modelinde poz, ışık, açı ve zaman içindeki gelişim karşılaştırılacak.",
    "en": "Demo analysis: Estimated body fat and general body composition were tracked. A real AI vision model will later compare pose, lighting, angle and long-term progress.",
    "de": "Demo-Analyse: Geschätzter Körperfettanteil und allgemeine Körperkomposition wurden verfolgt. Ein echtes AI-Vision-Modell wird später Pose, Licht, Winkel und Fortschritt vergleichen.",
    "ru": "Демо-анализ: оценён примерный процент жира и общая композиция тела. Реальная AI-модель позже будет сравнивать позу, свет, угол и прогресс во времени.",
}

_VIDEO_ADVICE = {
    "tr": "Demo video analiz: Form skoru iyi. Tempo daha kontrollü olabilir. Bel, diz ve omuz pozisyonu takip edilmeli.",
    "en": "Demo video analysis: Form score is good. Tempo could be more controlled. Lower back, knees and shoulders should be tracked.",
    "de": "Demo-Videoanalyse: Die Form ist gut. Das Tempo könnte kontrollierter sein. Rücken, Knie und Schultern sollten beobachtet werden.",
    "ru": "Демо видео-анализ: техника хорошая. Темп можно сделать более контролируемым. Нужно следить за спиной, коленями и плечами.",
}


def analyze(media_type: str, plan: str, language: str) -> dict:
    is_premium = plan == "Premium"

    if media_type == "photo":
        if not is_premium and memory["photo_count"] >= 3:
            return {"allowed": False, "message": "Free plan photo limit reached."}

        memory["photo_count"] += 1

        profile = memory.get("profile", {})
        weight = profile.get("weight", 80)
        height = profile.get("height", 175)
        bmi = weight / ((height / 100) ** 2)
        body_fat = round(max(8, min(35, 12 + (bmi - 22) * 1.4)), 1)

        result = {
            "allowed": True,
            "media_type": "photo",
            "estimated_body_fat": body_fat,
            "effect_label": f"Body fat estimate: {body_fat}%",
            "advice": _PHOTO_ADVICE.get(language, _PHOTO_ADVICE["tr"]),
        }
        memory["photo_analysis"].append(result)
        return result

    if media_type == "video":
        if not is_premium and memory["video_count"] >= 1:
            return {"allowed": False, "message": "Free plan video limit reached."}

        memory["video_count"] += 1

        result = {
            "allowed": True,
            "media_type": "video",
            "form_score": 78,
            "effect_label": "Form score: 78/100",
            "advice": _VIDEO_ADVICE.get(language, _VIDEO_ADVICE["tr"]),
        }
        memory["video_analysis"].append(result)
        return result

    return {"allowed": False, "message": "Unknown media type"}
