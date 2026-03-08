const BASE_URL = 'http://localhost:8000'

function getToken() {
  return localStorage.getItem('token')
}

function getHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error de conexión' }))
    throw new Error(error.detail || 'Error en la solicitud')
  }
  return response.json()
}

export const api = {
  // Auth
  async login(email, password) {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    })
    return handleResponse(response)
  },

  async register(username, email, password) {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    return handleResponse(response)
  },

  async getMe() {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  // Movimientos
  async getMovimientos() {
    const response = await fetch(`${BASE_URL}/api/movimientos/`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  async createMovimiento(movimiento) {
    const response = await fetch(`${BASE_URL}/api/movimientos/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(movimiento)
    })
    return handleResponse(response)
  },

  async updateMovimiento(id, movimiento) {
    const response = await fetch(`${BASE_URL}/api/movimientos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(movimiento)
    })
    return handleResponse(response)
  },

  async deleteMovimiento(id) {
    const response = await fetch(`${BASE_URL}/api/movimientos/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Error al eliminar' }))
      throw new Error(error.detail)
    }
    return response.json()
  },

  async getResumen() {
    const response = await fetch(`${BASE_URL}/api/movimientos/resumen`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  }
}
