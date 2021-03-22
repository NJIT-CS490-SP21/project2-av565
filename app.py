"""
This is the main server/backend that allows different clients to talk to each other.
"""
# pylint: disable=E1101, C0413, W1508, R0903, W0603

import os
import operator  # for reordering the scores table
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())  # This is to load your env variables from .env

APP = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models

DB.create_all()

LOGGED_IN_USERS = []
GAMERS = []
COUNTER = 0

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})
SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """
    Initial location of the website, and where the index file is located.
    """
    return send_from_directory('./build', filename)


def configure_db(data_base):
    """
    Configure the database, moving everything into a dictionary of username: score
    key, value pairs.
    """
    scores = {}
    for person in data_base:
        scores[person.username] = person.score
    scores = dict(
        sorted(scores.items(), key=operator.itemgetter(1), reverse=True))
    return scores


def emit_db():
    """
    Emits the database to the clients so that their leaderboards are up-to-date.
    """
    all_people = DB.session.query(models.Leaderboard).all()
    scores = configure_db(all_people)
    SOCKETIO.emit('scores', scores, broadcast=True)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    """
    Supposed to run whenever the client 'connects'. Runs several times when being used.
    """
    print('User connected!')
    emit_db()


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    """
    Supposed to run whenever the client  'disconnects'. This too, just like on_connect() runs
    several times when being used.
    """
    print('User disconnected!')


# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@SOCKETIO.on('chat')
def on_chat(data):  # data is whatever arg you pass in your emit call on client
    """
    Called whenever a 'chat' event occurs. Runs when the client "chats" with another client.
    :param data: The message string that the client enters.
    :return: None.
    """
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('chat', data, broadcast=True, include_self=False)


USER_LIST = []


@SOCKETIO.on('addusername')
def on_useradd(users):
    """
    Called whenever an 'addusername' event occurs. Runs when a client logs in with a username that
    is new to the database of players.
    :param users: The username string that is supposed to be added to the database.
    :return: None.
    """
    global USER_LIST
    print("Here:", users)
    USER_LIST.append(users)
    SOCKETIO.emit('added_users', users, broadcast=True, include_self=False)


def set_and_select_players(names):
    """
    Sets the people logged in, into their respective roles/spots.ArithmeticError
    :param names: a list of all the people, including the new ones, who are logged in.
    :return: A list of lists where [0] is the names, [1] is everyone logged in, and [2]
    is the list of players who CAN play, 'X', and 'O'.
    """
    global LOGGED_IN_USERS, GAMERS
    LOGGED_IN_USERS = names
    GAMERS = names[:2]
    return [names, LOGGED_IN_USERS, GAMERS]


@SOCKETIO.on('login_user')
def on_login(usernames):
    """
    Called whenever a 'login_user' event occurs. Runs when a client logs in with a username. Adds
    the user in their correct place, allowing a means of identifying which client CAN play.
    :param usernames: The list of usernames of the users currently logged in, along with the new
    login.
    :return: None.
    """
    SOCKETIO.emit('current_users',
                  set_and_select_players(usernames)[0],
                  broadcast=True,
                  include_self=False)


@SOCKETIO.on('add_new_user_to_db')
def add_user_to_db(user_name):
    """
    Called whenever a 'add_new_user_to_db' event occurs. Runs when a client logs in with a
    username that isn't already in the database.
    :param user_name: Username string of the person to add to database.
    :return: None.
    """
    print("Adding:", user_name)
    # new_user = models.Leaderboard(username=user_name, score=None)
    # DB.session.add(new_user)
    # DB.session.commit()
    # all_people = DB.session.query(models.Leaderboard).all()
    all_people = add_to_db(user_name)
    scores = configure_db(all_people)
    SOCKETIO.emit('scores', scores, broadcast=True)
    # emit_db()


def add_to_db(name):
    """
    Adding to a database.
    :param name: Username string of the person to add to the database.
    :return: Returns a list of Leaderboard objects of everyone in the database.
    """
    new_user = models.Leaderboard(username=name, score=100)
    DB.session.add(new_user)
    DB.session.commit()
    all_people = models.Leaderboard.query.all()
    return all_people


@SOCKETIO.on('game_over')
def update_on_done(who_won):
    """
    Called whenever a 'game_over' event occurs. Runs when a client wins the game, ending the game
    for everyone.
    :param who_won: Username of the person who won.
    :return: None.
    """
    # global COUNTER
    # COUNTER += 1
    # print("Winner:", who_won)
    # if COUNTER == 1:
    #     winner = DB.session.query(
    #         models.Leaderboard).filter_by(username=who_won).first()
    #     winner.score += 1
    #     DB.session.commit()
    #     who_lost = [user for user in GAMERS if user != who_won][0]
    #     print("Loser:", who_lost)
    #     loser = DB.session.query(
    #         models.Leaderboard).filter_by(username=who_lost).first()
    #     loser.score -= 1
    #     DB.session.commit()
    global GAMERS, COUNTER
    COUNTER += 1
    if COUNTER == 1:
        winner = DB.session.query(
            models.Leaderboard).filter_by(username=who_won).first()

        who_lost = [user for user in GAMERS if user != who_won][0]

        loser = DB.session.query(
            models.Leaderboard).filter_by(username=who_lost).first()

        change_points(winner, loser)
    emit_db()
    # new_user = models.Person(username=user_name, score=None)
    # db.session.add(new_user)
    # db.session.commit()


def change_points(winner, loser):
    """
    Function that alters the DB so that the winner gets a point and the loser loses one.
    :param who_won: Username string of the person who won.
    :param who_lost: Username string of the person who lost.
    :return: None.
    """
    winner.score += 1
    loser.score -= 1
    DB.session.commit()
    return [winner, loser]


# Listen for when a cell is clicked
@SOCKETIO.on('clicked')
def on_cell_click(data):
    """
    Called whenever a 'clicked' event occurs. Runs when a client clicks on a cell on the board.
    :param data: List of the current state of the TicTacToe board.
    :return: None.
    """
    global COUNTER
    if not data:
        COUNTER = 0
    print(str(data))
    SOCKETIO.emit('clicked', data, broadcast=True, include_self=False)


# Note that we don't call app.run anymore. We call socketio.run with app arg

if __name__ == "__main__":
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else
        os.getenv('PORT') if os.getenv('PORT') else 8081,
    )
