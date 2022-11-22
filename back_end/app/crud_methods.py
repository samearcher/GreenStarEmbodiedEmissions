import logging
from typing import Union, Optional, Any

import pandas as pd
from sqlmodel import Field, Session, SQLModel, select
from sqlalchemy.exc import IntegrityError, NoResultFound, OperationalError
from sqlalchemy.orm.exc import FlushError


class ActiveRecordMixin():
    __config__ = None

    @property
    def primary_key(self):
        return self.__mapper__.primary_key_from_instance(self)

    @classmethod
    def first(cls, session):
        statement = select(cls)
        return session.execute(statement).first()

    @classmethod
    def get_by_id(cls, session, id: int):
        obj = session.get(cls, id)
        return obj

    @classmethod
    def first_by_field(cls, session, field: str, value: Any):
        return cls.first_by_fields(session, {field: value})

    @classmethod
    def one_by_field(cls, session, field: str, value: Any):
        return cls.one_by_fields(session, {field: value})

    @classmethod
    def first_by_fields(cls, session, fields: dict):
        statement = select(cls)
        for key, value in fields.items():
            statement = statement.where(getattr(cls, key) == value)
        try:
            return session.execute(statement).first()
        except NoResultFound:
            logging.error(f"{cls}: first_by_fields failed, NoResultFound")
            return None

    @classmethod
    def one_by_fields(cls, session, fields: dict):
        statement = select(cls)
        for key, value in fields.items():
            statement = statement.where(getattr(cls, key) == value)
        try:
            return session.execute(statement).one()
        except NoResultFound:
            logging.error(f"{cls}: one_by_fields failed, NoResultFound")
            return None

    @classmethod
    def all_by_field(cls, session, **kwargs):
        print(kwargs)
        return session.query(cls).filter_by(**kwargs).all()

    @classmethod
    def all_by_fields(cls, session, fields: dict):
        statement = select(cls)
        for key, value in fields.items():
            statement = statement.where(getattr(cls, key) == value)
        return session.execute(statement).all()

    @classmethod
    def convert_without_saving(cls, source: Union[dict, SQLModel], update: Optional[dict] = None) -> SQLModel:
        # try:
        if isinstance(source, SQLModel):
            obj = cls.from_orm(source, update=update)
        elif isinstance(source, dict):
            obj = cls.parse_obj(source, update=update)
        # except ValidationError:
        #    return None
        return obj

    @classmethod
    def create(cls, session, source: Union[dict, SQLModel], update: Optional[dict] = None) -> Optional[SQLModel]:
        obj = cls.convert_without_saving(source, update)
        if obj is None:
            return None
        if obj.save(session):
            return obj
        return None

    @classmethod
    def create_or_update(cls, session, source: Union[dict, SQLModel], update: Optional[dict] = None)\
            -> Optional[SQLModel]:
        obj = cls.convert_without_saving(source, update)
        if obj is None:
            return None
        pk = cls.__mapper__.primary_key_from_instance(obj)
        if pk[0] is not None:
            existing = session.get(cls, pk)
            if existing is None:
                return None  # Error
            else:
                existing.update(session, obj)  # Update
                return existing
        else:
            return cls.create(session, obj)  # Create

    @classmethod
    def count(cls, session) -> int:
        return len(cls.all(session))

    def refresh(self, session):
        session.refresh(self)

    def save(self, session) -> bool:
        session.add(self)
        try:
            session.commit()
            session.refresh(self)
            return True
        except (IntegrityError, OperationalError, FlushError) as e:
            logging.error(e)
            session.rollback()
            return False

    def update(self, session, source: Union[dict, SQLModel]):
        if isinstance(source, SQLModel):
            source = source.dict(exclude_unset=True)

        for key, value in source.items():
            setattr(self, key, value)
        session.commit()
        

    def delete(self, session):
        session.delete(self)
        session.commit()

    @classmethod
    def all(cls, session):
        return session.query(cls).all()

    @classmethod
    def delete_all(cls, session):
        for obj in cls.all(session):
            obj.delete(session)

    @classmethod
    def to_pandas(cls, session) -> pd.DataFrame:
        records = cls.all(session)
        return pd.json_normalize([r.dict() for r in records], sep='_')