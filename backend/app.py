"""DataForge Estates — Flask Backend API Service."""

import os
import uuid
import datetime
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from scoring import calculate_lead_score, is_valid_phone, is_valid_budget
from matching import find_matches

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Sample properties dataset (consistent with frontend repository data)
PROPERTIES = [
    {
        "id": "prop-01",
        "title": "Modern Family House with Garden",
        "description": "An elegant, light-filled family residence featuring open-concept living.",
        "area": "Emerald Heights",
        "city": "Metropolis",
        "price": 485000,
        "priceFormatted": "$485,000",
        "status": "sale",
        "purpose": "buy",
        "type": "house",
        "beds": 4,
        "baths": 3,
        "size": 2600,
        "image": "/images/property-1.png",
        "features": ["Private Garden", "Double Garage", "Smart Thermostat"],
        "available": True,
    },
    {
        "id": "prop-02",
        "title": "City View Apartment Residences",
        "description": "Contemporary high-floor residence situated in the center of Downtown.",
        "area": "Downtown District",
        "city": "Metropolis",
        "price": 1650,
        "priceFormatted": "$1,650/mo",
        "status": "rent",
        "purpose": "rent",
        "type": "apartment",
        "beds": 2,
        "baths": 2,
        "size": 1150,
        "image": "/images/property-2.png",
        "features": ["Balcony View", "Concierge Service", "Fitness Center"],
        "available": True,
    },
    {
        "id": "prop-03",
        "title": "Bright Interior Townhome",
        "description": "Architectural townhouse featuring soaring ceilings and designer palette.",
        "area": "Willowbrook",
        "city": "Metropolis",
        "price": 362000,
        "priceFormatted": "$362,000",
        "status": "new",
        "purpose": "buy",
        "type": "house",
        "beds": 3,
        "baths": 2,
        "size": 1850,
        "image": "/images/property-3.png",
        "features": ["Rooftop Terrace", "Designer Lighting", "Energy Efficient"],
        "available": True,
    },
    {
        "id": "prop-04",
        "title": "Contemporary Villa with Pool",
        "description": "A show-stopping luxury estate built for effortless entertaining.",
        "area": "Emerald Heights",
        "city": "Metropolis",
        "price": 920000,
        "priceFormatted": "$920,000",
        "status": "sale",
        "purpose": "buy",
        "type": "house",
        "beds": 5,
        "baths": 4,
        "size": 3800,
        "image": "/images/property-4.png",
        "features": ["Swimming Pool", "Outdoor Kitchen", "Wine Cellar"],
        "available": True,
    },
    {
        "id": "prop-05",
        "title": "Penthouse with Skyline Views",
        "description": "Exclusive penthouse crowning Downtown's most desirable tower.",
        "area": "Downtown District",
        "city": "Metropolis",
        "price": 2900,
        "priceFormatted": "$2,900/mo",
        "status": "rent",
        "purpose": "rent",
        "type": "apartment",
        "beds": 3,
        "baths": 3,
        "size": 2100,
        "image": "/images/property-5.png",
        "features": ["Skyline Views", "Wrap-around Terrace", "Private Elevator"],
        "available": True,
    },
    {
        "id": "prop-06",
        "title": "Residential Plot in Green Valley",
        "description": "Premium corner plot in a quiet master-planned community.",
        "area": "Green Valley",
        "city": "Metropolis",
        "price": 140000,
        "priceFormatted": "$140,000",
        "status": "new",
        "purpose": "buy",
        "type": "plot",
        "beds": 0,
        "baths": 0,
        "size": 5000,
        "image": "/images/property-6.png",
        "features": ["Corner Lot", "Underground Utilities", "Clear Title"],
        "available": True,
    },
    {
        "id": "prop-07",
        "title": "Lakefront Stone Manor",
        "description": "Distinguished lakeside estate boasting direct water access.",
        "area": "Westlake",
        "city": "Metropolis",
        "price": 850000,
        "priceFormatted": "$850,000",
        "status": "sale",
        "purpose": "buy",
        "type": "house",
        "beds": 4,
        "baths": 4,
        "size": 3400,
        "image": "/images/property-4.png",
        "features": ["Private Boat Dock", "Lakeside View", "Chef's Kitchen"],
        "available": True,
    },
    {
        "id": "prop-08",
        "title": "Minimalist Loft with Terrace",
        "description": "Industrial chic loft with double-height exposed beam ceilings.",
        "area": "Downtown District",
        "city": "Metropolis",
        "price": 1850,
        "priceFormatted": "$1,850/mo",
        "status": "rent",
        "purpose": "rent",
        "type": "apartment",
        "beds": 1,
        "baths": 1.5,
        "size": 980,
        "image": "/images/property-2.png",
        "features": ["Exposed Brick", "Private Terrace", "Polished Concrete"],
        "available": True,
    },
]

# Local leads repository
LEADS_DB = {
    "demo-lead-01": {
        "id": "demo-lead-01",
        "purpose": "buy",
        "propertyType": "house",
        "areas": ["Emerald Heights"],
        "budgetMin": 400000,
        "budgetMax": 700000,
        "timeline": "1-3_months",
        "name": "Alexander Vance",
        "phone": "+1 555 234 5678",
        "email": "alexander@example.com",
        "score": 7,
        "tier": "warm",
        "consent": True,
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }
}


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "service": "dataforge-estates-backend", "version": "1.0.0"})


