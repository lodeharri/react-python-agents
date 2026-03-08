from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import auth, movimientos

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Gastos Personales")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(movimientos.router, prefix="/api/movimientos", tags=["movimientos"])


@app.get("/")
def root():
    return {"message": "API de Gastos Personales funcionando"}
