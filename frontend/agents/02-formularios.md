# Requerimientos Funcionales

## 1. Navigation (3 Tabs)
- **Tab 1 - Ingresos:** Formulario para registrar entradas
- **Tab 2 - Gastos:** Formulario para registrar salidas
- **Tab 3 - Dashboard:** Gráficos, métricas y tablas

## 2. Formularios

### Campos obligatorios
| Campo | Tipo | Validación |
|-------|------|------------|
| monto | number | > 0 |
| fecha | date | no futura |
| motivo | string | no vacío |

### Comportamiento
- Validar antes de enviar
- Mostrar mensaje de éxito
- Limpiar formulario tras envío exitoso
