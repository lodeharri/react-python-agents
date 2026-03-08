from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_

from database import get_db
from models import Usuario, Movimiento
from schemas import (
    MovimientoCreate,
    MovimientoUpdate,
    MovimientoResponse,
    ResumenResponse
)
from auth import get_current_user

router = APIRouter()


def aplicar_filtros(query, mes: Optional[int] = None, anio: Optional[int] = None):
    """Aplica filtros de mes y año a la query de movimientos"""
    if mes and anio:
        # Filtrar por mes específico usando rango de fechas
        fecha_inicio = date(anio, mes, 1)
        if mes == 12:
            fecha_fin = date(anio + 1, 1, 1)
        else:
            fecha_fin = date(anio, mes + 1, 1)
        query = query.filter(and_(
            Movimiento.fecha >= fecha_inicio,
            Movimiento.fecha < fecha_fin
        ))
    elif anio:
        # Filtrar solo por año usando rango de fechas
        query = query.filter(and_(
            Movimiento.fecha >= date(anio, 1, 1),
            Movimiento.fecha < date(anio + 1, 1, 1)
        ))
    
    return query


@router.post("/", response_model=MovimientoResponse, status_code=status.HTTP_201_CREATED)
def crear_movimiento(
    movimiento: MovimientoCreate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    nuevo_movimiento = Movimiento(
        usuario_id=current_user.id,
        tipo=movimiento.tipo,
        monto=movimiento.monto,
        fecha=movimiento.fecha,
        motivo=movimiento.motivo
    )
    db.add(nuevo_movimiento)
    db.commit()
    db.refresh(nuevo_movimiento)
    return nuevo_movimiento


@router.get("/", response_model=List[MovimientoResponse])
def listar_movimientos(
    mes: Optional[int] = Query(None, ge=1, le=12, description="Mes (1-12)"),
    anio: Optional[int] = Query(None, description="Año (ej: 2026)"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Movimiento).filter(
        Movimiento.usuario_id == current_user.id
    )
    
    query = aplicar_filtros(query, mes, anio)
    
    movimientos = query.order_by(Movimiento.fecha.desc()).all()
    return movimientos


@router.get("/resumen", response_model=ResumenResponse)
def obtener_resumen(
    mes: Optional[int] = Query(None, ge=1, le=12, description="Mes (1-12)"),
    anio: Optional[int] = Query(None, description="Año (ej: 2026)"),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Movimiento).filter(
        Movimiento.usuario_id == current_user.id
    )
    
    query = aplicar_filtros(query, mes, anio)
    movimientos = query.all()
    
    total_ingresos = sum(m.monto for m in movimientos if m.tipo == "ingreso")
    total_gastos = sum(m.monto for m in movimientos if m.tipo == "gasto")
    ahorro_total = total_ingresos - total_gastos
    
    fechas = set(m.fecha for m in movimientos if m.tipo == "gasto")
    meses = set((f.year, f.month) for f in fechas)
    meses_con_gastos = len(meses)
    
    promedio_gasto_mensual = total_gastos / meses_con_gastos if meses_con_gastos > 0 else 0.0
    
    return ResumenResponse(
        total_ingresos=total_ingresos,
        total_gastos=total_gastos,
        ahorro_total=ahorro_total,
        promedio_gasto_mensual=promedio_gasto_mensual,
        meses_con_gastos=meses_con_gastos
    )


@router.get("/{movimiento_id}", response_model=MovimientoResponse)
def obtener_movimiento(
    movimiento_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    movimiento = db.query(Movimiento).filter(
        Movimiento.id == movimiento_id,
        Movimiento.usuario_id == current_user.id
    ).first()
    if not movimiento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movimiento no encontrado"
        )
    return movimiento


@router.put("/{movimiento_id}", response_model=MovimientoResponse)
def actualizar_movimiento(
    movimiento_id: int,
    movimiento_update: MovimientoUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    movimiento = db.query(Movimiento).filter(
        Movimiento.id == movimiento_id,
        Movimiento.usuario_id == current_user.id
    ).first()
    if not movimiento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movimiento no encontrado"
        )
    
    update_data = movimiento_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(movimiento, key, value)
    
    db.commit()
    db.refresh(movimiento)
    return movimiento


@router.delete("/{movimiento_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_movimiento(
    movimiento_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    movimiento = db.query(Movimiento).filter(
        Movimiento.id == movimiento_id,
        Movimiento.usuario_id == current_user.id
    ).first()
    if not movimiento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movimiento no encontrado"
        )
    db.delete(movimiento)
    db.commit()
    return None
