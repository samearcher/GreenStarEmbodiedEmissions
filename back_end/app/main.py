from fastapi import FastAPI, Response, status, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from typing import List

from sqlalchemy.orm import Session

from .config import Settings, get_settings

settings = get_settings()

from app.models import (
    A1_A3_Data, 
    A1_A3_Data_Create,
    Material_classes,
    Data_quality,
)

from .database import engine, Base

from app.database import (
    get_session
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://192.168.1.9:8000/"
    "http://192.168.1.9:3000/"
    "http://192.168.1.9/"
    "http://192.168.1.4"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/', response_class=RedirectResponse, include_in_schema=False)
async def docs():
    return RedirectResponse(url='/docs')


@app.post("/a1_a3_data/", response_model=A1_A3_Data)
def create_a1_a3_data(a1_a3_data: A1_A3_Data_Create, session: Session = Depends(get_session)):
    return A1_A3_Data.create(session, a1_a3_data)


@app.get("/a1_a3_data/all", response_model=List[A1_A3_Data])
def read_all_a1_a3_data(session: Session = Depends(get_session)):
    return A1_A3_Data.all(session)


@app.get("/a1_a3_data/{material_class}", response_model=List[A1_A3_Data])
def read_filtered_a1_a3_data(material_class: Material_classes, session: Session = Depends(get_session)):
    return A1_A3_Data.all_by_field(session, material_class=material_class)


@app.get("/static_data")
def read_material_classes():
    return { 
        'material_classes' : [material_class.value for material_class in Material_classes ], 
        'data_quality' : [data_quality.value for data_quality in Data_quality] }


@app.delete("/delete_a1_a3_data/{id}")
def delete_a1_a3_data(id: int, session: Session = Depends(get_session)):
    a1_a3_data_db = A1_A3_Data.get_by_id(session, id)
    a1_a3_data_db.delete(session)
    return {"ok": True}


@app.get("/a1_a3_data/{id}", response_model=A1_A3_Data)
def read_a1_a3_data(id: int, session: Session = Depends(get_session)):
    return A1_A3_Data.get_by_id(session, id)


@app.put("/a1_a3_data/", response_model=A1_A3_Data)
def update_a1_a3_data(a1_a3_data: A1_A3_Data, session: Session = Depends(get_session)):
    a1_a3_data_db = A1_A3_Data.get_by_id(session, a1_a3_data.id)
    a1_a3_data_db.update(session, a1_a3_data)
    a1_a3_data_db.refresh(session)
    return a1_a3_data_db