import json
import os
from datetime import datetime

class MaintenanceService:
    def __init__(self):
        self.data_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            "datasets",
            "maintenance_simulated.json"
        )
        self.data = self._load_data()

    def _load_data(self):
        if os.path.exists(self.data_path):
            with open(self.data_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "summary": {"total_assets": 1250, "healthy": 1050, "warning": 120, "critical": 80, "active_work_orders": 8},
            "assets": [],
            "work_orders": [],
            "schedules": []
        }

    def get_summary(self):
        return self.data.get("summary", {})

    def get_assets(self):
        return self.data.get("assets", [])

    def get_work_orders(self):
        return self.data.get("work_orders", [])

    def create_work_order(self, wo_data: dict):
        new_id = f"WO-{len(self.data['work_orders']) + 1005}"
        work_order = {
            "id": new_id,
            "asset": wo_data.get("asset", "General Asset"),
            "priority": wo_data.get("priority", "Medium"),
            "status": wo_data.get("status", "Pending"),
            "assignedTo": wo_data.get("assignedTo", "Unassigned"),
            "dueDate": wo_data.get("dueDate", "18 May"),
            "description": wo_data.get("description", "Scheduled Maintenance")
        }
        self.data["work_orders"].insert(0, work_order)
        self.data["summary"]["active_work_orders"] = self.data["summary"].get("active_work_orders", 0) + 1
        return work_order

    def get_schedules(self):
        return self.data.get("schedules", [])

    def create_schedule(self, sched_data: dict):
        new_id = f"SCH-{len(self.data['schedules']) + 1}"
        schedule = {
            "id": new_id,
            "date": sched_data.get("date", "20 May"),
            "activity": sched_data.get("activity", "Routine Inspection"),
            "time": sched_data.get("time", "10:00 AM"),
            "status": sched_data.get("status", "Upcoming")
        }
        self.data["schedules"].append(schedule)
        return schedule
