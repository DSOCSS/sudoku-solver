# Sudoku Solver

This program is designed to solve any given sudoku board, if a solution exists.

The sudoku solver uses a combination of a repetative scanning technique as well as a depth-first-search backtracking algorithm.

## Using

Users can type in any partial sudoku puzzle on the grid, and then press the "solve sudoku" puzzle to have the puzzle be solved. The board can be navigated by mouse clicks, arrow keys, or the tab/space character. While most valid puzzles can be solved relatively quickly, an impossible configuration (a puzzle with no solutions) can be computationally expensive.

## Authors

This program was developed by Arthur Zarins and Nate Abbott in 2024.

## Code Information

This project is written in [TypeScript](https://www.typescriptlang.org/). To install TypeScript, first install [NodeJS](https://nodejs.org/en) to get access to npm. Once Node is installed, install TypeScript globally via ```npm install -g typescript``` or locally via ```npm install --save-dev typescript```. 

> To compile the sudoku TypeScript file, run ```tsc sudoku.ts```.

> To run the corresponding JavaScript file on the command line, run ```node sudoku.js```.

This project uses the [Jest](https://jestjs.io/) testing framework for TypeScript. Install TypeScript Jest via ```npm i -D ts-jest @types/jest```. Since the sudoku solver runs in the context of an html file / web browser, Jest's jsdom environment needs to be installed via ```npm i jest-environment-jsdom```.

> To test the program, run ```npm test```.

Note: After changing code, compile the TypeScript files before running unit tests or running the JavaScript file.