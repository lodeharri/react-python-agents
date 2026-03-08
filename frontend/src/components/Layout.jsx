import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import MovimientoForm from './MovimientoForm'
import MovimientoList from './MovimientoList'
import Dashboard from './Dashboard'
import { TrendingUp, TrendingDown, LayoutDashboard } from 'lucide-react'

const tabs = [
  { path: '/', label: 'Ingresos', icon: TrendingUp, color: 'emerald' },
  { path: '/gastos', label: 'Gastos', icon: TrendingDown, color: 'rose' },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'slate' }
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [refreshKey, setRefreshKey] = useState(0)

  function handleMovimientoCreated() {
    setRefreshKey(prev => prev + 1)
  }

  const currentTab = tabs.find(tab => tab.path === location.pathname) || tabs[0]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = location.pathname === tab.path
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap
                  ${isActive 
                    ? tab.color === 'emerald' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : tab.color === 'rose'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-200 text-slate-800'
                    : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }
                `}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MovimientoForm tipo="ingreso" onSuccess={handleMovimientoCreated} />
                  <MovimientoList tipo="ingreso" refreshKey={refreshKey} />
                </div>
              } 
            />
            <Route 
              path="/gastos" 
              element={
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MovimientoForm tipo="gasto" onSuccess={handleMovimientoCreated} />
                  <MovimientoList tipo="gasto" refreshKey={refreshKey} />
                </div>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard refreshKey={refreshKey} />
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}
