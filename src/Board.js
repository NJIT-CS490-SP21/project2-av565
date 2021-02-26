import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io();

Array.prototype.AbsLength = function() {
    return this.filter(function(element) {
        return element != null;
    }).length;
}


export function SomeFunction() {
    const [myList, changeList] = useState([]);
    const inputRef = useRef(null);

    function clicked(pos) {
        if(myList.AbsLength() == 9) return;
        var newList = [...myList];
        if(!newList[pos]) (newList.AbsLength() % 2) ? newList[pos] = "O" : newList[pos] = "X";
        changeList(prevList => [...newList]);
        socket.emit('clicked', newList = newList);
    }
    
    useEffect(() => {
       socket.on('clicked', (data) =>{
          console.log("Clicked:", data);
          changeList(prevList => [...data]);
       });
    }, []);

    return (
        <div class="board">
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