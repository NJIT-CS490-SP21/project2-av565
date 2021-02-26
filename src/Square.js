import React from 'react';

export function Square(props){
    return <div class="box" onClick = {props.func}>{props.arr[props.pos]}</div>;
}