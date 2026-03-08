# AGENTS.md - Backend App de Gastos Personales

> **Guía modular para el agente de backend. Lee solo el archivo necesario según la tarea.**

---

## Índice

| Archivo | Cuándo usarlo |
|---------|---------------|
| `agents/01-stack.md` | Setup inicial, estructura |
| `agents/02-modelos.md` | Modelos SQLAlchemy |
| `agents/03-endpoints.md` | API endpoints, auth JWT |
| `agents/04-testing.md` | Rate limiting, tests |
| `agents/05-exito.md` | Dependencias, criterios |

---

## Uso

**NO leas todo el AGENTS.md**. Según tu tarea:

| Tarea | Archivo a leer |
|-------|----------------|
| Setup inicial | `01-stack.md` |
| Crear modelos | `02-modelos.md` |
| Implementar API | `03-endpoints.md` |
| Agregar tests | `04-testing.md` |
| Validar | `05-exito.md` |

---

## Quick Reference

**DB:** SQLite + SQLAlchemy
**Auth:** JWT (HS256, 60 min)
**Rate Limit:** 10/min auth, 60/min movimientos
**Puerto:** 8000
