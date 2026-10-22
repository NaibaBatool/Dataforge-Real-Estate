"""Integration and API unit tests for Flask backend."""

import unittest
from app import app, LEADS_DB


class TestBackendAPI(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config["TESTING"] = True

    def test_health(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "ok")

    def test_get_properties(self):
        response = self.client.get("/api/properties")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertGreater(data["count"], 0)

    def test_get_property_by_id(self):
        response = self.client.get("/api/properties/prop-01")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["property"]["id"], "prop-01")

    def test_get_property_not_found(self):
        response = self.client.get("/api/properties/unknown-id-999")
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertFalse(data["success"])

    def test_create_lead_and_matches(self):
        payload = {
            "purpose": "buy",
            "propertyType": "house",
            "areas": ["Emerald Heights"],
            "budgetMin": 400000,
            "budgetMax": 950000,
            "timeline": "immediately",
            "name": "Jane Doe",
            "phone": "+1 555 987 6543",
            "email": "jane@example.com",
            "consent": True,
        }
        res = self.client.post("/api/leads", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data["success"])
        lead_id = data["leadId"]
        self.assertIn("score", data)
        self.assertEqual(data["tier"], "hot")

        # Now test matching endpoint for this newly created lead
        match_res = self.client.get(f"/api/leads/{lead_id}/matches")
        self.assertEqual(match_res.status_code, 200)
        match_data = match_res.get_json()
        self.assertTrue(match_data["success"])
        self.assertGreater(match_data["totalMatches"], 0)

    def test_create_lead_invalid_budget(self):
        payload = {
            "purpose": "buy",
            "propertyType": "house",
            "areas": ["Emerald Heights"],
            "budgetMin": 900000,
            "budgetMax": 100000,  # invalid
            "timeline": "immediately",
            "name": "Jane Doe",
            "phone": "+1 555 987 6543",
            "consent": True,
        }
        res = self.client.post("/api/leads", json=payload)
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data["success"])

    def test_create_lead_missing_consent(self):
        payload = {
            "purpose": "buy",
            "propertyType": "house",
            "areas": ["Emerald Heights"],
            "budgetMin": 100000,
            "budgetMax": 400000,
            "timeline": "immediately",
            "name": "Jane Doe",
            "phone": "+1 555 987 6543",
            "consent": False,  # Missing consent
        }
        res = self.client.post("/api/leads", json=payload)
        self.assertEqual(res.status_code, 400)


if __name__ == "__main__":
    unittest.main()
