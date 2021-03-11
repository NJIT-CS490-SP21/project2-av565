import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import operator # for reordering the scores table

load_dotenv(find_dotenv()) # This is to load your env variables from .env

app = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models
db.create_all()

print("Created Database!")

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

def emit_db():
    all_people = db.session.query(models.Leaderboard).all()
    scores = {}
    for person in all_people:
        scores[person.username] = person.score
    scores = dict(sorted(scores.items(), key = operator.itemgetter(1), reverse=True))
    print(scores)
    socketio.emit('scores', scores, broadcast=True)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')
    emit_db()

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('chat')
def on_chat(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('chat',  data, broadcast=True, include_self=False)

user_list = []
@socketio.on('addusername')
def on_useradd(users):
    print("Here:", users)
    user_list.append(users)
    socketio.emit('added_users', users, broadcast=True, include_self=False)

logged_in_users = []
gamers = []
@socketio.on('login_user')
def on_login(usernames):
    global gamers
    global logged_in_users
    print("Usernames:", usernames)
    logged_in_users = usernames
    gamers = usernames[:2]
    socketio.emit('current_users', usernames, broadcast=True, include_self=False)

@socketio.on('add_new_user_to_db')
def add_user_to_db(user_name):
    print("Adding:", user_name)
    new_user = models.Leaderboard(username=user_name, score=None)
    db.session.add(new_user)
    db.session.commit()
    emit_db()

counter = 0
@socketio.on('game_over')
def update_on_done(who_won):
    global counter
    counter += 1
    print("Winner:", who_won)
    if counter == 1:
        winner = db.session.query(models.Leaderboard).filter_by(username=who_won).first()
        winner.score += 1
        db.session.commit()
        who_lost = [user for user in gamers if user != who_won][0]
        print("Loser:", who_lost)
        loser = db.session.query(models.Leaderboard).filter_by(username=who_lost).first()
        loser.score -= 1
        db.session.commit()
        emit_db()
    # new_user = models.Person(username=user_name, score=None)
    # db.session.add(new_user)
    # db.session.commit()

# Listen for when a cell is clicked
@socketio.on('clicked')
def on_cell_click(data):
    global counter
    if not data:
        counter = 0
    print(str(data))
    socketio.emit('clicked', data, broadcast=True, include_self=False)



# Note that we don't call app.run anymore. We call socketio.run with app arg

if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )