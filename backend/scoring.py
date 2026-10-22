"""Lead scoring business logic for DataForge Estates."""

import re
from typing import Dict, Any, Tuple


def is_valid_phone(phone: str) -> bool:
    """Validates phone number allowing international formats and separators."""
    if not phone or not isinstance(phone, str):
        return False
    digits = re.sub(r"\D", "", phone)
    return 7 <= len(digits) <= 15


def is_valid_budget(min_budget: Any, max_budget: Any) -> bool:
    """Validates that budget bounds are valid numbers and max >= min."""
    try:
        min_val = float(min_budget)
        max_val = float(max_budget)
        return min_val >= 0 and max_val > 0 and max_val >= min_val
    except (TypeError, ValueError):
        return False


def calculate_lead_score(lead_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculates deterministic score and tier for a lead submission.

    Rules:
    - Timeline: immediately (+3), 1-3_months (+2), 3-6_months (+1), exploring (+0)
    - Budget: valid min & max provided (+2)
    - Area: specific area selected (+1)
    - Phone: valid phone format provided (+2)
    - Viewing: viewing booked (+3) [reserved for future booking flow]

    Classification:
    - Hot: score >= 8
    - Warm: 4 <= score <= 7
    - Cold: score 0 to 3
    """
    timeline = lead_data.get("timeline")
    timeline_points = 0
    if timeline == "immediately":
        timeline_points = 3
    elif timeline in ("1-3_months", "1-3 months"):
        timeline_points = 2
    elif timeline in ("3-6_months", "3-6 months"):
        timeline_points = 1

    budget_min = lead_data.get("budgetMin", lead_data.get("budget_min"))
    budget_max = lead_data.get("budgetMax", lead_data.get("budget_max"))
    budget_points = 2 if is_valid_budget(budget_min, budget_max) else 0

    areas = lead_data.get("areas", [])
    area_points = 0
    if isinstance(areas, list) and len(areas) > 0:
        if any(isinstance(a, str) and a.strip() and a.lower() != "all" for a in areas):
            area_points = 1
    elif isinstance(areas, str) and areas.strip() and areas.lower() != "all":
        area_points = 1

    phone = lead_data.get("phone", "")
    phone_points = 2 if is_valid_phone(phone) else 0

    viewing_booked = bool(lead_data.get("viewingBooked", lead_data.get("viewing_booked", False)))
    viewing_points = 3 if viewing_booked else 0

    total_score = timeline_points + budget_points + area_points + phone_points + viewing_points

    if total_score >= 8:
        tier = "hot"
    elif total_score >= 4:
        tier = "warm"
    else:
        tier = "cold"

    return {
        "timeline_points": timeline_points,
        "budget_points": budget_points,
        "area_points": area_points,
        "phone_points": phone_points,
        "viewing_points": viewing_points,
        "total_score": total_score,
        "tier": tier,
    }
