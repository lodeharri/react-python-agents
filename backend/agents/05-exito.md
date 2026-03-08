# Dependencies (requirements.txt)

```
fastapi==0.109.0
uvicorn==0.27.0
sqlalchemy==2.0.25
pydantic==2.5.3
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
slowapi==0.1.9
pytest==8.0.0
pytest-asyncio==0.23.0
httpx==0.26.0
```

---

# Criterios de Éxito

1. Servidor inicia en puerto 8000
2. Usuario puede registrarse e iniciar sesión
3. JWT se genera y valida correctamente
4. Movimientos se crean y asocian al usuario
5. GET devuelve datos del usuario actual
6. Métricas se calculan correctamente
7. DB SQLite se crea automáticamente
8. Tests pasan (auth, movimientos, rate limiting)
9. Rate limiting funciona (auth: 10/min, movimientos: 60/min)
