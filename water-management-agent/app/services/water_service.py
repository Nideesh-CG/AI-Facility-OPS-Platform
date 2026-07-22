import json
import os

class WaterService:
    def __init__(self):
        self.data_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "datasets",
            "water_simulated.json"
        )
        self.data = self._load_data()

    def _load_data(self):
        if os.path.exists(self.data_path):
            with open(self.data_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"summary": {}, "meters": [], "hourly_flow": []}

    def get_summary(self):
        return self.data.get("summary", {})

    def get_meters(self):
        return self.data.get("meters", [])

    def get_flow(self):
        return self.data.get("hourly_flow", [])
