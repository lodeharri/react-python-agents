import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { TrendingUp, TrendingDown, Trash2, Edit2, X, Check } from 'lucide-react'

export default function MovimientoList({ tipo, refreshKey }) {
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const isIngreso = tipo === 'ingreso'

  useEffect(() => {
    fetchMovimientos()
  }, [tipo, refreshKey])

  async function fetchMovimientos() {
    setLoading(true)
    try {
      const data = await api.getMovimientos()
      const filtered = data
        .filter(m => m.tipo === tipo)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      setMovimientos(filtered)
    } catch (error) {
      console.error('Error fetching movimientos:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Estás seguro de eliminar este movimiento?')) return
    
    try {
      await api.deleteMovimiento(id)
      setMovimientos(prev => prev.filter(m => m.id !== id))
    } catch (error) {
      alert(error.message)
    }
  }

  function startEdit(movimiento) {
    setEditingId(movimiento.id)
    setEditData({
      monto: movimiento.monto,
      fecha: movimiento.fecha,
      motivo: movimiento.motivo
    })
  }

  async function saveEdit(id) {
    try {
      const updated = await api.updateMovimiento(id, {
        ...editData,
        monto: parseFloat(editData.monto)
      })
      setMovimientos(prev => prev.map(m => m.id === id ? updated : m))
      setEditingId(null)
      setEditData({})
    } catch (error) {
      alert(error.message)
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setEditData({})
  }

  function formatDate(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  function formatMonto(monto) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(monto)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl ${isIngreso ? 'bg-emerald-100' : 'bg-rose-100'}`}>
          {isIngreso ? (
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          ) : (
            <TrendingDown className="w-6 h-6 text-rose-600" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-slate-800">
          {isIngreso ? 'Ingresos' : 'Gastos'} Recientes
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : movimientos.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg">No hay {isIngreso ? 'ingresos' : 'gastos'} registrados</p>
          <p className="text-sm mt-1">Agrega uno usando el formulario</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {movimientos.map((movimiento) => (
            <div
              key={movimiento.id}
              className="group p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 animate-slide-in"
            >
              {editingId === movimiento.id ? (
                <div className="space-y-3">
                  <input
                    type="number"
                    step="0.01"
                    value={editData.monto}
                    onChange={(e) => setEditData({ ...editData, monto: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <input
                    type="date"
                    value={editData.fecha}
                    onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <input
                    type="text"
                    value={editData.motivo}
                    onChange={(e) => setEditData({ ...editData, motivo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(movimiento.id)}
                      className="flex-1 py-1.5 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 flex items-center justify-center gap-1"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-300 flex items-center justify-center gap-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold ${isIngreso ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isIngreso ? '+' : '-'}{formatMonto(movimiento.monto)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(movimiento.fecha)}
                      </span>
                    </div>
                    <p className="text-slate-700 truncate">{movimiento.motivo}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(movimiento)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(movimiento.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
