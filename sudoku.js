"use strict";
/**
 * Sudoku solving program.
 * @author Arthur Zarins
 * @author Nate Abbott
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.solveSudoku = exports.scanSquares = exports.scanCols = exports.scanRows = exports.individualSolved = exports.isSolved = exports.convertToString = exports.oneCandidateInCol = exports.oneCandidateInRow = exports.createPrintString = exports.removeSpaces = exports.convertToArray = void 0;
/**
 * @param board a string representation of a board. Whitespace is ignored.
 * @returns a 3d array representing a board, with possible candidate lists for each square
 * @author Arthur Zarins
 */
function convertToArray(str) {
    str = removeSpaces(str); //remove space characters
    let arr = [];
    for (let row = 0; row < 9; row++) {
        let currRow = [];
        for (let col = 0; col < 9; col++) {
            if (str.charAt(row * 9 + col) == "0") {
                //empty squares can become any number
                currRow.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }
            else {
                //filled squares can only be that number
                currRow.push([Number(str.charAt(row * 9 + col))]);
            }
        }
        arr.push(currRow);
    }
    return arr;
}
exports.convertToArray = convertToArray;
/**
 * Return a version of a given string with no space characters
 * @author Arthur Zarins
*/
function removeSpaces(str) {
    while (str.indexOf(' ') > -1) {
        let space_i = str.indexOf(' ');
        str = str.slice(0, space_i) + str.slice(space_i + 1);
    }
    return str;
}
exports.removeSpaces = removeSpaces;
/**
 * @author Nate Abbott
 */
function createPrintString(board) {
    let res = "";
    board = removeSpaces(board);
    res += "-".repeat(19) + "\n";
    for (let offset = 0; offset < 9; offset++) {
        res += "|"; //left border
        for (let char = 0; char < 9; char++) {
            let x = " ";
            if (board.charAt(char + 9 * offset) != "0") {
                x = board.charAt(char + 9 * offset);
            }
            if ((char + 1) % 3 == 0) {
                res += x + "|"; // vertical gridline
            }
            else {
                res += (x + " ");
            }
        }
        res += "\n"; // begin newline
        if ((offset + 1) % 3 == 0) {
            res += "-".repeat(19); // horizontal gridline
            if ((offset + 1) != 9)
                res += "\n"; //begin newline
        }
    }
    return res;
}
exports.createPrintString = createPrintString;
function printBoard(board) {
    console.log(createPrintString(board));
}
/**
 * If a number is a candidate for only one box in a row, make that box the number
 * @author Arthur Zarins
 */
function oneCandidateInRow(board) {
    let changed = false;
    for (let currRow = 0; currRow < 9; currRow++) {
        // create an object storing columns of each item
        let numberCandidates = {};
        for (let i = 1; i < 10; i++) {
            numberCandidates[i] = [];
        }
        // find where each number is a candidate in each column
        for (let currCol = 0; currCol < 9; currCol++) {
            for (let i = 0; i < board[currRow][currCol].length; i++) {
                let candidate = board[currRow][currCol][i];
                numberCandidates[candidate].push(currCol); //add columns
            }
        }
        // check if any numbers are a candidate in only one column
        for (let i = 1; i < 10; i++) {
            if (numberCandidates[i].length == 1) {
                let col = numberCandidates[i][0];
                if (board[currRow][col].length > 1) {
                    // eliminate other candidates in the box
                    board[currRow][col] = [i];
                    changed = true;
                }
            }
        }
    }
    return changed;
}
exports.oneCandidateInRow = oneCandidateInRow;
/**
 * If a number is a candidate for only one box in a row, make that box the number
 * @author Arthur Zarins
 */
