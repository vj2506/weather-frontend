"use client"
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Search, Thermometer, CloudRain, Wind, Sun, AlertTriangle, MapPin } from 'lucide-react'
// ... (your imports)

export default function WeatherDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Define the function first
  const fetchData = async (city: any) => {
    setLoading(true);
    const res = await fetch(`https://your-backend-url.onrender.com/weather?city=${city}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  // 2. Then call it in useEffect
  useEffect(() => {
    fetchData("London");
  }, []);

  // Load London by default
  useEffect(() => { fetchData("London") }, [])

  // Helper for "Warming Stripes" colors
  const getStripeColor = (temp: any) => {
    if (temp > 25) return "#ef4444" // Red
    if (temp > 15) return "#f97316" // Orange
    return "#3b82f6" // Blue
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 md:p-8">
      {/* HEADER & SEARCH */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Sun className="text-yellow-400" /> Weather Pattern Intel
          </h1>
          <p className="text-slate-400">Historical Analysis & Climate Insights</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-slate-500 h-5 w-5" />
          <input 
            className="w-full bg-slate-900/50 border border-slate-800 p-3.5 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
            placeholder="Search city (e.g. Dubai, Tokyo)..."
            onKeyDown={(e) => e.key === 'Enter' && fetchData(e.target.value)}
          />
        </div>
      </header>

      {loading && <div className="text-center py-20 text-blue-500 animate-pulse text-xl">Analyzing Global Records...</div>}
      {error && <div className="text-center py-20 text-red-400 flex items-center justify-center gap-2"><AlertTriangle/> {error}</div>}

      {data && !loading && (
        <main className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
          
          {/* TOP METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricBox icon={<Thermometer/>} label="Location" value={data.location} sub="Verified GPS" />
            <MetricBox icon={<CloudRain/>} label="Latest Rainfall" value={`${data.daily.precipitation_sum[0]} mm`} sub="Daily Total" />
            <MetricBox icon={<Wind/>} label="Historical High" value="32 km/h" sub="Wind Speed" />
            <MetricBox icon={<Sun/>} label="UV Insight" value="Moderate" sub="Pattern Score" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* PICTORIAL VIEW: CLIMATE STRIPES */}
            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">🌡️ Warming Stripes Pattern</h2>
              <div className="flex h-32 w-full rounded-xl overflow-hidden mb-8 border border-slate-800">
                {data.daily.temperature_2m_max.map((temp, i) => (
                  <div 
                    key={i} 
                    className="flex-1 hover:scale-y-110 transition-transform cursor-help"
                    style={{ backgroundColor: getStripeColor(temp) }}
                    title={`Day ${i}: ${temp}°C`}
                  />
                ))}
              </div>

              {/* TREND LINE */}
              <h2 className="text-xl font-semibold mb-6">Temperature Trend Line</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.daily.time.map((t, i) => ({t, temp: data.daily.temperature_2m_max[i]}))}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" hide />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px'}} />
                    <Area type="monotone" dataKey="temp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SIDE PANEL: RAINFALL & LOG */}
            <div className="space-y-8">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl shadow-xl h-[500px] flex flex-col">
                <h2 className="text-xl font-semibold mb-4">📜 Historical Log</h2>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {data.daily.time.map((time, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
                      <span className="text-sm font-medium">{time}</span>
                      <div className="flex gap-4">
                        <span className="text-blue-400 font-mono">{data.daily.temperature_2m_max[i]}°</span>
                        <span className="text-slate-500 text-xs">{data.daily.precipitation_sum[i]}mm</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

function MetricBox({ icon, label, value, sub }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl flex items-center gap-5 hover:border-slate-700 transition-colors">
      <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">{icon}</div>
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-slate-600 text-[10px]">{sub}</p>
      </div>
    </div>
  )
}