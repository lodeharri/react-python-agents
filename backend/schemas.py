from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List
from typing import Literal


class UsuarioBase(BaseModel):
    email: EmailStr


class UsuarioCreate(UsuarioBase):
    password: str


class UsuarioResponse(UsuarioBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MovimientoBase(BaseModel):
    tipo: Literal["ingreso", "gasto"]
    monto: float
    fecha: date
    motivo: str


class MovimientoCreate(MovimientoBase):
    pass


class MovimientoUpdate(BaseModel):
    tipo: Optional[Literal["ingreso", "gasto"]] = None
    monto: Optional[float] = None
    fecha: Optional[date] = None
    motivo: Optional[str] = None


class MovimientoResponse(MovimientoBase):
    id: int
    usuario_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class ResumenResponse(BaseModel):
    total_ingresos: float
    total_gastos: float
    ahorro_total: float
    promedio_gasto_mensual: float
    meses_con_gastos: int
