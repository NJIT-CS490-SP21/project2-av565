import logo from './logo.svg';
// import './App.css';
import { BigBoard, showBoard } from './Board.js';
import './Board.css';
import React, { useState } from 'react';


// <p>Enter username: <input type = "text" required></input><button onClick = {showBoard}>Begin!</button></p>
function App() {
  const [username, setUsername] = useState('');

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
      setUsername(document.getElementById("username_input_field").value);
      console.log("Username:", username);
      document.getElementById("user_name_input").style.display = "none";
      showBoard();
    }
  }

  function validate(inp) {
    checkInput();
    setUsername(inp.target.value);
  }
  return (
    <div id = "MainApp">
      <div id="user_name_input">
        <label>Enter user-name: </label>
        <input type="text" placeholder="username" id="username_input_field" onChange={validate}/>
        <input type="submit" value="Enter" id="submit_button" onClick={submitted}/>
        <label id="username_error"> Please enter something!</label>
      </div>
      <BigBoard username = {username}/>
    </div>
  );
}

export default App;
