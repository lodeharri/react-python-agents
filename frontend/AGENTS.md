# AGENTS.md - Frontend App de Gastos Personales

> **Guía modular para el agente de frontend. Lee solo el archivo necesario según la tarea.**

---

## Índice

| Archivo | Cuándo usarlo |
|---------|---------------|
| `agents/01-stack.md` | Setup inicial, estructura de archivos |
| `agents/02-formularios.md` | Crear/modificar formularios de ingresos/gastos |
| `agents/03-api.md` | Integración con backend, endpoints, auth |
| `agents/04-dashboard.md` | Gráficas, métricas, tablas, UI/UX |
| `agents/05-exito.md` | Criterios de validación |

---

## Uso

**NO leas todo el AGENTS.md**. Según tu tarea:

| Tarea | Archivo a leer |
|-------|----------------|
| Crear componentes | `01-stack.md` + `02-formularios.md` |
| Conectar API | `03-api.md` |
| Hacer dashboard | `04-dashboard.md` |
| Validar trabajo | `05-exito.md` |

---

## Quick Reference

**Tabs:** 3 (Ingresos, Gastos, Dashboard)
**Auth:** JWT Bearer token en header
**Campos:** monto, fecha, motivo
**Stack:** React 18 + Tailwind + Recharts
