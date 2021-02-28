import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io();

// Any prototypes FollowThisCase
Array.prototype.AbsLength = function () {
    return this.filter(function (element) {
        return element != null;
    }).length;
}

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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (this[a] && this[a] === this[b] && this[a] === this[c]) return this[a];
    }
    return null;
}

export function showBoard() {
    document.getElementById("Board").style.display = "grid";
    document.getElementById("GameInfo").style.display = "block";
}

// Unless it is the main function, every functionIsInThisCase
export function BigBoard(pp) {
    var users = pp.users;
    const user = pp.current_user;
    console.log(user);
    socket.emit('username', users);
    const [current_board, change_list] = useState([]);
    const input_ref = useRef(null);

    function clicked(pos) {
        if (current_board.AbsLength() == 9) return;
        var change_board = [...current_board];
        if (!change_board[pos]){
            if(change_board.AbsLength() % 2){
                if(users[1] === user) change_board[pos] = "O";
                change_list(prev => [...change_board]);
                socket.emit('clicked', change_board = change_board);
            }
            else if(users[0] === user){
                change_board[pos] = "X";
                change_list(prev => [...change_board]);
                socket.emit('clicked', change_board = change_board);
            }
        }
        const winner = change_board.TicTacToeWinner();
        winner ? console.log(winner, "won!") : console.log("No winner yet!");
    }

    useEffect(() => {
        socket.on('clicked', (data) => {
            change_list(prev => data);
            const winner = data.TicTacToeWinner();
            winner ? console.log(winner, "won!") : console.log("No winner yet!");
        });
    }, []);

    return (
        <div id="MainGame">
            <div id="GameInfo" class="GameInfo">
                <p id="Xname">Player X: {users[0]}</p>
                <p id="Oname">Player O: {users[1]}</p>
                <p id="Specname">Spectators: {users.slice(2).join(", ")}</p>
            </div>
            <div class="board" id="Board">
                <Square func={() => clicked(0)} pos='0' arr={current_board}/>
                <Square func={() => clicked(1)} pos='1' arr={current_board}/>
                <Square func={() => clicked(2)} pos='2' arr={current_board}/>
                <Square func={() => clicked(3)} pos='3' arr={current_board}/>
                <Square func={() => clicked(4)} pos='4' arr={current_board}/>
                <Square func={() => clicked(5)} pos='5' arr={current_board}/>
                <Square func={() => clicked(6)} pos='6' arr={current_board}/>
                <Square func={() => clicked(7)} pos='7' arr={current_board}/>
                <Square func={() => clicked(8)} pos='8' arr={current_board}/>
            </div>
        </div>
    );
}
