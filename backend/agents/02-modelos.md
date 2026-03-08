# Modelos de Base de Datos

## Tabla: usuarios
| Campo | Tipo | Notas |
|-------|------|-------|
| id | Integer | PK, auto-increment |
| email | String | unique, index |
| password_hash | String | bcrypt |
| created_at | DateTime | default=utcnow |

## Tabla: movimientos
| Campo | Tipo | Notas |
|-------|------|-------|
| id | Integer | PK, auto-increment |
| usuario_id | Integer | FK → usuarios.id |
| tipo | String | "ingreso" o "gasto" |
| monto | Float | |
| fecha | Date | YYYY-MM-DD |
| motivo | String | |
| created_at | DateTime | default=utcnow |
