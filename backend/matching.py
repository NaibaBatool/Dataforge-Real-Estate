"""Deterministic Property Matching Engine for DataForge Estates."""

from typing import List, Dict, Any, Tuple


def evaluate_property_match(property_item: Dict[str, Any], criteria: Dict[str, Any]) -> Dict[str, Any]:
    """Evaluates a single property against client criteria."""
    explanations = []
    discrepancies = []
    points = 0

    target_purpose = criteria.get("purpose")
    target_type = criteria.get("propertyType", criteria.get("property_type"))
    target_areas = criteria.get("areas", [])
    target_min = float(criteria.get("budgetMin", criteria.get("budget_min", 0)))
    target_max = float(criteria.get("budgetMax", criteria.get("budget_max", 10000000)))

    prop_purpose = property_item.get("purpose")
    prop_type = property_item.get("type")
    prop_area = property_item.get("area", "")
    prop_price = float(property_item.get("price", 0))

    # 1. Purpose check
    if target_purpose == "buy":
        if prop_purpose == "buy":
            points += 30
            explanations.append("Available for purchase")
        else:
            discrepancies.append("Listed for rent instead of purchase")
    elif target_purpose == "rent":
        if prop_purpose == "rent":
            points += 30
            explanations.append("Available for rent")
        else:
            discrepancies.append("Listed for sale instead of rent")
    elif target_purpose == "invest":
        points += 25
        explanations.append("Strong rental or appreciation potential")

    # 2. Type check
    if prop_type == target_type:
        points += 30
        explanations.append(f"Matches requested property type ({prop_type.capitalize()})")
    else:
        discrepancies.append(f"Different property type ({prop_type})")

    # 3. Area check
    if target_areas and "all" not in [a.lower() for a in target_areas]:
        if any(a.lower().strip() == prop_area.lower().strip() for a in target_areas):
            points += 25
            explanations.append(f"Located in preferred area ({prop_area})")
        else:
            discrepancies.append(f"Located in {prop_area}")
    else:
        points += 20
        explanations.append(f"Located in {prop_area}")

    # 4. Budget check
    if target_min <= prop_price <= target_max:
        points += 15
        explanations.append(f"Comfortably within budget (${int(prop_price):,})")
    elif prop_price < target_min:
        points += 8
        explanations.append(f"Below your min budget (${int(prop_price):,})")
    elif prop_price <= target_max * 1.15:
        points += 5
        discrepancies.append(f"Slightly above preferred budget (${int(prop_price):,})")
    else:
        discrepancies.append(f"Above target budget range (${int(prop_price):,})")

    is_exact = len(discrepancies) == 0

    return {
        "property": property_item,
        "is_exact_match": is_exact,
        "match_score": min(100, points),
        "explanations": explanations,
        "discrepancies": discrepancies,
    }


def find_matches(properties: List[Dict[str, Any]], criteria: Dict[str, Any]) -> Dict[str, Any]:
    """Filters and ranks properties based on deterministic match scoring."""
    evaluated = [evaluate_property_match(p, criteria) for p in properties if p.get("available", True)]
    evaluated.sort(key=lambda m: m["match_score"], reverse=True)

    exact_matches = [m for m in evaluated if m["is_exact_match"]]
    alternative_matches = [m for m in evaluated if not m["is_exact_match"] and m["match_score"] >= 50]

    return {
        "exact_matches": exact_matches,
        "alternative_matches": alternative_matches,
        "total_matches": len(exact_matches) + len(alternative_matches),
    }
