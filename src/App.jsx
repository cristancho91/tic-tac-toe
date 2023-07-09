import { useState } from "react";
import "./App.css";
import confetti from "canvas-confetti";

import { Square } from "./components/Square.jsx";
import { TURNS } from "./constants.js";
import { checkWinnerFrom, checkEndGame } from "./logic/board.js";
import { WinnerModal } from "./components/WinnerModal.jsx";
import { resetGameToLocalStorage, saveGameToLocalStorage } from "./logic/localStorage/index.js";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromLocalStorage = window.localStorage.getItem("board");
    return boardFromLocalStorage
      ? JSON.parse(boardFromLocalStorage)
      : Array(9).fill(null);
  });
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });
  const [winner, setWinner] = useState(null); //null es que no hay ganador, false es que hay un empate

  const resetGame = () => {
    setBoard(Array(9).fill(null)); //reseteo del array
    setTurn(TURNS.X); //reiniciamos al jugador x
    setWinner(null); //limpiar la variable de ganador
    resetGameToLocalStorage();
  };

  const updateBoard = (index) => {
    // no actualizamos esta posicion si ya tiene algo
    if (board[index] || winner) return;
    // si no tiene nada actualizamos el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    //cambiamos el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    // guardar la partida
    saveGameToLocalStorage({
      board: newBoard,
      turn: newTurn    })
    // revisar si hay ganadores
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Volver a Comenzar</button>
      <section className="game">
        {board.map((_, index) => {
          // el _ es la primera posicion del map
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelect={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelect={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
