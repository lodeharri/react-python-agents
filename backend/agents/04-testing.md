# Rate Limiting

- **Biblioteca:** slowapi
- **Auth:** 10 req/min
- **Movimientos:** 60 req/min
- **Response al exceder:**
```json
{ "detail": "Rate limit exceeded: 10 per 1 minute" }
```

---

# Testing

## Framework
- pytest + pytest-asyncio
- httpx para cliente de test

## Tests Requeridos

### test_auth.py
- test_register_success
- test_register_duplicate_email
- test_login_success
- test_login_invalid_credentials
- test_jwt_token_valid

### test_movimientos.py
- test_create_movimiento_authenticated
- test_create_movimiento_unauthenticated
- test_get_movimientos
- test_get_resumen

### test_rate_limit.py
- test_rate_limit_exceeded
- test_rate_limit_auth_tighter

## Estructura
```
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_movimientos.py
│   └── test_rate_limit.py
```
