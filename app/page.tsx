"use client"
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Search, Thermometer, Droplets, Wind, Sun } from 'lucide-react'

export default function WeatherDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  async function searchCity(city) {
    setLoading(true)
    // Replace with your Render.com URL later
    const res = await fetch(`https://your-backend-url.onrender.com/weather?city=${city}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      {/* 1. SEARCH BAR */}
      <div className="max-w-6xl mx-auto flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" />
          <input 
            className="w-full bg-slate-900 border border-slate-800 p-3 pl-10 rounded-xl outline-none focus:border-blue-500"
            placeholder="Search any city in the world..."
            onKeyDown={(e) => e.key === 'Enter' && searchCity(e.target.value)}
          />
        </div>
      </div>

      {data && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 2. TOP METRICS CARD */}
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon={<Thermometer/>} label="Avg Temp" value="24°C" />
            <MetricCard icon={<Droplets/>} label="Rainfall" value="120mm" />
            <MetricCard icon={<Wind/>} label="Wind Speed" value="15km/h" />
            <MetricCard icon={<Sun/>} label="UV Index" value="High" />
          </div>

          {/* 3. THE "PICTORIAL" VIEW (MAIN CHART) */}
          <div className="md:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-semibold mb-4">Temperature Trend Patterns</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.daily.time.map((t, i) => ({time: t, temp: data.daily.temperature_2m_max[i]}))}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none'}} />
                  <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. DATA TABLE */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">Historical Log</h3>
            <div className="overflow-y-auto h-64 text-sm text-slate-400">
              {data.daily.time.map((t, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-slate-800">
                  <span>{t}</span>
                  <span className="text-white font-mono">{data.daily.temperature_2m_max[i]}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">{icon}</div>
      <div>
        <p className="text-slate-400 text-xs">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}