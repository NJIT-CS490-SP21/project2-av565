# CS490 Project 2
This app allows two players to login using any name, and to play tic-tac-toe against each other. Anyone who logs in after the first two, will be allowed to spectate the game, and wont be able to participate. Once the game ends (one player wins - or draws), the winner is shown/the draw is shown, and the players (NOT spectators) will have a button to restart the game.

### Anywhere it says command(s): [some-command]., execute the some-command part only, on your bash terminal!

## Prerequirements/Assumptions:
1. You are using a terminal/command line that supports bash and its commands (Any linux distro), and have sudouser priviledge. The commands listed here won't work otherwise!!
2. You have pip, and python installed. command: sudo apt install python3.
3. pip. It should come default with python.
4. npm. command: sudo apt install npm.
5. GitHub repository. Once everything is working well on local, upload to GitHub _if_ you wish to deploy on heroku.

## Packages/Libraries Used (_SOME_ MAY HAVE ALREADY BEEN INSTALLED):
### cd into the root folder - folder that contains public/ and src/
1. python-dotenv command: pip install python-dotenv
2. requests command: pip install requests
3. socketio: command: pip install flask-socketio
4. heroku command: npm install -g heroku
5. flask-cors: command: npm install -U flask-cors
6. npm-socketio: command: npm install socket.io-client --save
7. Flask command: npm install -U flask
8. Postgresql commands: 
    1. sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs
    2. sudo service postgresql initdb
    3. sudo service postgresql start
    4. sudo -u postgres createuser --superuser $USER. Might give an error - ignore.
    5. sudo -u postgres createdb $USER
9. node_modules folder: command: npm install. You might need to do command: npm audit fix
10. psycopg2-binary: command: pip install psycopg2-binary
11. SQLAlchemy: command: pip install Flask-SQLAlchemy==2.1
12. For everything else: command: pip install -r requirements.txt

#### Others _SHOULD_ be part of python:
9. os

## Before Set-Up:
1. Make sure you have Python installed (latest version is preffered).
2. Make sure you have all the packages/libraries installed; checkout Packages/Libraries Used
3. command: echo "DANGEROUSLY\_DISABLE\_HOST_CHECK=true" > .env.development.local

## How to Set-Up:
1. command: python app.py
2. Open a different terminal and command: npm run start
3. Go to "localhost:8080" on your browser in two or more different tabs (suggest using multiple windows).
4. Type a login name - can be anything (Cannot be the same as others')
5. Click on Enter button and start playing.
6. To play again, just click on restart button that will show up once the game is ended (someone won or draw).
7. If you're lazy, just visit [my app on heroku](https://av565-project-2-2.herokuapp.com/).

## Heroku Deployment:
1. Push everything to your GitHub. Use the .gitignore file provided.
2. Setup a heroku account:
    1. Visit Heroku's login [website](https://id.heroku.com/login).
    2. If needed, create a new account.
    3. Go [here](https://dashboard.heroku.com/apps) to make sure login/creation worked properly.
3. These commands:
    1. heroku login -i
    2. heroku addons:create heroku-postgresql:hobby-dev
    3. heroku create. To rename: heroku apps:rename [whatever-name-you-want].
4. heroku config > .env
5. Edit your .env file so it looks like: DATABASE_URL=\"[contents-that-were-already-here]\" and delete everything else.

## Issues:
- 1. Stylization is still needed, along with a logout function/feature.
  2. Wanted to make it so that every user has their own table, all with their _own_ game-history. There would of course be a main leaderboard table whose primary keys would be the names of the tables. 
- 1. Had major issues with the database. Had to run through all instructions multiple times before getting the app up and running properly.
  2. Had even worse issues _once_ everything was setup and running properly: the game was updating too many times, with the winner and loser's scores increasing and decreasing way too many times. Took a little bit of "bad code" to fix it. Emitting only from the winner, along with a counter on the game side, and another counter to modify the database _only_ once. 




