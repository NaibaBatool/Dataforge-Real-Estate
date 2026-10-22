"""Unit tests for lead scoring logic."""

import unittest
from scoring import calculate_lead_score, is_valid_phone, is_valid_budget


class TestLeadScoring(unittest.TestCase):
    def test_phone_validation(self):
        self.assertTrue(is_valid_phone("+1 (555) 234-5678"))
        self.assertTrue(is_valid_phone("03001234567"))
        self.assertTrue(is_valid_phone("+92 300 1234567"))
        self.assertFalse(is_valid_phone("123"))  # too short
        self.assertFalse(is_valid_phone(""))
        self.assertFalse(is_valid_phone(None))

    def test_budget_validation(self):
        self.assertTrue(is_valid_budget(100000, 300000))
        self.assertTrue(is_valid_budget(0, 500000))
        self.assertTrue(is_valid_budget(2000, 2000))  # exact match
        self.assertFalse(is_valid_budget(500000, 100000))  # max < min
        self.assertFalse(is_valid_budget(-100, 50000))  # min < 0
        self.assertFalse(is_valid_budget(100, 0))  # max == 0
        self.assertFalse(is_valid_budget("invalid", "invalid"))

    def test_hot_lead_score(self):
        # timeline immediately (+3), valid budget (+2), area (+1), phone (+2) = 8 -> Hot
        lead = {
            "timeline": "immediately",
            "budgetMin": 400000,
            "budgetMax": 800000,
            "areas": ["Emerald Heights"],
            "phone": "+1 555 123 4567",
        }
        res = calculate_lead_score(lead)
        self.assertEqual(res["total_score"], 8)
        self.assertEqual(res["tier"], "hot")

    def test_warm_lead_score(self):
        # timeline 1-3_months (+2), valid budget (+2), phone (+2), no area = 6 -> Warm
        lead = {
            "timeline": "1-3_months",
            "budgetMin": 200000,
            "budgetMax": 400000,
            "areas": [],
            "phone": "+1 555 123 4567",
        }
        res = calculate_lead_score(lead)
        self.assertEqual(res["total_score"], 6)
        self.assertEqual(res["tier"], "warm")

    def test_cold_lead_score(self):
        # timeline exploring (0), invalid budget (0), area (+1), phone (+2) = 3 -> Cold
        lead = {
            "timeline": "exploring",
            "budgetMin": 500000,
            "budgetMax": 100000,  # invalid
            "areas": ["Downtown District"],
            "phone": "+1 555 123 4567",
        }
        res = calculate_lead_score(lead)
        self.assertEqual(res["total_score"], 3)
        self.assertEqual(res["tier"], "cold")

    def test_future_viewing_booked_bonus(self):
        # viewingBooked adds +3 points
        lead = {
            "timeline": "1-3_months",  # +2
            "budgetMin": 100000,
            "budgetMax": 200000,  # +2
            "areas": ["Westlake"],  # +1
            "phone": "+1 555 123 4567",  # +2
            "viewingBooked": True,  # +3
        }
        res = calculate_lead_score(lead)
        self.assertEqual(res["total_score"], 10)
        self.assertEqual(res["tier"], "hot")


if __name__ == "__main__":
    unittest.main()
