# Integración con Backend

## Auth

### POST /api/auth/register
```json
// Request
{ "email": "user@ejemplo.com", "password": "password123" }
// Response
{ "id": 1, "email": "user@ejemplo.com", "created_at": "2026-03-08T12:00:00" }
```

### POST /api/auth/login
```json
// Request
{ "email": "user@ejemplo.com", "password": "password123" }
// Response
{ "access_token": "eyJ...", "token_type": "bearer" }
```

**Token:** Guardar en localStorage. Enviar en header: `Authorization: Bearer <token>`

## Movimientos

### POST /api/movimientos
```json
// Headers: Authorization: Bearer <token>
// Request
{ "tipo": "ingreso"|"gasto", "monto": 1500.00, "fecha": "2026-03-08", "motivo": "Salario" }
// Response
{ "id": 1, "usuario_id": 1, "tipo": "ingreso", "monto": 1500.00, "fecha": "2026-03-08", "motivo": "Salario", "created_at": "..." }
```

### GET /api/movimientos
```json
// Response
[
  { "id": 1, "tipo": "ingreso", "monto": 5000.00, "fecha": "2026-03-01", "motivo": "Salario", "created_at": "..." },
  { "id": 2, "tipo": "gasto", "monto": 150.00, "fecha": "2026-03-08", "motivo": "Servicios", "created_at": "..." }
]
```

### GET /api/movimientos/resumen
```json
// Response
{ "total_ingresos": 15000.00, "total_gastos": 4500.00, "ahorro_total": 10500.00, "promedio_gasto_mensual": 1500.00, "meses_con_gastos": 3 }
```
