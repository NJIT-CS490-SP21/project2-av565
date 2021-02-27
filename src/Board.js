import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io();

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

export function SomeFunction() {
    const [myList, changeList] = useState([]);
    const inputRef = useRef(null);

    function clicked(pos) {
        if (myList.AbsLength() == 9) return;
        var newList = [...myList];
        if (!newList[pos])(newList.AbsLength() % 2) ? newList[pos] = "O" : newList[pos] = "X";
        changeList(prevList => [...newList]);
        socket.emit('clicked', newList = newList);
        const winner = newList.TicTacToeWinner();
        winner ? console.log(winner, "won!") : console.log("No winner yet!");
    }

    useEffect(() => {
        socket.on('clicked', (data) => {
            console.log("Clicked:", data);
            changeList(prevList => [...data]);
            const winner = data.TicTacToeWinner();
            winner ? console.log(winner, "won!") : console.log("No winner yet!");
        });
    }, []);

    return (
        <div class="board" id="Board">
            <Square func={() => clicked(0)} pos='0' arr={myList}/>
            <Square func={() => clicked(1)} pos='1' arr={myList}/>
            <Square func={() => clicked(2)} pos='2' arr={myList}/>
            <Square func={() => clicked(3)} pos='3' arr={myList}/>
            <Square func={() => clicked(4)} pos='4' arr={myList}/>
            <Square func={() => clicked(5)} pos='5' arr={myList}/>
            <Square func={() => clicked(6)} pos='6' arr={myList}/>
            <Square func={() => clicked(7)} pos='7' arr={myList}/>
            <Square func={() => clicked(8)} pos='8' arr={myList}/>
        </div>
    );
}
