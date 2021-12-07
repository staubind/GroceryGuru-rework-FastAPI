from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.orm.session import _SessionClassMethods
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from typing import List, Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv(os.path.dirname(os.path.dirname(os.getcwd()))+'/.env')


# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@pg_server_name/database_name"
SQLALCHEMY_DATABASE_URL = os.environ.get('DATABASE_URL')

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String) 

class UserBase(BaseModel):
    username: str

    class Config:
        orm_mode = True
    
class UserCreate(UserBase):
    password: str

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    fake_password = user.password
    db_user = User(username=user.username, password=fake_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

with SessionLocal() as db:
    try:
        create_user(db, User(username='marko6', password='123abc'))
    finally:
        db.close()