import json
import os

class SecurityService:
    def __init__(self):
        self.data_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "datasets",
            "security_simulated.json"
        )
        self.data = self._load_data()

    def _load_data(self):
        if os.path.exists(self.data_path):
            with open(self.data_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "summary": {"total_alerts": 5, "critical": 1, "warning": 2, "info": 2},
            "alerts": [],
            "integrations": []
        }

    def get_summary(self):
        return self.data.get("summary", {})

    def get_alerts(self):
        return self.data.get("alerts", [])

    def get_integrations(self):
        return self.data.get("integrations", [])

    def dismiss_alert(self, alert_id: str):
        self.data["alerts"] = [a for a in self.data.get("alerts", []) if a.get("id") != alert_id]
        if self.data["summary"]["total_alerts"] > 0:
            self.data["summary"]["total_alerts"] -= 1
        return True
