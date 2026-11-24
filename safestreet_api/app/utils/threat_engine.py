
from typing import Any


WEAPON_LABELS = {
    "knife",
    "pistol",
    "gun",
    "rifle",
    "shotgun",
    "weapon",
    "handgun",
    "dagger",
    "sword",
}

PERSON_LABELS = {"person"}


def assess_visual_threat(detections: list[dict[str, Any]]) -> dict[str, Any]:
    """Assess threat using object-detection results."""

    weapons = []
    persons = []

    for detection in detections:
        label = str(detection.get("label", "")).strip().lower()

        try:
            confidence = float(detection.get("confidence", 0))
        except (TypeError, ValueError):
            continue

        if not 0 <= confidence <= 1:
            continue

        item = {
            "label": label,
            "confidence": confidence
        }

        if label in WEAPON_LABELS:
            weapons.append(item)
        elif label in PERSON_LABELS:
            persons.append(item)

    weapon_count = len(weapons)
    person_count = len(persons)

    if weapon_count >= 2:
        raw_risk = "CRITICAL"
        recommendation = (
            "Multiple weapons detected. Immediate emergency response recommended."
        )
    elif weapon_count == 1:
        raw_risk = "HIGH"
        recommendation = (
            "A possible weapon was detected. Immediate attention recommended. "
            "Verify the detection and follow the appropriate safety procedure."
        )
    elif person_count > 0:
        raw_risk = "LOW"
        recommendation = (
            "Person detected with no recognized weapon. Continue routine monitoring."
        )
    else:
        raw_risk = "SAFE"
        recommendation = "No recognized weapons or people detected in this frame."

    risk_mapping = {
        "SAFE": "low",
        "LOW": "low",
        "HIGH": "high",
        "CRITICAL": "critical",
    }

    if weapons:
        top_detection = max(weapons, key=lambda item: item["confidence"])
        display_label = top_detection["label"].title()
        confidence = round(top_detection["confidence"] * 100, 2)
    elif persons:
        display_label = "Person"
        confidence = round(
            sum(item["confidence"] for item in persons) / len(persons) * 100,
            2
        )
    else:
        display_label = "Safe"
        confidence = 0.0

    if weapons and persons:
        reasoning = (
            f"Detected {weapon_count} weapon(s) and "
            f"{person_count} person(s)."
        )
    elif weapons:
        reasoning = f"Detected {weapon_count} weapon(s) and no people."
    elif persons:
        reasoning = f"Detected {person_count} person(s) and no recognized weapons."
    else:
        reasoning = "No recognized weapons or people were detected."

    return {
        "label": display_label,
        "confidence": confidence,
        "riskLevel": risk_mapping[raw_risk],
        "rawRiskLevel": raw_risk,
        "recommendation": recommendation,
        "reasoning": reasoning,
        "weaponsDetected": weapon_count,
        "personsDetected": person_count,
    }
