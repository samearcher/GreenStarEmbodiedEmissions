from sqlalchemy import event
from enum import Enum, unique

from typing import Union, Optional, Any

import pandas as pd
from sqlmodel import Field, SQLModel

from app.crud_methods import ActiveRecordMixin

@unique
class Material_classes(Enum):
    STRUCTURE = 'STRUCTURE' 
    ENCLOSURE = 'ENCLOSURE' 
    INTERIOR = 'INTERIOR'
    FINISH = 'FINISH'
    SERVICES = 'SERVICES'

class Data_quality(Enum):
    A = 'A'
    B = 'B'
    C = 'C'
    D = 'D'
    E = 'E'
    F = 'F'
    G = 'G'
    not_defined = 'not_defined'


class A1_A3_Data_Base(SQLModel):
    material_class: Optional[Material_classes] = Field(default=Material_classes.ENCLOSURE)
    sheet_title: Optional[str] = Field(default='Something')
    table_heading: Optional[str] = Field(default='Else')
    table_subheading: Optional[str] = Field(default='Again')
    product_code: Optional[str] = Field(default='P1234')
    material: Optional[str] = Field(default='Try it')
    qty_basis: Optional[str] = Field(default='kg')
    a1_a3_CO2: Optional[float] = Field(default=0)
    a1_a3_energy_total: Optional[float] = Field(default=0)
    a1_a3_energy_non_renewable: Optional[float] = Field(default=0)
    a1_a3_energy_renewable: Optional[float] = Field(default=0)
    notes: Optional[str] = Field(default='ENCLOSURE')
    data_quality: Optional[Data_quality] = Field(default=Data_quality.A)
    density: Optional[float] = Field(default=0)
    area_density: Optional[float] = Field(default=0)
    linear_density: Optional[float] = Field(default=0)
    mass_per_unit: Optional[float] = Field(default=0)

class A1_A3_Data_Create(A1_A3_Data_Base):
    pass

class A1_A3_Data(A1_A3_Data_Base, ActiveRecordMixin, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

""" 

@event.listens_for(Mvhr_units, 'before_insert')
@event.listens_for(Mvhr_units, 'before_update')
def mvhr_defaults(mapper, connection, mvhr):
    mvhr.calced = mvhr.range_high * mvhr.range_low

"""