import { useState } from 'react'
import { api } from '../services/api'
import { TrendingUp, TrendingDown, Plus, Loader2 } from 'lucide-react'

export default function MovimientoForm({ tipo, onSuccess }) {
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [motivo, setMotivo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isIngreso = tipo === 'ingreso'
  const colorClass = isIngreso ? 'emerald' : 'rose'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!monto || parseFloat(monto) <= 0) {
      setError('Por favor ingresa un monto válido')
      return
    }

    if (!motivo.trim()) {
      setError('Por favor ingresa un motivo')
      return
    }

    setLoading(true)

    try {
      await api.createMovimiento({
        monto: parseFloat(monto),
        fecha,
        motivo: motivo.trim(),
        tipo
      })
      
      setMonto('')
      setMotivo('')
      setFecha(new Date().toISOString().split('T')[0])
      setSuccess(true)
      
      if (onSuccess) {
        onSuccess()
      }
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Error al guardar el movimiento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl bg-${colorClass}-100`}>
          {isIngreso ? (
            <TrendingUp className={`w-6 h-6 text-${colorClass}-600`} />
          ) : (
            <TrendingDown className={`w-6 h-6 text-${colorClass}-600`} />
          )}
        </div>
        <h2 className="text-xl font-semibold text-slate-800">
          Agregar {isIngreso ? 'Ingreso' : 'Gasto'}
        </h2>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          ¡{isIngreso ? 'Ingreso' : 'Gasto'} registrado correctamente!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="monto" className="block text-sm font-medium text-slate-700 mb-2">
            Monto
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              id="monto"
              type="number"
              step="0.01"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
              className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-slate-700 mb-2">
            Fecha
          </label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="motivo" className="block text-sm font-medium text-slate-700 mb-2">
            Motivo / Descripción
          </label>
          <input
            id="motivo"
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder={isIngreso ? 'Ej: Salario, Freelance, Venta...' : 'Ej: Comida, Transporte, Servicios...'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3.5 px-4 text-white font-medium rounded-xl transition-all duration-200 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
            ${isIngreso ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}
          `}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Plus size={20} />
              Agregar {isIngreso ? 'Ingreso' : 'Gasto'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}
