import re


KEYWORD_RULES = {
    "attack": {
        "riskLevel": "critical",
        "rawRiskLevel": "CRITICAL",
        "priority": 4,
    },
    "help": {
        "riskLevel": "high",
        "rawRiskLevel": "HIGH",
        "priority": 3,
    },
    "danger": {
        "riskLevel": "high",
        "rawRiskLevel": "HIGH",
        "priority": 3,
    },
    "knife": {
        "riskLevel": "moderate",
        "rawRiskLevel": "MEDIUM",
        "priority": 2,
    },
}


def assess_audio_threat(transcript: str) -> dict:
    """Assess an audio transcript using exact emergency keyword matches."""

    text = transcript.strip()
    matched = [
        word
        for word in KEYWORD_RULES
        if re.search(rf"\b{re.escape(word)}\b", text, re.IGNORECASE)
    ]

    if not matched:
        return {
            "label": "No emergency keyword detected",
            "confidence": 0.0,
            "riskLevel": "low",
            "rawRiskLevel": "SAFE",
            "transcript": text,
            "matchedKeywords": [],
            "reasoning": "No configured emergency keywords were found.",
            "recommendation": "Continue monitoring.",
        }

    highest = max(
        matched,
        key=lambda word: KEYWORD_RULES[word]["priority"],
    )
    rule = KEYWORD_RULES[highest]

    return {
        "label": f"Emergency keyword: {highest}",
        "confidence": 100.0,
        "riskLevel": rule["riskLevel"],
        "rawRiskLevel": rule["rawRiskLevel"],
        "transcript": text,
        "matchedKeywords": matched,
        "reasoning": (
            "Rule-based keyword match. This is not a speech-recognition "
            "confidence score and requires human verification."
        ),
        "recommendation": "Verify the situation and follow the emergency response procedure.",
    }
