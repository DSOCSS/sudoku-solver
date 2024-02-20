"use strict";
/**
 * Sudoku solving program
 * @author Arthur Zarins
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSolved = exports.convertToString = exports.scanSquares = exports.scanCols = exports.scanRows = exports.individualSolved = exports.createPrintString = exports.removeSpaces = exports.convertToArray = void 0;
/**
 * @param board a string representation of a board. Whitespace is ignored.
 * @returns a 3d array representing a board, with possible candidate lists for each square
 */
function convertToArray(str) {
    str = removeSpaces(str); //remove space characters
    var arr = [];
    for (var row = 0; row < 9; row++) {
        var currRow = [];
        for (var col = 0; col < 9; col++) {
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
/** Return a version of a given string with no space characters */
function removeSpaces(str) {
    while (str.indexOf(' ') > -1) {
        var space_i = str.indexOf(' ');
        str = str.slice(0, space_i) + str.slice(space_i + 1);
    }
    return str;
}
exports.removeSpaces = removeSpaces;
/**
 * @author Nate Abbott
 */
function createPrintString(board) {
    var res = "";
    board = removeSpaces(board);
    res += "-".repeat(19) + "\n";
    for (var offset = 0; offset < 9; offset++) {
        res += "|"; //left border
        for (var char = 0; char < 9; char++) {
            var x = " ";
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
printBoard("002130748 804000002 017802600 068090270 093200004 500460300 009024003 006300190 385001020");
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
//Testing individualSolved:
var natesArr = convertToArray("002130748 804000002 017802600 068090270 093200004 500460300 009024003 006300190 385001020");
console.log("start");
/*
for (let currRow: number = 0; currRow < 9; currRow++) {
    for (let currCol: number = 0; currCol < 9; currCol++) {
        console.log(individualSolved(natesArr, currRow, currCol));
    }
}
*/
function scanRows(board) {
    //Board = x,y,avaiable
    //Look at every row
    for (var currRow = 0; currRow < 9; currRow++) {
        //create a var that holds which numbers are know in a row
        var numsInRow = [];
        // look at every spot in the row
        for (var currCol = 0; currCol < 9; currCol++) {
            // add to numInRow if the spot is know
            if (individualSolved(board, currRow, currCol)) {
                numsInRow.push(board[currRow][currCol][0]);
            }
        }
        console.log(numsInRow);
        // look at every spot in the row
        for (var currCol = 0; currCol < 9; currCol++) {
            // look at every num that needs to be deleted
            for (var numSolved = 0; numSolved < numsInRow.length; numSolved++) {
                // See if the spot has that number (if it's already deleted, do nothing)
                console.log(numsInRow[numSolved]);
                if (board[currRow][currCol].length != 1 && board[currRow][currCol].includes(numsInRow[numSolved])) {
                    // Find index that needs to be deleted
                    var indexToDelete = board[currRow][currCol].indexOf(numsInRow[numSolved]);
                    console.log(indexToDelete);
                    // Delete the number thats already been solved
                    board[currRow][currCol].splice(indexToDelete, 1);
                    console.log(board[currRow][currCol]);
                }
            }
        }
    }
}
exports.scanRows = scanRows;
// Copy from the scanRows - should work the same
function scanCols(board) {
    //Board = x,y,avaiable
    //Look at every row
    for (var currCol = 0; currCol < 9; currCol++) {
        //create a var that holds which numbers are know in a col
        var numsInCol = [];
        // look at every spot in the col
        for (var currRow = 0; currRow < 9; currRow++) {
            // add to numInCol if the spot is know
            if (individualSolved(board, currRow, currCol)) {
                numsInCol.push(board[currRow][currCol][0]);
            }
        }
        // look at every spot in the row
        for (var currRow = 0; currRow < 9; currRow++) {
            // look at every num that needs to be deleted
            for (var numSolved = 0; numSolved < numsInCol.length; numSolved++) {
                // See if the spot has that number (if it's already deleted, do nothing)
                if (board[currRow][currCol].length != 1 && board[currRow][currCol].includes(numsInCol[numSolved])) {
                    // Find index that needs to be deleted
                    var indexToDelete = board[currRow][currCol].indexOf(numsInCol[numSolved]);
                    // Delete the number thats already been solved
                    board[currRow][currCol].splice(indexToDelete, 1);
                }
            }
        }
    }
}
exports.scanCols = scanCols;
function scanSquares(board) {
    // Board = x,y,available
    // finding which of the nine blocks we're in
    for (var whichBox = 0; whichBox < 9; whichBox++) {
        //Finding where boxes start
        // console.log(whichBox/3);
        // console.log(Math.floor(whichBox/3));
        var rowStart = Math.floor(whichBox / 3) * 3;
        var colStart = (whichBox % 3) * 3;
        //create a var that holds which numbers are know in a row
        var numsInBox = [];
        //look at every spot in the box
        for (var currRow = rowStart; currRow < rowStart + 3; currRow++) {
            for (var currCol = colStart; currCol < colStart + 3; currCol++) {
                //record if the spot has only one solution
                if (individualSolved(board, currRow, currCol)) {
                    numsInBox.push(board[currRow][currCol][0]);
                }
            }
        }
        //look at every spot in the box
        for (var currRow = rowStart; currRow < rowStart + 3; currRow++) {
            for (var currCol = colStart; currCol < colStart + 3; currCol++) {
                // look at every num that needs to be deleted
                for (var numSolved = 0; numSolved < numsInBox.length; numSolved++) {
                    // See if the spot has that number (if it's already deleted, do nothing)
                    if (board[currRow][currCol].length != 1 && board[currRow][currCol].includes(numsInBox[numSolved])) {
                        // Find index that needs to be deleted
                        var indexToDelete = board[currRow][currCol].indexOf(numsInBox[numSolved]);
                        // Delete the number thats already been solved
                        board[currRow][currCol].splice(indexToDelete, 1);
                    }
                }
            }
        }
    }
}
exports.scanSquares = scanSquares;
scanRows(natesArr);
scanCols(natesArr);
scanSquares(natesArr);
console.log("start");
for (var currRow = 0; currRow < 9; currRow++) {
    for (var currCol = 0; currCol < 9; currCol++) {
        console.log(natesArr[currRow][currCol]);
    }
}
/**
 * @param board a 3d array of the board
 * @returns a string representation of the board
 */
function convertToString(board) {
    var res = "";
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
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
 */
function isSolved(str) {
    var game = convertToArray(str);
    //verify each row contains nine unique digits
    for (var row = 0; row < 9; row++) {
        var digits = new Set();
        for (var col = 0; col < 9; col++) {
            if (game[row][col].length != 1)
                return false;
            digits.add(game[row][col][0]);
        }
        if (digits.size < 9)
            return false;
    }
    //verify each column contains nine unique digits
    for (var col = 0; col < 9; col++) {
        var digits = new Set();
        for (var row = 0; row < 9; row++) {
            if (game[row][col].length != 1)
                return false;
            digits.add(game[row][col][0]);
        }
        if (digits.size < 9)
            return false;
    }
    //verify each 3x3 square contains nine unique digits
    for (var grid = 0; grid < 9; grid++) {
        var digits = new Set();
        var row_i = (grid % 3) * 3;
        var col_i = Math.floor(grid / 3) * 3;
        for (var row = row_i; row < row_i + 3; row++) {
            for (var col = col_i; col < col_i + 3; col++) {
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
 * @param str a string representation of the uncompleted board
 * @returns a string representation of the solved sudoku puzzle
 */
function solveSudoku(str) {
}
