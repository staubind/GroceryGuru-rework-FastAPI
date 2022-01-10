from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from modules.pool import Base
from sqlalchemy.orm import Session
from pydantic import BaseModel

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