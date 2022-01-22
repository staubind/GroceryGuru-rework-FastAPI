from sqlalchemy import Column, Integer, String
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.sqltypes import Boolean
from modules.pool import Base

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True) # how make it a foreign key???
    recipe_id = Column(Integer, ForeignKey('recipes.id'), index=True)
    in_cart = Column(Boolean)
    servings =Column(Integer)

