import unittest
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.data.synthetic_data import DEFAULT_TRAINS, DEFAULT_MAINTENANCE, DEFAULT_INFRASTRUCTURE
from app.engine.priority_engine import calculate_priority
from app.engine.work_time_predictor import predict_duration
from app.engine.conflict_detector import detect_conflicts
from app.engine.cpsat_optimizer import generate_plan
from app.engine.safety_validator import validate_plan
from app.engine.disruption_engine import replan

class TestBlockPlanningEngine(unittest.TestCase):

    def test_priority_calculation(self):
        req = {
            "priority": "Critical",
            "department": "S&T",
            "severity": 9.0,
            "asset_criticality": 9.5,
            "urgency": 9.0,
            "safety_impact": 10.0
        }
        result = calculate_priority(req)
        self.assertGreaterEqual(result["priority_score"], 80.0)
        self.assertEqual(result["priority_level"], "Critical")

    def test_duration_prediction(self):
        req = {
            "workType": "Track Renewal",
            "department": "Engineering",
            "complexity": "High",
            "resource": "Heavy Crane #1"
        }
        duration = predict_duration(req)
        self.assertGreaterEqual(duration, 60)

    def test_conflict_detection(self):
        # M001 requested 14:00-15:00 on A-B, T001 is on A-B at 14:20-14:40 -> conflict!
        conflict_res = detect_conflicts(DEFAULT_TRAINS, DEFAULT_MAINTENANCE, DEFAULT_INFRASTRUCTURE)
        self.assertTrue(conflict_res["has_conflict"])
        self.assertGreater(len(conflict_res["conflicts"]), 0)

    def test_cpsat_optimization(self):
        plan_res = generate_plan(DEFAULT_TRAINS, DEFAULT_MAINTENANCE, DEFAULT_INFRASTRUCTURE)
        optimized_plan = plan_res["optimized_plan"]
        self.assertEqual(len(optimized_plan), len(DEFAULT_MAINTENANCE))
        
        # Verify safety validation on optimized plan
        safety = plan_res["safety_validation"]
        self.assertEqual(safety["status"], "PASSED")

    def test_train_delay_disruption(self):
        disruption = {
            "type": "delay",
            "train": "T001",
            "minutes": 20
        }
        result = replan(disruption, [], DEFAULT_TRAINS, DEFAULT_MAINTENANCE, DEFAULT_INFRASTRUCTURE)
        self.assertIn("updated_plan", result)
        self.assertGreater(len(result["updated_plan"]), 0)

    def test_maintenance_overrun_disruption(self):
        disruption = {
            "type": "overrun",
            "request": "M001",
            "minutes": 30
        }
        result = replan(disruption, [], DEFAULT_TRAINS, DEFAULT_MAINTENANCE, DEFAULT_INFRASTRUCTURE)
        self.assertIn("updated_plan", result)
        self.assertEqual(result["status"], "RE_SLOTTED")

if __name__ == "__main__":
    unittest.main()
