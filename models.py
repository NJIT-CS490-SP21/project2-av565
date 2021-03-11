from app import db

class Leaderboard(db.Model):
    
    # __tablename__ = "leaderboard"
    
    username = db.Column(db.String(80), unique=True, nullable=False, primary_key=True)
    score = db.Column(db.Integer, unique=False, default=100)
    
    __mapper_args__ =  {
        "order_by": score
    }
    
    def __repr__(self):
        return '<Username %r>' % self.username