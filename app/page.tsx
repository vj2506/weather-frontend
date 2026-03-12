"use client"
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Search, Thermometer, CloudRain, Wind, Sun, AlertTriangle } from 'lucide-react'

export default function WeatherDashboard() {
  // 1. STATE DEFINITIONS
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<any>(false)
  const [error, setError] = useState<any>("")
  
  // IMPORTANT: Replace the URL below with your actual Render URL
  const BACKEND_URL = "https://weather-backend-p00a.onrender.com"

  // 2. DATA FETCHING FUNCTION
  const fetchData = async (city: any) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${BACKEND_URL}/weather?city=${city}`)
      if (!res.ok) throw new Error("Location not found")
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError("Could not find data for that location.")
    } finally {
      setLoading(false)
    }
  }

  // 3. INITIAL LOAD
  useEffect(() => {
    fetchData("London")
  }, [])

  // 4. HELPER FOR STRIPE COLORS
  const getStripeColor = (temp: any) => {
    if (temp > 25) return "#ef4444"
    if (temp > 15) return "#f97316"
    return "#3b82f6"
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8">
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
            className="w-full bg-slate-900/50 border border-slate-800 p-3.5 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Search city (e.g. Dubai, Tokyo)..."
            onKeyDown={(e: any) => e.key === 'Enter' && fetchData(e.target.value)}
          />
        </div>
      </header>

      {loading && <div className="text-center py-20 text-blue-500 animate-pulse text-xl">Analyzing Global Records...</div>}
      
      {/* THE ERROR DISPLAY (The line that was failing) */}
      {error && (
        <div className="text-center py-20 text-red-400 flex items-center justify-center gap-2">
          <AlertTriangle /> {error}
        </div>
      )}

      {data && !loading && (
        <main className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricBox icon={<Thermometer/>} label="Location" value={data.location} sub="Verified GPS" />
            <MetricBox icon={<CloudRain/>} label="Latest Rainfall" value={`${data.daily.precipitation_sum[0]} mm`} sub="Daily Total" />
            <MetricBox icon={<Wind/>} label="Condition" value="Active" sub="Live Pattern" />
            <MetricBox icon={<Sun/>} label="UV Insight" value="Moderate" sub="Pattern Score" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">🌡️ Warming Stripes Pattern</h2>
              <div className="flex h-32 w-full rounded-xl overflow-hidden mb-8 border border-slate-800">
                {data.daily.temperature_2m_max.map((temp: any, i: any) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: getStripeColor(temp) }} />
                ))}
              </div>
              <h2 className="text-xl font-semibold mb-6">Temperature Trend Line</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.daily.time.map((t: any, i: any) => ({t, temp: data.daily.temperature_2m_max[i]}))}>
                    <XAxis dataKey="t" hide />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px'}} />
                    <Area type="monotone" dataKey="temp" stroke="#3b82f6" fillOpacity={0.2} fill="#3b82f6" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl h-[500px] flex flex-col">
              <h2 className="text-xl font-semibold mb-4">📜 Historical Log</h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {data.daily.time.map((time: any, i: any) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
                    <span className="text-sm font-medium">{time}</span>
                    <span className="text-blue-400 font-mono">{data.daily.temperature_2m_max[i]}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

function MetricBox({ icon, label, value, sub }: any) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl flex items-center gap-5">
      <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">{icon}</div>
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-slate-600 text-[10px]">{sub}</p>
      </div>
    </div>
  )
}