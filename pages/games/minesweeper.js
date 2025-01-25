import React, { useState, useEffect } from "react";
import Board from "@/helpers/minesweeper/board";
import GameLayout from "@/components/GameLayout";

const Minesweeper = () => {
  const [board, setBoard] = useState(new Board(10, 10));
  const [size, setSize] = useState(10);
  const [minesCount, setMinesCount] = useState(10);
  const [flagsLeft, setFlagsLeft] = useState(minesCount);
  const [inFlagMode, setInFlagMode] = useState(false);

  const handleTileClick = (x, y) => {
    if (inFlagMode) {
      alert("Right click to add flag");
      return;
    }

    if (board.gameOver || board.board[x][y].flagged) {
      return;
    }

    board.revealTile(x, y);
    setFlagsLeft(board.flagsLeft());

    const newBoard = Object.create(Object.getPrototypeOf(board));
    Object.defineProperties(newBoard, Object.getOwnPropertyDescriptors(board));
    setBoard(newBoard);
  };

  const handleTileRightClick = (e, x, y) => {
    e.preventDefault();
    if (board.gameOver || board.board[x][y].revealed) return;
    if (inFlagMode) {
      board.toggleFlag(x, y);
      console.log(board);
      setFlagsLeft(board.flagsLeft());
      const newBoard = Object.create(Object.getPrototypeOf(board));
      Object.defineProperties(
        newBoard,
        Object.getOwnPropertyDescriptors(board)
      );
      setBoard(newBoard);
    }
  };

  const handleReset = () => {
    const newBoard = new Board(size, minesCount);
    setFlagsLeft(minesCount);
    setBoard(newBoard);
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    const newBoard = new Board(newSize, minesCount);
    setFlagsLeft(minesCount);
    setBoard(newBoard);
  };

  const handleMinesChange = (e) => {
    const newMinesCount = parseInt(e.target.value);
    setMinesCount(newMinesCount);
    const newBoard = new Board(size, newMinesCount);
    setFlagsLeft(newMinesCount);
    setBoard(newBoard);
  };

  const toggleFlagMode = () => {
    setInFlagMode(!inFlagMode);
  };

  useEffect(() => {
    if (board.isGameWon()) {
      alert("You Win!");
    }
  }, [board]);

  return (
    <GameLayout>
      <div className="mb-4 flex space-x-4">
        <div>
          <label className="block text-lg font-medium">Board Size:</label>
          <input
            type="number"
            value={size}
            onChange={handleSizeChange}
            min="5"
            max="25"
            className="mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Mines:</label>
          <input
            type="number"
            value={minesCount}
            onChange={handleMinesChange}
            min="1"
            max={size * size - 1}
            className="mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        >
          Reset Game
        </button>
      </div>

      <div className="mb-4 text-xl font-bold text-gray-700">
        Flags Left: {flagsLeft}
      </div>

      <button
        onClick={toggleFlagMode}
        className={`px-4 py-2 mb-4 ${
          inFlagMode ? "bg-red-500" : "bg-green-500"
        } text-white font-semibold rounded-md hover:${
          inFlagMode ? "bg-red-600" : "bg-green-600"
        } transition`}
      >
        {inFlagMode ? "Exit Flag Mode" : "Enter Flag Mode"}
      </button>

      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${size}, 30px)`,
          gridTemplateRows: `repeat(${size}, 30px)`,
        }}
      >
        {board.board.map((row, x) =>
          row.map((tile, y) => (
            <div
              key={`${x}-${y}`}
              className={`relative flex items-center justify-center w-7 h-7 border border-gray-400 rounded-md cursor-pointer ${
                tile.revealed
                  ? "bg-gray-200"
                  : tile.flagged
                  ? "bg-yellow-300"
                  : "bg-gray-300"
              }`}
              onClick={() => handleTileClick(x, y)}
              onContextMenu={(e) => handleTileRightClick(e, x, y)}
            >
              {tile.revealed && tile.value === "X" && (
                <span className="flex justify-center items-center pb-1 overflow-hidden h-full w-full">
                  <img
                    className="h-[90%] w-[70%] scale-125"
                    src={"/assets/minesweeper/bomb.png"}
                  />
                </span>
              )}
              {tile.revealed && tile.value !== "X" ? (
                <span className="text-center font-bold text-gray-700">
                  {tile.value}
                </span>
              ) : tile.flagged ? (
                <span className="text-center text-xl">🚩</span> // Flag on the tile
              ) : null}
            </div>
          ))
        )}
      </div>
    </GameLayout>
  );
};

export default Minesweeper;
