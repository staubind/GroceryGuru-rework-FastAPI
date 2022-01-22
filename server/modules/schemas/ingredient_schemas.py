from sqlalchemy import Column, Integer, String
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import Boolean
from modules.pool import Base

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True, index=True)
    ingredient_id = Column(Integer, unique=True, index=True)
    recipes_id = Column(Integer, ForeignKey('recipes.id'), index=True)


