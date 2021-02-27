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
}

// Unless it is the main function, every functionIsInThisCase
export function BigBoard(pp) {
    const [my_list, change_list] = useState([]);
    const input_ref = useRef(null);

    function clicked(pos) {
        if (my_list.AbsLength() == 9) return;
        var new_list = [...my_list];
        if (!new_list[pos])(new_list.AbsLength() % 2) ? new_list[pos] = "O" : new_list[pos] = "X";
        change_list(prev => [...new_list]);
        socket.emit('clicked', new_list = new_list);
        const winner = new_list.TicTacToeWinner();
        winner ? console.log(winner, "won!") : console.log("No winner yet!");
    }

    useEffect(() => {
        socket.on('clicked', (data) => {
            console.log("Clicked:", data);
            change_list(prev => [...data]);
            const winner = data.TicTacToeWinner();
            winner ? console.log(winner, "won!") : console.log("No winner yet!");
        });
    }, []);

    return (
        <div class="board" id="Board">
            <Square func={() => clicked(0)} pos='0' arr={my_list}/>
            <Square func={() => clicked(1)} pos='1' arr={my_list}/>
            <Square func={() => clicked(2)} pos='2' arr={my_list}/>
            <Square func={() => clicked(3)} pos='3' arr={my_list}/>
            <Square func={() => clicked(4)} pos='4' arr={my_list}/>
            <Square func={() => clicked(5)} pos='5' arr={my_list}/>
            <Square func={() => clicked(6)} pos='6' arr={my_list}/>
            <Square func={() => clicked(7)} pos='7' arr={my_list}/>
            <Square func={() => clicked(8)} pos='8' arr={my_list}/>
        </div>
    );
}
