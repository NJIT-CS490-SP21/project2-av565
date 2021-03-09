from app import db

class Person(db.Model):
    
    __tablename__ = "Leaderboard"
    
    username = db.Column(db.String(80), unique=True, nullable=False, primary_key=True)
    score = db.Column(db.Integer, unique=False, default=100)

    def __repr__(self):
        return '<Person %r>' % self.username