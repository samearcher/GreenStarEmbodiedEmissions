import pandas as pd
import csv

from app.database import SessionLocal
from app import config
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

settings = config.get_settings()

engine = create_engine(
    settings.sqlalchemy_database_uri
)

data = pd.read_csv("~/Documents/fastApi_React/back_end/branz_green_star_combined_data.csv")

data.index = data['id']
data = data.drop(['id'], axis=1)

data.to_sql('a1_a3_data', con=engine, if_exists='append')

