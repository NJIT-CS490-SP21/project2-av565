import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Square } from './Square';
import { range } from './RangeFunction';

// !!! DISABLING ESLINT FOR EVERY ARRAY.PROTOTYPE BECAUSE OF ERRORS -- Sorry professor/TA !!!

// {Object.keys(scores).map((key, index) => (
//     <tr>
//         <td>{key}</td>
//         <td>{scores[key]}</td>
//     </tr>
// ))}

const socket = io();

// Any prototypes FollowThisCase.
// eslint-disable-next-line
Array.prototype.AbsLength = function () {
  return this.filter((element) => element != null).length;
};

export function showBoard() {
  document.getElementById('Board').style.display = 'grid';
  document.getElementById('GameInfo').style.display = 'block';
  document.getElementById('Xname').style.display = 'block';
}

// Unless it is the main function, every functionIsInThisCase
export function BigBoard(pp) {
  const { users } = pp;
  let runs = 0;
  let leaderboardShown = false;
  const user = pp.current_user;
  const [currentBoard, changeBoard] = useState(Array(9));
  const [scores, setScore] = useState({});
  const scoresOrdered = [];
  // socket.emit('username', users);

  function clicked(pos) {
    if (currentBoard.AbsLength() === 9) return;
    const newBoard = [...currentBoard];
    if (!newBoard[pos] && !newBoard.TicTacToeWinner()) {
      if (newBoard.AbsLength() % 2) {
        if (users[1] === user) newBoard[pos] = 'O';
        changeBoard([...newBoard]);
        socket.emit('clicked', newBoard);
      } else if (users[0] === user) {
        newBoard[pos] = 'X';
        changeBoard(newBoard);
        socket.emit('clicked', newBoard);
      }
    }
  }

  // eslint-disable-next-line
  Array.prototype.TicTacToeWinner = function () {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i += 1) {
      const [a, b, c] = lines[i];
      // eslint-disable-next-line
      if (this[a] && this[a] === this[b] && this[a] === this[c]) {
        runs += 1;
        if (user === users[0] || user === users[1]) document.getElementById('ResetButton').style.display = 'block';
        if (runs === 1) {
          // eslint-disable-next-line
          if (this[a] === 'X' && user === users[0]) socket.emit('game_over', users[0]);
          // eslint-disable-next-line
          else if (this[a] === 'O' && user === users[1]) socket.emit('game_over', users[1]);
        }
        let returnString = '';
        // eslint-disable-next-line
        if (this[a] === 'X') {
          if (user === users[1]) returnString = `${users[0]} Won :(`;
          else if (user === users[0]) returnString = 'You Won!';
        } else if (user === users[0]) returnString = `${users[1]} Won :( `;
        else if (user === users[1]) returnString = ' You Won!';
        return returnString;
      }
    }

    return null;
  };

  function showLeaderboard() {
    if (!leaderboardShown) {
      document.getElementById('leaderboard').style.display = 'block';
      document.getElementById('lleaderboard').style.display = 'block';
    } else {
      document.getElementById('leaderboard').style.display = 'none';
      document.getElementById('lleaderboard').style.display = 'none';
    }
    leaderboardShown = !leaderboardShown;
  }

  function leaderboardTable() {
    return (
      <table className="js-sort-table">
        <thead>
          <tr>
            <th className="js-sort-string">Username</th>
            <th className="js-sort-number" id="lleaderboard" style={{ display: 'none' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {scoresOrdered.map((value) => (
            <tr className={user === value[0] ? 'leaderboard_marker' : ''}>
              <td>{value[0]}</td>
              <td>{value[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function resetGame() {
    runs = 0;
    changeBoard([]);
    socket.emit('clicked', []);
    document.getElementById('ResetButton').style.display = 'none';
  }

  useEffect(() => {
    socket.on('clicked', (data) => {
      changeBoard(data);
    });
    socket.on('scores', (data) => {
      setScore(data);
    });
  }, []);

  Object.keys(scores).map((key) => scoresOrdered.push([key, scores[key]]));
  scoresOrdered.sort((l, r) => r[1] - l[1]);
  // console.log(scoresOrdered);
  return (
    <div id="MainGame">
      <div className="GameInfo" id="GameInfo">
        <p id="Xname" className={user === users[0] ? 'Xname' : ''} style={{ display: 'none' }}>
          Player X:
          {' '}
          {users[0]}
          {' '}
          {user === users[0] ? '(You)' : ''}
        </p>
        <p id="Oname" className={user === users[1] ? 'Oname' : ''}>
          Player O:
          {' '}
          {users[1]}
          {' '}
          {user === users[1] ? '(You)' : ''}
        </p>
        <p id="Specname">
          Spectators:
          {users.slice(2).join(', ')}
        </p>
      </div>
      <div className="board" id="Board">
        {range(9).map((key, i) => (
          <Square
            key={key}
            func={() => clicked(i)}
            pos={i}
            arr={currentBoard}
          />
        ))}
      </div>
      <button
        id="ShowLeaderboardButton"
        className="ShowLeaderboardButton"
        type="button"
        onClick={() => showLeaderboard()}
      >
        Show Leaderboard
      </button>
      <div className="leaderboard" id="leaderboard">
        {leaderboardTable()}
      </div>
      <h1>
        {currentBoard.TicTacToeWinner() ? currentBoard.TicTacToeWinner() : ''}
      </h1>
      <button id="ResetButton" className="ResetButton" type="button" onClick={() => resetGame()}>
        Restart
      </button>
    </div>
  );
}
