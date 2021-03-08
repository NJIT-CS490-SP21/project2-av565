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

export function showBoard() {
    document.getElementById("Board").style.display = "grid";
    document.getElementById("GameInfo").style.display = "block";
}

// Unless it is the main function, every functionIsInThisCase
export function BigBoard(pp) {
    const [who_won, set_who_won] = useState('');
    var users = pp.users;
    const user = pp.current_user, [current_board, change_list] = useState(Array(9)), input_ref = useRef(null);
    socket.emit('username', users);
    
    function clicked(pos) {
        if (current_board.AbsLength() == 9) return;
        var change_board = [...current_board];
        if (!change_board[pos] && !change_board.TicTacToeWinner()) {
            if (change_board.AbsLength() % 2) {
                if (users[1] === user) change_board[pos] = "O";
                change_list(prev => [...change_board]);
                socket.emit('clicked', change_board = change_board);
            }
            else if (users[0] === user) {
                change_board[pos] = "X";
                change_list(prev => [...change_board]);
                socket.emit('clicked', change_board = change_board);
            }
        }
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
            [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (this[a] && this[a] === this[b] && this[a] === this[c]){
                if(user == users[0] || user == users[1]) document.getElementById("ResetButton").style.display = "block";
                return this[a] + " Won!";
            }
        }
        
        return null;
    }
    
    function ShowGameInfo(info_pp) {
        let x, y, spec, content;
        if (info_pp.len >= 1) {
            x = <p>Player X: {info_pp.lis[0]}</p>;
            if (info_pp.curr == users[0]) x = [x, <label>(You)</label>];
        }
        if (info_pp.len >= 2) {
            y = <p>Player O: {info_pp.lis[1]}</p>;
            if (info_pp.curr == users[1]) y = [y, <label>(You)</label>];
        }
        if (info_pp.len >= 3) {
            spec = <p>Spectators: {users.slice(2).join(", ")}</p>;
        }
        return [x, y, spec];
    }
    
    function reset_game(){
        change_list([]);
        socket.emit('clicked', []);
        document.getElementById("ResetButton").style.display = "none";
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
            <div class="GameInfo" id="GameInfo">
                <p id="Xname">Player X: {users[0]}</p>
                <p id="Oname">Player O: {users[1]}</p>
                <p id="Specname">Spectators: {users.slice(2).join(", ")}</p>
            </div>
            <div class="board" id="Board">
                {[...Array(9).keys()].map((value) => <Square func={() => clicked({value})} pos={value.toString()} arr={current_board}/>)}
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
            <h1>{(current_board.TicTacToeWinner()) ? current_board.TicTacToeWinner() : ""}</h1>
            <button id="ResetButton" class="ResetButton" onClick={() => reset_game()}>Restart</button>
        </div>
    );
}
