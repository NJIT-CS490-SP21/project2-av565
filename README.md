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
4. Type a login name - can be anything (Can be the same as others')
5. Click on Enter button and start playing.
6. To play again, just click on restart button that will show up once the game is ended (someone won or draw).
7. If you're lazy, just visit [my app on heroku](https://av565-project-2-3.herokuapp.com/).

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
### PLEASE NOTE: For testing purposes, I had to turn off "duplicate username" checking in App.js (which means a player can login without anything typed in the username input, _AND_ people can login with the same username as the others logged in). I turned it off on the main upload (The one on Heroku) so that it works as intended. Just go to src/App.js and set stupid = true (within App.submitted() function) when testing.
- 1. I wanted to properly style everything (AGAIN, just like in project 1 milestone 1), and make everything fancy. I wanted to add a feature where it would show an X or an O when the correspondint player did a mouseover any of the available tiles.
  2. I wanted to add the logout feature, but unfortunately was not able to figure it out.
  3. Furthermore, I really wanted to add a chatbox that would allow players (and maybe even spectators) to talk to each other during a game.
- 1. I had a lot of trouble trying to figure out how to emit the winner and the loser from the clients. Because I wasn't doing it the way the class was doing it (using a dictionary), I thought it would work to emit a list where 0 is winner and 1 is loser, but that would emit the same things. I ended up having a variable within app.py to keep track of the players (people who can play), and emiting from the clients ONLY the winner so that in the app.py, I could check the players list and increment/decrement correspondingly.
  2. I addidionally had a lot of problems with some of the table functions. I wanted to make it interactive, and be rendered in order. I ended up using a table-Sorter module from [here](https://github.com/stationer/SortTable), so that the user can click and sort the table according to the columns they clicked/the order they want. To render the table descending order, I had to convert the python dictionary into a list of lists like: [[username1, score1], [username2, score2], ...] and then ended up sorting that and displaying it. ALL that because "Object"s in JS do not follow any order.
- MS3:
  1. I was unable to test the functionality of having duplicate users (not allow a user to login if another one is already logged in with the same username), so ended up having a boolean which I can simply turn on and off for the testing purpose. On the main deployed app, I will have the boolean set to FALSE, therefore, it _Will_ check for duplicates.
  2. Wish I had known ESLint was going to be a requirement since it would've made things so much easier.
  #### I had to disable some eslint things like Array.prototype (and consequently the word this within the prototype definition) using the disable-next-line commend, and ignore some of the files/functions I got from other sources.