function oneCandidateInCol(board) {
    let changed = false;
    for (let currCol = 0; currCol < 9; currCol++) {
        // create an object storing columns of each item
        let numberCandidates = {};
        for (let i = 1; i < 10; i++) {
            numberCandidates[i] = [];
        }
        // find where each number is a candidate in each column
        for (let currRow = 0; currRow < 9; currRow++) {
            for (let i = 0; i < board[currRow][currCol].length; i++) {
                let candidate = board[currRow][currCol][i];
                numberCandidates[candidate].push(currRow); //add row to occurances
            }
        }
        // check if any numbers are a candidate in only one column
        for (let i = 1; i < 10; i++) {
            if (numberCandidates[i].length == 1) {
                let row = numberCandidates[i][0];
                if (board[row][currCol].length > 1) {
                    // eliminate other candidates in the box
                    board[row][currCol] = [i];
                    changed = true;
                }
            }
        }
    }
    return changed;
}
exports.oneCandidateInCol = oneCandidateInCol;
/**
 * @param board a 3d array of the board
 * @returns a string representation of the board
 */
function convertToString(board) {
    let res = "";
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col].length == 1) {
                res += board[row][col];
            }
            else {
                res += "0"; //unknown value
            }
        }
    }
    return res;
}
exports.convertToString = convertToString;
/**
 * @returns true if game is completed and solved, false otherwise
 * @author Arthur Zarins
 */
function isSolved(str) {
    let game = convertToArray(str);
    //verify each row contains nine unique digits
    for (let row = 0; row < 9; row++) {
        let digits = new Set();
        for (let col = 0; col < 9; col++) {
            if (game[row][col].length != 1)
                return false;
            digits.add(game[row][col][0]);
        }
        if (digits.size < 9)
            return false;
    }
    //verify each column contains nine unique digits
    for (let col = 0; col < 9; col++) {
        let digits = new Set();
        for (let row = 0; row < 9; row++) {
            if (game[row][col].length != 1)
                return false;
            digits.add(game[row][col][0]);
        }
        if (digits.size < 9)
            return false;
    }
    //verify each 3x3 square contains nine unique digits
    for (let grid = 0; grid < 9; grid++) {
        let digits = new Set();
        let row_i = (grid % 3) * 3;
        let col_i = Math.floor(grid / 3) * 3;
        for (let row = row_i; row < row_i + 3; row++) {
            for (let col = col_i; col < col_i + 3; col++) {
                if (game[row][col].length != 1)
                    return false;
                digits.add(game[row][col][0]);
            }
        }
        if (digits.size < 9)
            return false;
    }
    return true; //all checks have passed
}
exports.isSolved = isSolved;
/**
 * @param board
 * @author Nate Abbott
 * For individualSolved, scanRows, scanCols, and scanBoxes
 */
function individualSolved(board, row, col) {
    //If the spot has only one solution (array of one) then return true, else return false
    return board[row][col].length == 1;
}
exports.individualSolved = individualSolved;
/**
 * Remove duplicate candidates from a row
 * @author Nate Abbott
 */
