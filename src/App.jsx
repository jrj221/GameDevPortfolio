import React from "react";
import Portfolio from "./Portfolio";
import { Route, Routes } from "react-router-dom";
import TicTacToeSquared from "./TicTacToeSquared/TicTacToeSquared";
import ScrollController from "./ScrollController";

function App() {
    return (
        <>
            <ScrollController />
            <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/chess" />
                <Route path="/cougs-connect" />
                <Route path="/tic-tac-toe-squared" element={<TicTacToeSquared/>} />
            </Routes>
        </>
    )
}

export default App; 