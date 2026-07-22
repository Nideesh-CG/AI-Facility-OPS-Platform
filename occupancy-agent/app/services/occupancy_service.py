import json
import os
import random

class OccupancyService:
    def __init__(self):
        self.data_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "datasets",
            "occupancy_simulated.json"
        )
        self.data = self._load_data()

    def _load_data(self):
        if os.path.exists(self.data_path):
            with open(self.data_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "kpi": {"current_occupancy_pct": 73, "total_capacity": 1500, "current_count": 1095},
            "zones": [],
            "hourly_occupancy": []
        }

    def get_kpis(self):
        kpi = dict(self.data.get("kpi", {}))
        # Add slight dynamic drift for real-time live polling
        drift = random.choice([-1, 0, 1])
        kpi["current_occupancy_pct"] = max(10, min(100, kpi.get("current_occupancy_pct", 73) + drift))
        return kpi

    def get_zones(self):
        return self.data.get("zones", [])

    def get_hourly_trend(self):
        return self.data.get("hourly_occupancy", [])
