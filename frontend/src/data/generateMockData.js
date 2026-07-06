import fs from 'fs';
import path from 'path';

// Let's generate 30 days of hourly data.
const hourlyEnergyData = [];
const dailyEnergyData = [];
const weeklyEnergyData = [];

const now = new Date('2026-07-05T20:00:00Z');

// We go back 30 days (30 days * 24 hours = 720 records)
for (let i = 29 * 24; i >= 0; i--) {
  const time = new Date(now.getTime() - i * 60 * 60 * 1000);
  const hour = time.getHours();
  
  // HVAC peaks during afternoon (12 PM - 5 PM)
  const isWorkHour = hour >= 8 && hour <= 18;
  const tempFactor = Math.sin((hour - 6) / 24 * 2 * Math.PI); // peak around 2 PM
  
  const baseHVAC = isWorkHour ? 120 : 40;
  const hvac = parseFloat((baseHVAC + (tempFactor * 30) + Math.random() * 10).toFixed(2));
  
  const baseLighting = isWorkHour ? 50 : 10;
  const lighting = parseFloat((baseLighting + Math.random() * 5).toFixed(2));
  
  const baseEquipment = isWorkHour ? 80 : 30;
  const equipment = parseFloat((baseEquipment + Math.random() * 10).toFixed(2));
  
  const baseElevators = isWorkHour ? 25 : 2;
  const elevators = parseFloat((baseElevators + Math.random() * 3).toFixed(2));
  
  const electricity = parseFloat((hvac + lighting + equipment + elevators).toFixed(2));
  
  const water = parseFloat(((isWorkHour ? 200 : 20) + Math.random() * 20).toFixed(2));
  
  // carbon factor: 0.4 kg CO2 per kWh
  const carbon = parseFloat((electricity * 0.4).toFixed(2));
  
  // cost: peak hours are more expensive
  const rate = isWorkHour ? 0.15 : 0.08;
  const cost = parseFloat((electricity * rate).toFixed(2));
  
  // efficiency score: HVAC load makes it slightly less efficient during peak
  const efficiency = parseFloat((85 - (hvac > 120 ? 10 : 0) + Math.random() * 10).toFixed(1));
  
  const peakDemand = parseFloat((electricity * 1.1).toFixed(2));
  
  hourlyEnergyData.push({
    timestamp: time.toISOString(),
    hvac,
    lighting,
    equipment,
    elevators,
    water,
    electricity,
    carbon,
    cost,
    efficiency,
    peakDemand
  });
}

// Generate daily aggregates (30 items)
for (let day = 29; day >= 0; day--) {
  const dayStartIdx = (29 - day) * 24;
  const dayHourly = hourlyEnergyData.slice(dayStartIdx, dayStartIdx + 24);
  
  if (dayHourly.length === 0) continue;
  
  const date = new Date(dayHourly[0].timestamp);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const totalHVAC = dayHourly.reduce((acc, curr) => acc + curr.hvac, 0);
  const totalLighting = dayHourly.reduce((acc, curr) => acc + curr.lighting, 0);
  const totalEquipment = dayHourly.reduce((acc, curr) => acc + curr.equipment, 0);
  const totalElevators = dayHourly.reduce((acc, curr) => acc + curr.elevators, 0);
  const totalWater = dayHourly.reduce((acc, curr) => acc + curr.water, 0);
  const totalElectricity = dayHourly.reduce((acc, curr) => acc + curr.electricity, 0);
  const totalCarbon = dayHourly.reduce((acc, curr) => acc + curr.carbon, 0);
  const totalCost = dayHourly.reduce((acc, curr) => acc + curr.cost, 0);
  const avgEfficiency = dayHourly.reduce((acc, curr) => acc + curr.efficiency, 0) / 24;
  const maxPeakDemand = Math.max(...dayHourly.map(d => d.peakDemand));
  
  dailyEnergyData.push({
    date: dateStr,
    fullDate: date.toISOString().split('T')[0],
    hvac: parseFloat(totalHVAC.toFixed(1)),
    lighting: parseFloat(totalLighting.toFixed(1)),
    equipment: parseFloat(totalEquipment.toFixed(1)),
    elevators: parseFloat(totalElevators.toFixed(1)),
    water: parseFloat(totalWater.toFixed(1)),
    electricity: parseFloat(totalElectricity.toFixed(1)),
    carbon: parseFloat(totalCarbon.toFixed(1)),
    cost: parseFloat(totalCost.toFixed(1)),
    efficiency: parseFloat(avgEfficiency.toFixed(1)),
    peakDemand: parseFloat(maxPeakDemand.toFixed(1))
  });
}

// Generate weekly aggregates (last 4 weeks)
for (let w = 3; w >= 0; w--) {
  const weekDays = dailyEnergyData.slice((3 - w) * 7, (3 - w) * 7 + 7);
  if (weekDays.length === 0) continue;
  
  const totalElec = weekDays.reduce((acc, curr) => acc + curr.electricity, 0);
  const totalCost = weekDays.reduce((acc, curr) => acc + curr.cost, 0);
  const totalCarbon = weekDays.reduce((acc, curr) => acc + curr.carbon, 0);
  
  weeklyEnergyData.push({
    week: `Week ${4 - w}`,
    electricity: parseFloat(totalElec.toFixed(1)),
    cost: parseFloat(totalCost.toFixed(1)),
    carbon: parseFloat(totalCarbon.toFixed(1))
  });
}

