import React, { useState } from 'react';
import './tic-tac-toe-squared.css';
import { makeMark } from "./helpers.js";
import { Link } from "react-router-dom";

function TicTacToeSquared() {
  const [mark, setMark] = useState("X");
  const [outerGame, setOuterGame] = useState(Array(9).fill(Array(9).fill(true))); // 2D array of empty game boards

  const handleClick = (event, outIndex, innerIndex) => {
    let newOuterGame = outerGame.map((innerGame, i) => {
        if (i === outIndex) { // check if this is the innerGame we were in
          let newInnerGame = [...innerGame]; // shallow copy of original
          newInnerGame[innerIndex] = false;
          let element = event.currentTarget;
          makeMark(mark, element, outIndex, innerIndex);
          setMark(mark == "X" ? "O" : "X"); // swap
          return newInnerGame;
        }
        return innerGame;
    });
    setOuterGame(newOuterGame);
  }


  return ( 
    <>
      {/* Header */}
      <header className="site-header">
        <div className="container navbar" role="navigation" aria-label="Main">
          <div className="brand">
            <span className="brand-dot" aria-hidden="true"></span>
            <Link to="/"><span>&lt; Jack Johnson /&gt;</span></Link>
          </div>
          <h1>Tic Tac Toe Squared</h1>
        </div>
      </header>
    
      {/* Chess Board */}
      <main>
        <div id="textBox"><em id="text">Now Playing: X</em></div>
          <div id="board">
            <div id="outer-game">
              {outerGame.map((innerGame, outIndex) => (
                <div className="inner-board" key={outIndex}>
                  <div className="outerMark" id={outIndex + "mark"}></div>
                  <div className="inner-game" id={outIndex + "game"}>
                    {innerGame.map((square, innerIndex) => ( 
                      <div className="unmarked_square" id={innerIndex} key={innerIndex} onClick={innerGame[innerIndex] ? (event) => handleClick(event, outIndex, innerIndex) : undefined}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
      </main>
    </>
  );
}

export default TicTacToeSquared;
