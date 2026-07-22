import json
import os

class ParkingService:
    def __init__(self):
        self.data_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "datasets",
            "parking_simulated.json"
        )
        self.data = self._load_data()

    def _load_data(self):
        if os.path.exists(self.data_path):
            with open(self.data_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"summary": {}, "bays": []}

    def get_summary(self):
        return self.data.get("summary", {})

    def get_bays(self):
        return self.data.get("bays", [])
