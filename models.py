"""
Lays out the different table structures to be created within app.py
"""
# pylint: disable=E1101, C0413, W1508, R0903, W0603

from app import DB

class Leaderboard(DB.Model):
    """
    Class used to define the structure of the Leaderboard table. Contains a username and a score
    column where:
        username: unique username string (max len: 80).
        score: integer representing the score of the corresponding username.
    """
    # __tablename__ = "leaderboard"

    username = DB.Column(DB.String(80),
                         unique=True,
                         nullable=False,
                         primary_key=True)
    score = DB.Column(DB.Integer, unique=False, default=100)

    __mapper_args__ = {"order_by": score}

    def __repr__(self):
        return '<Username %r>' % self.username

    def __str__(self):
        return "Table name: {}\nColumns: {}, {}".format(
            "Leaderboard", "Username", "Score")