@app.route("/api/properties", methods=["GET"])
def get_properties():
    purpose = request.args.get("purpose")
    prop_type = request.args.get("type")
    area = request.args.get("area")
    min_price = request.args.get("minPrice", type=float)
    max_price = request.args.get("maxPrice", type=float)

    filtered = PROPERTIES
    if purpose and purpose != "all":
        filtered = [p for p in filtered if p["purpose"] == purpose]
    if prop_type and prop_type != "all":
        filtered = [p for p in filtered if p["type"] == prop_type]
    if area and area != "all":
        filtered = [p for p in filtered if p["area"].lower() == area.lower()]
    if min_price is not None:
        filtered = [p for p in filtered if p["price"] >= min_price]
    if max_price is not None:
        filtered = [p for p in filtered if p["price"] <= max_price]

    return jsonify({"success": True, "count": len(filtered), "properties": filtered})


@app.route("/api/properties/<prop_id>", methods=["GET"])
def get_property(prop_id):
    prop = next((p for p in PROPERTIES if p["id"] == prop_id), None)
    if not prop:
        return jsonify({"success": False, "error": "Property not found"}), 404
    return jsonify({"success": True, "property": prop})


@app.route("/api/leads", methods=["POST"])
def create_lead():
    data = request.get_json() or {}

    purpose = data.get("purpose")
    prop_type = data.get("propertyType", data.get("property_type"))
    areas = data.get("areas", [])
    budget_min = data.get("budgetMin", data.get("budget_min"))
    budget_max = data.get("budgetMax", data.get("budget_max"))
    timeline = data.get("timeline")
    name = data.get("name", "")
    phone = data.get("phone", "")
    email = data.get("email")
    notes = data.get("notes")
    consent = data.get("consent", False)

    # Validations
    if not purpose or purpose not in ("buy", "rent", "invest"):
        return jsonify({"success": False, "error": "Valid purpose (buy, rent, invest) required"}), 400

    if not prop_type or prop_type not in ("house", "apartment", "plot", "commercial"):
        return jsonify({"success": False, "error": "Valid property type required"}), 400

    if not areas or not isinstance(areas, list):
        return jsonify({"success": False, "error": "At least one preferred area required"}), 400

    if not is_valid_budget(budget_min, budget_max):
        return jsonify({"success": False, "error": "Valid budget range required (max >= min)"}), 400

    if not name or len(name.strip()) < 2:
        return jsonify({"success": False, "error": "Full name is required"}), 400

    if not is_valid_phone(phone):
        return jsonify({"success": False, "error": "Valid phone number is required"}), 400

    if consent is not True:
        return jsonify({"success": False, "error": "Consent is required to submit contact details"}), 400

    # Calculate score & tier
    score_result = calculate_lead_score({
        "timeline": timeline,
        "budgetMin": budget_min,
        "budgetMax": budget_max,
        "areas": areas,
        "phone": phone,
        "viewingBooked": data.get("viewingBooked", False),
    })

    lead_id = str(uuid.uuid4())
    lead_record = {
        "id": lead_id,
        "purpose": purpose,
        "propertyType": prop_type,
        "areas": areas,
        "budgetMin": float(budget_min),
        "budgetMax": float(budget_max),
        "timeline": timeline,
        "name": name.strip(),
        "phone": phone.strip(),
        "email": email.strip() if email else None,
        "notes": notes.strip() if notes else None,
        "score": score_result["total_score"],
        "tier": score_result["tier"],
        "consent": True,
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }
    LEADS_DB[lead_id] = lead_record

    # Non-blocking n8n webhook notification
    n8n_url = os.environ.get("N8N_WEBHOOK_URL")
    if n8n_url:
        try:
            requests.post(
                n8n_url,
                json={"event": "lead.created", "lead": lead_record},
                timeout=3,
            )
        except Exception as e:
            app.logger.warning(f"n8n webhook notification skipped: {e}")

    return jsonify({
        "success": True,
        "leadId": lead_id,
        "score": score_result["total_score"],
        "tier": score_result["tier"],
        "message": "Lead qualified successfully",
    }), 201


@app.route("/api/leads/<lead_id>/matches", methods=["GET"])
def get_lead_matches(lead_id):
    lead = LEADS_DB.get(lead_id)
    if not lead:
        return jsonify({"success": False, "error": "Lead not found or session expired"}), 404

    match_result = find_matches(PROPERTIES, {
        "purpose": lead["purpose"],
        "propertyType": lead["propertyType"],
        "areas": lead["areas"],
        "budgetMin": lead["budgetMin"],
        "budgetMax": lead["budgetMax"],
    })

    # Return safe public representation without customer PII
    safe_lead = {
        "id": lead["id"],
        "purpose": lead["purpose"],
        "propertyType": lead["propertyType"],
        "areas": lead["areas"],
        "budgetMin": lead["budgetMin"],
        "budgetMax": lead["budgetMax"],
        "timeline": lead["timeline"],
        "score": lead["score"],
        "tier": lead["tier"],
    }

    return jsonify({
        "success": True,
        "lead": safe_lead,
        "exactMatches": match_result["exact_matches"],
        "alternativeMatches": match_result["alternative_matches"],
        "totalMatches": match_result["total_matches"],
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
