# CS490 Project 2
This app allows two players to login using any name, and to play tic-tac-toe against each other. Anyone who logs in after the first two, will be allowed to spectate the game, and wont be able to participate. Once the game ends (one player wins - or draws), the winner is shown/the draw is shown, and the players (NOT spectators) will have a button to restart the game.

### Anywhere it says command: [some-command]., execute the some-command in your terminal!

## Packages/Libraries Used (_SOME_ MAY HAVE ALREADY BEEN INSTALLED):
### cd into the root folder - folder that contains public/ and src/
1. python-dotenv command: pip install python-dotenv
2. requests command: pip install requests
3. socketio: command: pip install flask-socketio
4. heroku command: npm install -g heroku
5. flask-cors: command: npm install -U flask-cors
6. npm-socketio: command: npm install socket.io-client --save
7. Flask command: npm install -U flask
8. npm: command: npm install. You might need to do command: npm audit fix
9. For everything else, and command: pip install -r requirements.txt

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
7. If you're lazy, just visit [my app on heroku](https://av565-project-2.herokuapp.com/).

## Issues:
- 1. I wanted to properly style everything (AGAIN, just like in project 1 milestone 1), and make everything fancy. I wanted to add a feature where it would show an X or an O when the correspondint player did a mouseover any of the available tiles.
  2. I wanted to add the logout feature, but unfortunately was not able to figure it out.
  3. Furthermore, I really wanted to add a chatbox that would allow players (and maybe even spectators) to talk to each other during a game.
- 1. I was unable to properly make a login function. I had to try so many times, with different solutions, but ended up failing. In the end, after so many tries, I figured out how to send the username(s) from the client-side to the main server. I looked at how we did the homeworks and found how we sent the text.
  2. Had a lot of trouble trying to properly process a click - things like allowing a user to only click on their turn, and disabling the click when its not their turn. I had to add a lot of conditions that felt like they would take forever, but in the end found a solution; I checked if it was a players's turn (using a turn-number %2) AND if the user clicking (the one logged in the current tab) was the one whos turn it was (from the list of users that was sent from App.js).