// Sensors
const sensors = [
  { id: "SEN-TEMP-01", name: "Lobby Temp Sensor", location: "Lobby Floor 1", type: "Temperature", reading: 22.4, unit: "°C", status: "Healthy", updatedTime: "2 mins ago" },
  { id: "SEN-HUM-01", name: "Lobby Humidity Sensor", location: "Lobby Floor 1", type: "Humidity", reading: 45.2, unit: "%", status: "Healthy", updatedTime: "4 mins ago" },
  { id: "SEN-TEMP-02", name: "Server Room A Temp", location: "Data Center (Basement)", type: "Temperature", reading: 25.8, unit: "°C", status: "Warning", updatedTime: "Just now" },
  { id: "SEN-TEMP-03", name: "Server Room B Temp", location: "Data Center (Basement)", type: "Temperature", reading: 21.2, unit: "°C", status: "Healthy", updatedTime: "5 mins ago" },
  { id: "SEN-PWR-MAIN", name: "Main Grid Power Meter", location: "Substation Block A", type: "Power Meter", reading: 450.5, unit: "kW", status: "Healthy", updatedTime: "Just now" },
  { id: "SEN-PWR-HVAC", name: "HVAC Plant Power Meter", location: "Rooftop Plant", type: "Power Meter", reading: 180.2, unit: "kW", status: "Healthy", updatedTime: "1 min ago" },
  { id: "SEN-IAQ-01", name: "Floor 2 IAQ Sensor", location: "Conference Hall East", type: "Air Quality", reading: 750, unit: "ppm CO2", status: "Healthy", updatedTime: "8 mins ago" },
  { id: "SEN-IAQ-02", name: "Floor 4 IAQ Sensor", location: "Floor 4 Open Office", type: "Air Quality", reading: 1100, unit: "ppm CO2", status: "Warning", updatedTime: "Just now" },
  { id: "SEN-WTR-MAIN", name: "Main Water Inflow Meter", location: "Utility Building", type: "Water Flow", reading: 42.5, unit: "L/min", status: "Healthy", updatedTime: "12 mins ago" },
  { id: "SEN-TEMP-04", name: "Executive Suite Temp", location: "Floor 10 East", type: "Temperature", reading: 27.2, unit: "°C", status: "Critical", updatedTime: "3 mins ago" },
  { id: "SEN-LGT-01", name: "Floor 1 Lighting Controller", location: "Lobby Floor 1", type: "Lighting Status", reading: 85, unit: "% Output", status: "Healthy", updatedTime: "15 mins ago" },
  { id: "SEN-LGT-02", name: "Floor 2 Lighting Controller", location: "Floor 2 West Wing", type: "Lighting Status", reading: 0, unit: "% Output", status: "Healthy", updatedTime: "15 mins ago" },
  { id: "SEN-TEMP-05", name: "Canteen Area Temp", location: "Floor 1 Cafeteria", type: "Temperature", reading: 23.8, unit: "°C", status: "Healthy", updatedTime: "7 mins ago" },
  { id: "SEN-PWR-ELEV", name: "Elevator Bank Power Meter", location: "Central Core", type: "Power Meter", reading: 22.8, unit: "kW", status: "Healthy", updatedTime: "2 mins ago" },
  { id: "SEN-WTR-HVAC", name: "HVAC Cooling Water Meter", location: "Rooftop Plant", type: "Water Flow", reading: 0.0, unit: "L/min", status: "Critical", updatedTime: "Just now" }
];

// Recent alerts
const alerts = [
  { id: "ALT-001", timestamp: "2026-07-05T19:58:12Z", location: "Floor 10 East", severity: "Critical", status: "Active", message: "Executive Suite Temperature (27.2°C) exceeded threshold of 25.0°C. HVAC failure suspected.", action: "Investigate" },
  { id: "ALT-002", timestamp: "2026-07-05T19:55:00Z", location: "Rooftop Plant", severity: "Critical", status: "Active", message: "HVAC Cooling Water Loop flow rate is 0.0 L/min. Pump shutdown detected.", action: "Investigate" },
  { id: "ALT-003", timestamp: "2026-07-05T19:48:30Z", location: "Data Center (Basement)", severity: "Warning", status: "Active", message: "Server Room A Temp (25.8°C) approaching maximum safe operating limit.", action: "Acknowledge" },
  { id: "ALT-004", timestamp: "2026-07-05T19:30:15Z", location: "Floor 4 Open Office", severity: "Warning", status: "Active", message: "Carbon Dioxide level (1100 ppm) exceeded fresh air circulation threshold.", action: "Acknowledge" },
  { id: "ALT-005", timestamp: "2026-07-05T18:15:00Z", location: "Substation Block A", severity: "Info", status: "Acknowledged", message: "Main Grid power factor dropped to 0.89. Capacitor banks engaged.", action: "Clear" },
  { id: "ALT-006", timestamp: "2026-07-05T16:22:45Z", location: "Central Core", severity: "Info", status: "Acknowledged", message: "Elevator Bank E scheduled monthly diagnostics initiated.", action: "Clear" }
];

const mockData = {
  hourlyEnergyData,
  dailyEnergyData,
  weeklyEnergyData,
  sensors,
  alerts
};

const outputDir = path.resolve('./src/data');
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'mockData.json'), JSON.stringify(mockData, null, 2));
console.log("Mock data generated successfully!");
