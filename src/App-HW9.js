import logo from './logo.svg';
// import './App.css';
import {FoodList} from './listItem.js';
import {useState, useRef} from 'react';
import {SomeFunction} from './Board.js';
import './Board.css';

function App() {
  // const [myList, changeList] = useState([]);
  // const inputRef = useRef(null);
  
  // function clicked(){
  //   changeList(prevList => [...prevList, "X"]);
  // }
  // return (
  //   <div>
  //     <h1>My favorite foods:</h1>
  //     <input type = "text" ref = {inputRef}/>
  //     <button onClick = {clicked}>Add to list</button>
  //     <ul>
  //       {myList.map(item => <FoodList name = {item}/>)}
  //     </ul>
  //   </div>
  // );
  return (
    <SomeFunction/>
  );
}

export default App;
