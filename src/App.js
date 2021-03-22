import './Board.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { BigBoard, showBoard } from './Board';

const socket = io();
function App() {
  const [currentUserList, setCurrentUserList] = useState([]);
  const [users, setUsers] = useState({});
  const [username, changeUsername] = useState('');

  function checkInput() {
    const usernameInput = document.getElementById('username_input_field');
    if (usernameInput.value === '') {
      document.getElementById('username_error').style.visibility = 'visible';
      document.getElementById('username_error').innerHTML = 'Please enter something!';
      return;
    }
    document.getElementById('username_error').style.visibility = 'hidden';
  }

  function submitted() {
    const stupid = false;
    const temp = document.getElementById('username_input_field').value;
    if (!stupid) {
      if (temp !== '') {
        if (!currentUserList.includes(temp)) {
          changeUsername(document.getElementById('username_input_field').value);
          if (!Object.keys(users).includes(document.getElementById('username_input_field').value)) socket.emit('add_new_user_to_db', document.getElementById('username_input_field').value);
          const newUsers = [...currentUserList, temp];
          setCurrentUserList(newUsers);
          socket.emit('login_user', newUsers);
          document.getElementById('user_name_input').style.display = 'none';
          showBoard();
          return;
        }

        document.getElementById('username_error').innerHTML = 'Username already taken! Try Again!';
        document.getElementById('username_error').style.visibility = 'visible';
      }
    } else {
      changeUsername(temp);
      if (!Object.keys(users).includes(temp)) socket.emit('add_new_user_to_db', temp);
      const newUsers = [...currentUserList, temp];
      setCurrentUserList(newUsers);
      socket.emit('login_user', newUsers);
      document.getElementById('user_name_input').style.display = 'none';
      document.getElementById('username-label').style.display = 'none';
      document.getElementById('submit_button').style.display = 'none';
      showBoard();
    }
  }

  useEffect(() => {
    socket.on('current_users', (data) => {
      setCurrentUserList(data);
    });
    socket.on('scores', (data) => {
      setUsers(data);
    });
  }, []);

  return (
    <div id="MainApp">
      <div id="user_name_input">
        <label id="username-label" style={{ display: 'inline-block' }} htmlFor="username_input_field">
          Username:
          <input
            type="text"
            placeholder="username"
            id="username_input_field"
            onChange={checkInput}
          />
        </label>
        <input
          type="submit"
          value="Login"
          id="submit_button"
          style={{ display: 'inline-block' }}
          onClick={submitted}
        />
        <span id="username_error"> Please enter something!</span>
      </div>
      <BigBoard current_user={username} users={currentUserList} />
    </div>
  );
}

export default App;