function scanRows(board) {
    let changed = false;
    //Board = x,y,avaiable
    //Look at every row
    for (let currRow = 0; currRow < 9; currRow++) {
        //create a var that holds which numbers are know in a row
        let numsInRow = [];
        // look at every spot in the row
        for (let currCol = 0; currCol < 9; currCol++) {
            // add to numInRow if the spot is know
            if (individualSolved(board, currRow, currCol)) {
                numsInRow.push(board[currRow][currCol][0]);
            }
        }
        // look at every spot in the row
        for (let currCol = 0; currCol < 9; currCol++) {
            // look at every num that needs to be deleted
            for (let numSolved = 0; numSolved < numsInRow.length; numSolved++) {
                // See if the spot has that number (if it's already deleted, do nothing)
                if (board[currRow][currCol].length != 1 && board[currRow][currCol].includes(numsInRow[numSolved])) {
                    // Find index that needs to be deleted
                    let indexToDelete = board[currRow][currCol].indexOf(numsInRow[numSolved]);
                    // Delete the number thats already been solved
                    board[currRow][currCol].splice(indexToDelete, 1);
                    changed = true;
                }
            }
        }
    }
    return changed;
}
exports.scanRows = scanRows;
// Copy from the scanRows - should work the same
function scanCols(board) {
    let changed = false;
    //Board = x,y,avaiable
    //Look at every row
    for (let currCol = 0; currCol < 9; currCol++) {
        //create a var that holds which numbers are know in a col
        let numsInCol = [];
        // look at every spot in the col
        for (let currRow = 0; currRow < 9; currRow++) {
            // add to numInCol if the spot is know
            if (individualSolved(board, currRow, currCol)) {
                numsInCol.push(board[currRow][currCol][0]);
            }
        }
        // look at every spot in the row
        for (let currRow = 0; currRow < 9; currRow++) {
            // look at every num that needs to be deleted
            for (let numSolved = 0; numSolved < numsInCol.length; numSolved++) {
                // See if the spot has that number (if it's already deleted, do nothing)
                if (board[currRow][currCol].length != 1 && board[currRow][currCol].includes(numsInCol[numSolved])) {
                    // Find index that needs to be deleted
                    let indexToDelete = board[currRow][currCol].indexOf(numsInCol[numSolved]);
                    // Delete the number thats already been solved
                    board[currRow][currCol].splice(indexToDelete, 1);
                    changed = true;
                }
            }
        }
    }
    return changed; //true if we made any changes to array
}
exports.scanCols = scanCols;
function scanSquares(board) {
    let changed = false;
    // Board = x,y,available
    // finding which of the nine blocks we're in
    for (let whichBox = 0; whichBox < 9; whichBox++) {
        //Finding where boxes start
        let rowStart = Math.floor(whichBox / 3) * 3;
        let colStart = (whichBox % 3) * 3;
        //create a var that holds which numbers are know in a row
        let numsInBox = [];
        //look at every spot in the box
        for (let currRow = rowStart; currRow < rowStart + 3; currRow++) {
            for (let currCol = colStart; currCol < colStart + 3; currCol++) {
                //record if the spot has only one solution
                if (individualSolved(board, currRow, currCol)) {
                    numsInBox.push(board[currRow][currCol][0]);
                }
            }
        }
        //look at every spot in the box
        for (let currRow = rowStart; currRow < rowStart + 3; currRow++) {
            for (let currCol = colStart; currCol < colStart + 3; currCol++) {
                // look at every num that needs to be deleted
                for (let numSolved = 0; numSolved < numsInBox.length; numSolved++) {
                    // See if the spot has that number (if it's already deleted, do nothing)
                    if (board[currRow][currCol].length != 1 && board[currRow][currCol].includes(numsInBox[numSolved])) {
                        // Find index that needs to be deleted
                        let indexToDelete = board[currRow][currCol].indexOf(numsInBox[numSolved]);
                        // Delete the number thats already been solved
                        board[currRow][currCol].splice(indexToDelete, 1);
                        changed = true;
                    }
                }
            }
        }
    }
    return changed; //true if we made any changes to array
}
exports.scanSquares = scanSquares;
/**
 * Solve an unsolved sudoku puzzle
 * @param str a string representation of the uncompleted board
 * @returns a string representation of the solved sudoku puzzle
 * @author Arthur Zarins
 */
function solveSudoku(str) {
    let sudokuArr = convertToArray(str);
    // repeatedly scan the board until it stops making progress
    let solving = true;
    while (solving) {
        solving = false; // no edits have been made yet
        // scan for duplicates in row/col/square
        solving = solving || scanRows(sudokuArr);
        solving = solving || scanCols(sudokuArr);
        solving = solving || scanSquares(sudokuArr);
        // scan for single candidate in row/col/square
        solving = solving || oneCandidateInRow(sudokuArr);
        solving = solving || oneCandidateInCol(sudokuArr);
    }
    // convert back to string and print result
    let solvedStr = convertToString(sudokuArr);
    return solvedStr;
}
exports.solveSudoku = solveSudoku;
console.log("file loaded");
