# Endpoints de API

## Auth

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Login → JWT |

### POST /api/auth/register
```json
// Request
{ "email": "user@ejemplo.com", "password": "password123" }
// Response 201
{ "id": 1, "email": "user@ejemplo.com", "created_at": "2026-03-08T12:00:00" }
```

### POST /api/auth/login
```json
// Request
{ "email": "user@ejemplo.com", "password": "password123" }
// Response 200
{ "access_token": "eyJ...", "token_type": "bearer" }
```

## Movimientos (requieren JWT)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/movimientos` | Crear movimiento |
| GET | `/api/movimientos` | Listar del usuario |
| GET | `/api/movimientos/resumen` | Métricas |

### POST /api/movimientos
```json
// Headers: Authorization: Bearer <token>
// Request
{ "tipo": "ingreso"|"gasto", "monto": 1500.00, "fecha": "2026-03-08", "motivo": "Salario" }
// Response 201
{ "id": 1, "usuario_id": 1, "tipo": "ingreso", "monto": 1500.00, "fecha": "2026-03-08", "motivo": "Salario", "created_at": "..." }
```

### GET /api/movimientos
```json
// Response 200
[
  { "id": 1, "tipo": "ingreso", "monto": 5000.00, "fecha": "2026-03-01", "motivo": "Salario", "created_at": "..." },
  { "id": 2, "tipo": "gasto", "monto": 150.00, "fecha": "2026-03-08", "motivo": "Servicios", "created_at": "..." }
]
```

### GET /api/movimientos/resumen
```json
// Response 200
{
  "total_ingresos": 15000.00,
  "total_gastos": 4500.00,
  "ahorro_total": 10500.00,
  "promedio_gasto_mensual": 1500.00,
  "meses_con_gastos": 3
}
```

---

# Autenticación JWT

- **Algoritmo:** HS256
- **Expiración:** 60 minutos
- **Header:** `Authorization: Bearer <token>`
