import logo from './logo.svg';
// import './App.css';
import { BigBoard, showBoard } from './Board.js';
import './Board.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import io from 'socket.io-client';

const socket = io();
// <p>Enter username: <input type = "text" required></input><button onClick = {showBoard}>Begin!</button></p>
function App() {
  const [add_user_list, set_add_user_list] = useState([]);
  const [current_user_list, set_current_user_list] = useState([]);
  const [users, set_users] = useState({});
  const [username, change_username] = useState('');
  
  function checkInput() {
    var username_input = document.getElementById("username_input_field");
    if (username_input.value == "") {
      document.getElementById("username_error").style.visibility = "visible";
      return;
    }
    document.getElementById("username_error").style.visibility = "hidden";
  }

  function submitted() {
    if (document.getElementById("username_input_field").value != "") {
      change_username(document.getElementById("username_input_field").value);
      if(!Object.keys(users).includes(document.getElementById("username_input_field").value)) socket.emit('add_new_user_to_db', document.getElementById("username_input_field").value);
      const temp = document.getElementById("username_input_field").value;
      var new_users = [...current_user_list, temp];
      set_current_user_list(new_users);
      socket.emit('login_user', new_users);
      document.getElementById("user_name_input").style.display = "none";
      showBoard();
      return;
    }
  }
  
  useEffect(() => {
    socket.on('current_users', (users) => {
      console.log(users);
      set_current_user_list(users);
    });
    socket.on('scores', (users) => {
      set_users(users);
    });
  }, []);
  
  return (
    <div id = "MainApp">
      <div id="user_name_input">
        <label>Enter username: </label>
        <input type="text" placeholder="username" id="username_input_field" onChange={checkInput}/>
        <input type="submit" value="Enter" id="submit_button" onClick={submitted}/>
        <label id="username_error"> Please enter something!</label>
      </div>
      <BigBoard current_user={username} users={current_user_list}/>
    </div>
  );
}

export default App;
