import logo from './logo.svg';
// import './App.css';
import { FoodList } from './ListItem.js';
import { SomeFunction, showBoard } from './Board.js';
import './Board.css';
import React, {useState} from 'react';


// <p>Enter username: <input type = "text" required></input><button onClick = {showBoard}>Begin!</button></p>
function App() {
  const [username, setUsername] = useState('');
  const check_input = () => {
    if(document.getElementById("username").value == ""){
      alert("Please enter a username!");
      return;
    }
    document.getElementById("user_name_input").style.display = "none";
    showBoard();
  };
  return (
    <div id = "MainApp">
      <div id="user_name_input">
        <label for = "username">Enter user-name: </label>
        <input type="text" placeholder="username" id="username" name="username" onChangeText={(value) => setUsername(value)}/>
        <input type="submit" value="Enter" onClick={check_input}/>
      </div>
      <SomeFunction/>
    </div>
  );
}

export default App;
