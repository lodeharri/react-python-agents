import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Wallet, Loader2 } from 'lucide-react'

const COLORS = {
  ingreso: '#10b981',
  gasto: '#f43f5e'
}

export default function Dashboard({ refreshKey }) {
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [refreshKey])

  async function fetchData() {
    setLoading(true)
    try {
      const data = await api.getMovimientos()
      setMovimientos(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const ingresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + m.monto, 0)

  const gastos = movimientos
    .filter(m => m.tipo === 'gasto')
    .reduce((sum, m) => sum + m.monto, 0)

  const balance = ingresos - gastos

  // Data for pie chart
  const pieData = [
    { name: 'Ingresos', value: ingresos, tipo: 'ingreso' },
    { name: 'Gastos', value: gastos, tipo: 'gasto' }
  ].filter(d => d.value > 0)

  // Data for bar chart (last 6 months)
  const getLast6MonthsData = () => {
    const months = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      const monthIngresos = movimientos
        .filter(m => m.tipo === 'ingreso' && m.fecha.startsWith(monthKey))
        .reduce((sum, m) => sum + m.monto, 0)
      
      const monthGastos = movimientos
        .filter(m => m.tipo === 'gasto' && m.fecha.startsWith(monthKey))
        .reduce((sum, m) => sum + m.monto, 0)
      
      months.push({
        name: date.toLocaleDateString('es-ES', { month: 'short' }),
        Ingresos: monthIngresos,
        Gastos: monthGastos
      })
    }
    
    return months
  }

  const barData = getLast6MonthsData()

  // Recent movements
  const recentMovimientos = [...movimientos]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5)

  function formatMonto(monto) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(monto)
  }

  function formatDate(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-slate-500 text-sm">Total Ingresos</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatMonto(ingresos)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-rose-100">
              <TrendingDown className="w-5 h-5 text-rose-600" />
            </div>
            <span className="text-slate-500 text-sm">Total Gastos</span>
          </div>
          <p className="text-2xl font-bold text-rose-600">{formatMonto(gastos)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <Wallet className="w-5 h-5 text-slate-600" />
            </div>
            <span className="text-slate-500 text-sm">Balance</span>
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatMonto(balance)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribución Ingresos vs Gastos</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.tipo]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatMonto(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-slate-400">
              No hay datos para mostrar
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Últimos 6 Meses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => formatMonto(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="Ingresos" fill={COLORS.ingreso} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gastos" fill={COLORS.gasto} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Movimientos Recientes</h3>
        {recentMovimientos.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No hay movimientos registrados</p>
        ) : (
          <div className="space-y-3">
            {recentMovimientos.map((movimiento) => (
              <div
                key={movimiento.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${movimiento.tipo === 'ingreso' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    {movimiento.tipo === 'ingreso' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{movimiento.motivo}</p>
                    <p className="text-xs text-slate-400">{formatDate(movimiento.fecha)}</p>
                  </div>
                </div>
                <span className={`font-semibold ${movimiento.tipo === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {movimiento.tipo === 'ingreso' ? '+' : '-'}{formatMonto(movimiento.monto)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
