# Facility 360 AI Operations Platform 🏢⚡

An intelligent, multi-agent AI facility management and smart building operations platform. **Facility 360 AI** orchestrates 7 specialized AI Agent microservices to deliver real-time telemetry streaming, predictive maintenance, automated climate control, dedicated per-agent AI chatbots, and interactive dual-parameter setpoint tuning.

---

## 🌟 Architecture & 7 AI Agent Fleet

The platform operates on a microservice architecture with **7 dedicated Python FastAPI services** interacting with a high-performance **React 18 / Vite** frontend.

| AI Agent Microservice | Port | Domain Responsibilities | Primary Telemetry Metrics |
| :--- | :---: | :--- | :--- |
| ⚡ **Energy Agent** | `8000` | Electricity, HVAC COP tuning, tariff optimization, peak demand capping | Load (kW), Hourly Cost ($), Peak Cap |
| 🔧 **Maintenance Agent** | `8001` | Predictive failure scoring, acoustic vibration anomaly limits, MTBF tracking | Health Score (%), Risk Index (%), Vibration (G) |
| 👥 **Occupancy Agent** | `8002` | Space density heatmaps, indoor air quality (AQI), setpoint temperature | Occupancy (%), Comfort Index, Airflow (CFM) |
| 🛡️ **Security Agent** | `8003` | Perimeter badge matrix, CCTV anomaly detection, motion sensitivity | AI Threat Score, Motion Alerts, Security Mode |
| 💧 **Water Management** | `8004` | Main incomer flow (L/min), leak threshold alerts, greywater recycling | Flow (L/min), Recycled Water (%), Leak Limit |
| 🧹 **Cleaning Agent** | `8005` | Hygiene decay index, foot-traffic dispatch triggers, autonomous floor scrubbers | Cleanliness Index (%), Robot Cycles, Traffic |
| 🚗 **Parking Agent** | `8006` | ANPR barrier entry, EV charger allocation (kW), reserved bay occupancy | Bay Occupancy (%), EV Charge Load (kW), Tariff |

---

## 🎯 Key Platform Features

### 🎛️ Dual-Control Setpoints (Manual Number Inputs + Sliders)
- Every parameter across all 7 AI Agents features **dual-control synchronization**:
  - `<input type="number">` for typing exact numeric values.
  - `<input type="range">` slider for fluid dragging.
- Modifying a numeric input box or slider **immediately transforms the live graph baseline curve in real time**.
- Clicking **Apply Setpoints & Sync** updates system control loops and updates card metrics on the main **AI Agents** page.

### 🤖 Dedicated Per-Agent AI Chatbots
- Inside every agent modal, toggle to the dedicated **`<Agent Name>` AI Bot** tab.
- Each chatbot directly queries its backend service (`ports 8000–8006`) to accurately answer queries about its domain duties (e.g. *HVAC COP optimization*, *acoustic vibration limits*, *EV tariff pricing*, *leak detection thresholds*).

### 📊 Modern Domain-Tailored Analytical Graphs
- Ultra-sleek dark mode visualizations built with **Recharts**:
  - Glowing active data nodes (`activeDot={{ r: 7 }}`).
  - Custom SVG area gradients and reference lines.
  - Domain-specific chart types: Dual-Axis Composed Area + Line, Multi-Line Risk Curves, Step-Area Hygiene Decay, and Grouped Bar Histograms.

### 📟 Live Telemetry & Log Console
- Real-time heartbeat stream with live terminal log console displaying Python microservice events.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend Microservices**: Python 3.10+, FastAPI, Uvicorn, Asyncio, Pandas, Joblib.
- **API Protocol**: REST endpoints + JSON Telemetry Streams.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `v3.10` or higher
- **Package Managers**: `npm` & `pip`

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nideesh-CG/AI-Facility-OPS-Platform.git
   cd AI-Facility-OPS-Platform
   ```

2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Microservices Dependencies**:
   ```bash
   # Install dependencies for each microservice
   pip install -r energy-agent/requirements.txt
   pip install -r maintenance-agent/requirements.txt
   pip install -r occupancy-agent/requirements.txt
   pip install -r security-agent/requirements.txt
   pip install -r water-management-agent/requirements.txt
   pip install -r cleaning-agent/requirements.txt
   pip install -r parking-agent/requirements.txt
   ```

---

### Running the Application

#### 1. Launch Backend Microservices (Ports 8000–8006)
Run each backend agent in separate terminal tabs:

```bash
# Energy Agent (Port 8000)
python -m uvicorn energy-agent.app.main:app --host 127.0.0.1 --port 8000 --reload

# Maintenance Agent (Port 8001)
python -m uvicorn maintenance-agent.app.main:app --host 127.0.0.1 --port 8001 --reload

# Occupancy Agent (Port 8002)
python -m uvicorn occupancy-agent.app.main:app --host 127.0.0.1 --port 8002 --reload

# Security Agent (Port 8003)
python -m uvicorn security-agent.app.main:app --host 127.0.0.1 --port 8003 --reload

# Water Management Agent (Port 8004)
python -m uvicorn water-management-agent.app.main:app --host 127.0.0.1 --port 8004 --reload

# Cleaning Agent (Port 8005)
python -m uvicorn cleaning-agent.app.main:app --host 127.0.0.1 --port 8005 --reload

# Parking Agent (Port 8006)
python -m uvicorn parking-agent.app.main:app --host 127.0.0.1 --port 8006 --reload
```

#### 2. Launch Frontend Development Server (Port 5173)
```bash
cd frontend
npm run dev
```

Open **`http://localhost:5173`** in your browser to access the platform.

---

## 📡 API Documentation & Interactive Swagger Specs

Interactive OpenAPI documentation is automatically available for each microservice:

- ⚡ **Energy Agent**: `http://localhost:8000/docs`
- 🔧 **Maintenance Agent**: `http://localhost:8001/docs`
- 👥 **Occupancy Agent**: `http://localhost:8002/docs`
- 🛡️ **Security Agent**: `http://localhost:8003/docs`
- 💧 **Water Management**: `http://localhost:8004/docs`
- 🧹 **Cleaning Agent**: `http://localhost:8005/docs`
- 🚗 **Parking Agent**: `http://localhost:8006/docs`

---

## 💻 Building for Production

To create an optimized production build of the frontend:

```bash
cd frontend
npm run build
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
