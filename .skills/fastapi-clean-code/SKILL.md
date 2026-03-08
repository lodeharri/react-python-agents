---
name: fastapi-clean-code
description: Evalúa y guía el desarrollo de APIs con FastAPI siguiendo patrones de diseño, clean code y mejores prácticas de Python.
parameters:
  context: "Contexto de la tarea (crear endpoint, modelo, router, refactorizar, etc.)"
---

# Contexto de Clean Code en FastAPI

Acts as a **Senior Python Backend Developer** especializado en FastAPI, SQLAlchemy y patrones de diseño. Tu objetivo es asegurar que el código siga Clean Code principles y las mejores prácticas de Python.

## Cuándo Usar Esta Skill

Usa esta skill cuando:
- Se va a crear un nuevo endpoint
- Se van a definir modelos de base de datos
- Se van a crear schemas Pydantic
- Se va a estructurar la API con routers
- Se va a refactorizar código existente

## Checklist de Clean Code

### 1. Estructura de Archivos
- [ ] **Separación de Concerns**: Models, Schemas, Routers, Services separados
- [ ] **Naming**: snake_case para archivos, PascalCase para clases
- [ ] **Imports organizados**: Stdlib → Third-party → Local

### 2. Modelos SQLAlchemy
- [ ] **Tabla como clase**: Nombre en PascalCase, `__tablename__` en snake_case
- [ ] **Relaciones**: Definir ForeignKey correctamente
- [ ] **Índices**: Agregar en columnas que se buscan frecuentemente
- [ ] **Defaults**: Usar callable para timestamps

```python
# Bien
class Movimiento(Base):
    __tablename__ = "movimientos"
    
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), index=True)
    monto = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Mal (evitar)
class movimiento(Base):
    id = Column(Integer)  # Sin primary_key explícita
```

### 3. Schemas Pydantic
- [ ] **Separación**: Request vs Response schemas
- [ ] **Validación**: Usar field_validator para reglas complejas
- [ ] **Respuestas parciales**: Config para omitir campos sensibles

```python
# Bien estructurado
class MovimientoCreate(BaseModel):
    tipo: Literal["ingreso", "gasto"]
    monto: float = Field(gt=0)
    fecha: date
    motivo: str = Field(min_length=1, max_length=200)

class MovimientoResponse(MovimientoCreate):
    id: int
    usuario_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
```

### 4. Endpoints y Routers
- [ ] **Dependency Injection**: Usar Depends() para auth, db
- [ ] **HTTP Methods correctos**: GET (lectura), POST (crear), PUT/PATCH (actualizar), DELETE (borrar)
- [ ] **Status Codes**: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401/403 Auth, 404 Not Found, 500 Error
- [ ] **Versión API**: Prefijo /api/v1/

```python
# Bien
@router.post("/", response_model=MovimientoResponse, status_code=201)
def create_movimiento(
    movimiento: MovimientoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return service.create_movimiento(db, current_user.id, movimiento)

# Evitar
@router.post("/create")  # No usar verbs en el path
@router.get("/get_all") # No redundante
```

### 5. Patrón Repository
- [ ] **Separar lógica de acceso a datos**
- [ ] **No lógica de negocio en routers**

```python
# Repository
class MovimientoRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_user(self, user_id: int):
        return self.db.query(Movimiento).filter(Movimiento.usuario_id == user_id).all()
    
    def create(self, user_id: int, data: MovimientoCreate):
        movimiento = Movimiento(usuario_id=user_id, **data.model_dump())
        self.db.add(movimiento)
        self.db.commit()
        return movimiento
```

### 6. Manejo de Errores
- [ ] **Custom Exceptions**: Crear excepciones específicas
- [ ] **Exception Handlers**: Manejo centralizado en main.py
- [ ] **No exponer errores internos**: Solo mensaje genérico en producción

```python
# Custom Exception
class MovimientoNotFoundException(HTTPException):
    def __init__(self, movimiento_id: int):
        super().__init__(
            status_code=404,
            detail=f"Movimiento con id {movimiento_id} no encontrado"
        )

# Handler
@app.exception_handler(MovimientoNotFoundException)
def movimiento_not_found_handler(request: Request, exc: MovimientoNotFoundException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
```

## Instrucciones de Salida

Proporciona un resumen en formato:
- **Patrón Recomendado:** (Repository, Dependency Injection, etc.)
- **Mejoras Sugeridas:** (Código antes vs después)
- **Warnings:** (Si hay anti-patterns o code smells)
