"use client"
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Search, Thermometer, CloudRain, Wind, Sun, AlertTriangle } from 'lucide-react'

// 1. Dynamic Import for Map (Crucial for preventing crashes)
const Map = dynamic(() => import('./components/Map'), { 
  ssr: false, 
  loading: () => <div className="h-full w-full bg-slate-800 animate-pulse rounded-3xl" /> 
})

export default function WeatherDashboard() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<any>(false)
  const [error, setError] = useState<any>("")
  
  // REPLACE THIS with your actual Render backend URL
  const BACKEND_URL = "https://weather-backend-p00a.onrender.com"

  // 2. Lifecycle: Mount and Initial Load
  useEffect(() => {
    setMounted(true)
    fetchData("London")
  }, [])

  const fetchData = async (city: any) => {
    if (!city) return;
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${BACKEND_URL}/weather?city=${city}`)
      if (!res.ok) throw new Error("Location not found")
      const json = await res.json()
      if (json && json.daily) {
        setData(json)
      } else {
        throw new Error("Invalid data format")
      }
    } catch (err: any) {
      setError("Could not find data for that location.")
    } finally {
      setLoading(false)
    }
  }

  const getStripeColor = (temp: any) => {
    if (temp > 25) return "#ef4444"
    if (temp > 15) return "#f97316"
    return "#3b82f6"
  }

  // 3. Hydration Safety: Don't render until browser is ready
  if (!mounted) {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-mono">INITIALIZING_SYSTEM...</div>
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans transition-colors duration-500">
      
      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-2 italic">
            <Sun className="text-yellow-400 animate-spin-slow" /> WEATHER INTEL PRO
          </h1>
          <p className="text-slate-500 text-sm tracking-widest uppercase mt-1">Global Historical Archive</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-3.5 text-slate-500 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
          <input 
            className="w-full bg-slate-900/50 border border-slate-800 p-3.5 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-600 transition-all"
            placeholder="Search city (e.g. Dubai, Tokyo)..."
            onKeyDown={(e: any) => e.key === 'Enter' && fetchData(e.target.value)}
          />
        </div>
      </header>

      {/* STATUS OVERLAYS */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-500 font-medium">Analyzing Climate Data...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5" /> {error}
        </div>
      )}

      {/* MAIN DASHBOARD CONTENT */}
      {data && data.daily && (
        <main className="max-w-7xl mx-auto space-y-8">
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <MetricBox icon={<Thermometer/>} label="Identified Location" value={data.location || "N/A"} sub="Station Verified" />
            <MetricBox icon={<CloudRain/>} label="Latest Rainfall" value={`${data.daily.precipitation_sum?.[0] || 0} mm`} sub="Daily Aggregate" />
            <MetricBox icon={<Wind/>} label="Data Stream" value="Stable" sub="Cloud Connected" />
            <MetricBox icon={<Sun/>} label="System Status" value="Online" sub="GPS Active" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: PICTORIAL PATTERNS */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl shadow-xl backdrop-blur-md">
                <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">🌡️ Pictorial Warming Stripes</h2>
                
                {/* THE STRIPES */}
                <div className="flex h-32 w-full rounded-xl overflow-hidden mb-8 border border-slate-800 shadow-2xl">
                  {data.daily.temperature_2m_max?.map((temp: any, i: number) => (
                    <div 
                        key={i} 
                        className="flex-1 hover:opacity-80 transition-opacity" 
                        style={{ backgroundColor: getStripeColor(temp) }} 
                        title={`Day ${i}: ${temp}°C`}
                    />
                  ))}
                </div>

                {/* THE TREND CHART */}
                <h2 className="text-xl font-semibold mb-6 text-white">Temperature Intensity Graph</h2>
                <div className="h-72 w-full relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={data.daily.time?.map((t: any, i: number) => ({t, temp: data.daily.temperature_2m_max[i]}))}>
                      <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="t" hide />
                      <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff'}}
                        itemStyle={{color: '#3b82f6'}}
                      />
                      <Area type="monotone" dataKey="temp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: MAP & LOG */}
            <div className="space-y-8">
              
              {/* THE MAP BOX */}
              <div className="h-80 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
                 {data.lat != null && data.lon != null ? (
                   <Map lat={data.lat} lon={data.lon} />
                 ) : (
                   <div className="h-full w-full flex items-center justify-center text-slate-500 italic">Calculating GPS...</div>
                 )}
              </div>

              {/* THE LOG BOX */}
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl h-[400px] flex flex-col shadow-xl backdrop-blur-md">
                <h2 className="text-xl font-semibold mb-4 text-white">📜 Historical Log</h2>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {data.daily.time?.map((time: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl border border-slate-800/50 hover:border-slate-600 transition-colors">
                      <span className="text-sm font-medium text-slate-400 italic">{time}</span>
                      <div className="flex gap-4">
                        <span className="text-blue-400 font-mono font-bold">{data.daily.temperature_2m_max?.[i] || 0}°</span>
                        <span className="text-slate-600 text-[10px] self-center">{data.daily.precipitation_sum?.[i] || 0}mm</span>
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

function MetricBox({ icon, label, value, sub }: any) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl flex items-center gap-5 hover:bg-slate-900/60 transition-all">
      <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">{icon}</div>
      <div>
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">{label}</p>
        <p className="text-xl font-bold text-white truncate max-w-[120px]">{value}</p>
        <p className="text-slate-600 text-[10px] italic">{sub}</p>
      </div>
    </div>
  )
}