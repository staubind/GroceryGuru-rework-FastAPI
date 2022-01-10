from ..pool import SessionLocal

# a dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


