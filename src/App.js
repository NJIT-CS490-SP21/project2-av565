import logo from './logo.svg';
import './App.css';
import { ListItem } from './ListItem.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const [messages, setMessages] = useState([]); // State variable, list of messages
  const inputRef = useRef(null); // Reference to <input> element
  const joinRef = useRef(null); // Reference to <input> element
  const [userList, setUserList] = useState([]);

  function onClickButton() {
    if (inputRef != null) {
      const message = inputRef.current.value;
      // If your own client sends a message, we add it to the list of messages to 
      // render it on the UI.
      setMessages(prevMessages => [...prevMessages, message]);
      socket.emit('chat', { message: message });
    }
  }

  function onClickJoin() {
    if (joinRef != null) {
      const username = joinRef.current.value;
      socket.emit('join', { 'user': username });
    }
  }

  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('chat', (data) => {
      console.log('Chat event received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setMessages(prevMessages => [...prevMessages, data.message]);
    });

    socket.on('user_list', (data) => {
      console.log('User list event received!');
      console.log(data);
      setUserList(data.users);
    });
  }, []);

  return (
    <div>
      <h1>Chat Messages</h1>
      Enter message here: <input ref={inputRef} type="text" />
      <button onClick={onClickButton}>Send</button>
      <ul>
        {messages.map((item, index) => <ListItem key={index} name={item} />)}
      </ul>
      <div>
        <h3>All Users (History)</h3>
        Enter username here: <input ref = { joinRef } type="text" />
        <button onClick={onClickJoin}>Join</button>
        {userList.map((user, index) => <ListItem key={index} name={user} />)}
      </div>
    </div>
  );
}

export default App;