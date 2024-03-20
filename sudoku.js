"use strict";
/**
 * Sudoku solving program.
 * @author Arthur Zarins
 * @author Nate Abbott
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.solveSudoku = exports.scanSquares = exports.scanCols = exports.scanRows = exports.individualSolved = exports.backtraceSolve = exports.filledPuzzle = exports.isBoxValid = exports.OLD_isValidArr = exports.isValid = exports.convertToString = exports.oneCandidateInCol = exports.oneCandidateInRow = exports.createPrintString = exports.removeSpaces = exports.convertToArray = void 0;
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
 * If a number is a candidate for only one box in a col, make that box the number
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
 * @returns true if game valid (no conflicts), false otherwise
 * The game does not have to be fully solved to be valid
 *
 * TODO: we can instead just check if the row/col/square containing the changed coordinate is valid, and it will be 9x efficient. Do this later!
 * @author Arthur Zarins
 */
function isValid(str) {
    let game = convertToArray(str);
    //verify each row has no repeating digits
    for (let row = 0; row < 9; row++) {
        let digits = new Set();
        for (let col = 0; col < 9; col++) {
            // only look for filled in boxes
            if (game[row][col].length == 1) {
                if (digits.has(game[row][col][0])) {
                    rowConflicts++;
                    return false; //digit already exists
                }
                digits.add(game[row][col][0]);
            }
        }
    }
    //verify each column contains nine unique digits
    for (let col = 0; col < 9; col++) {
        let digits = new Set();
        for (let row = 0; row < 9; row++) {
            // only look for filled in boxes
            if (game[row][col].length == 1) {
                if (digits.has(game[row][col][0])) {
                    colConflicts++;
                    return false; //digit already exists
                }
                digits.add(game[row][col][0]);
            }
        }
    }
    //verify each 3x3 square contains nine unique digits
    for (let grid = 0; grid < 9; grid++) {
        let digits = new Set();
        let row_i = (grid % 3) * 3;
        let col_i = Math.floor(grid / 3) * 3;
        for (let row = row_i; row < row_i + 3; row++) {
            for (let col = col_i; col < col_i + 3; col++) {
                // only look for filled in boxes
                if (game[row][col].length == 1) {
                    if (digits.has(game[row][col][0])) {
                        sqConflicts++;
                        return false; //digit already exists
                    }
                    digits.add(game[row][col][0]);
                }
            }
        }
    }
    return true; //all checks have passed
}
exports.isValid = isValid;
// old method (will be retired)
function OLD_isValidArr(arr) {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] <= 9) {
            str = str + arr[i];
        }
        else {
            //console.log("WARNING: SPOTTED GREATER THAN 10;");
            return false;
        }
    }
    return isValid(str);
}
exports.OLD_isValidArr = OLD_isValidArr;
// get 2d coordinates of a scalar index
function getCoords(index) {
    return {
        row: Math.floor(index / 9),
        col: index % 9
    };
}
// convert 2d coordinates to scalar index
function convertTo1D(row, col) {
    return row * 9 + col;
}
/**
 * See if the col/row/square containing a box are valid
 */
var rowConflicts = 0;
var colConflicts = 0;
var sqConflicts = 0;
function isBoxValid(arr, index) {
    let boxVal = arr[index];
    if (boxVal >= 10)
        return false; // values of 10+ not allowed
    if (boxVal == 0)
        return true; // box is blank; no conflicts
    let boxRow = getCoords(index).row;
    let boxCol = getCoords(index).col;
    //verify the digit in the given box doesn't repeat in the row
    for (let col = 0; col < 9; col++) {
        let checkI = convertTo1D(boxRow, col);
        if (checkI >= arr.length)
            console.log("OVERFLOW");
        if (arr[checkI] == boxVal && checkI != index) {
            rowConflicts++;
            //console.log("row conflict");
            return false;
        }
    }
    //verify the digit in the given box doesn't repeat in the column
    for (let row = 0; row < 9; row++) {
        let checkI = convertTo1D(row, boxCol);
        if (checkI >= arr.length)
            console.log("OVERFLOW");
        if (arr[checkI] == boxVal && checkI != index) {
            colConflicts++;
            //console.log("column conflict");
            return false;
        }
    }
    //verify the digit in the given box doesn't repeat in the 3x3 square
    // calculate box starting digits
    let sq_row_i = Math.floor(boxRow / 3) * 3;
    let sq_col_i = Math.floor(boxCol / 3) * 3;
    //console.log(`Starting sq search at ${sq_row_i} ${sq_col_i}`);
    for (let row = sq_row_i; row < sq_row_i + 3; row++) {
        for (let col = sq_col_i; col < sq_col_i + 3; col++) {
            let checkI = convertTo1D(row, col);
            if (checkI >= arr.length)
                console.log("OVERFLOW");
            if (arr[checkI] == boxVal && checkI != index) {
                sqConflicts++;
                //console.log(`square conflict at ${row} ${col}`);
                return false;
            }
        }
    }
    return true; //passed all checks
}
exports.isBoxValid = isBoxValid;
/**
 * @returns true if every cell in the game is filled (not 0)
 */
function filledPuzzle(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == 0)
            return false;
    }
    return true; // there are no empty sqaures
}
exports.filledPuzzle = filledPuzzle;
function arr1D_toStr(arr) {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        str = str + arr[i];
    }
    return str;
}
/**
 * @returns a string of the solved sudoku
 * @author Arthur Zarins
 */
function backtraceSolve(str) {
    let varIndicies = []; //indicies we will change
    let values = []; // store string values in array
    //determine where the zeros are
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) == "0") {
            varIndicies.push(Number(i));
        }
        values.push(Number(str.charAt(i)));
    }
    /*console.log("varIndicies: ", varIndicies);
    console.log("initial values", values);
    console.log("# initial values", values.length);*/
    // repeatedly solve until puzzle is complete and valid
    let zeroI = 0;
    let iteration = 0;
    while (zeroI >= 0 && zeroI < varIndicies.length) {
        // keep proceeding in DFS until a conflict occurs
        let currNum = values[varIndicies[zeroI]]; //Number(solStr.charAt(varIndicies[zeroI]));
        if (currNum >= 10) {
            //no options work; make the box blank again
            values[varIndicies[zeroI]] = 0; //solStr = setCharAt(solStr, varIndicies[zeroI], "0");
            // move back one box and increment that
            zeroI--;
            if (zeroI >= 0)
                values[varIndicies[zeroI]]++;
        }
        else {
            // testing if the new boxValid method and OldIsValid methods disagree
            if (isBoxValid(values, varIndicies[zeroI]) != OLD_isValidArr(values)) {
                console.log("CONFLICT!");
                printBoard(arr1D_toStr(values));
                console.log(`isBox focusing on ${varIndicies[zeroI]} says `, isBoxValid(values, varIndicies[zeroI]), " while oldIsValidArr says ", OLD_isValidArr(values));
                console.log(getCoords(varIndicies[zeroI]));
                console.log();
            }
            if (isBoxValid(values, varIndicies[zeroI]) && currNum > 0) {
                // the entry is filled and the board is valid
                zeroI++; //move to the next zero item
            }
            else {
                // the box invalidated the board or the box is empty
                // increment the number
                values[varIndicies[zeroI]]++;
            }
        }
        //if (iteration % 10000 == 0) console.log("iteration: " + iteration + ",\t\tzeroI: " + zeroI);
        iteration++;
    }
    /*console.log("zeroI:", zeroI, "/ valid:", OLD_isValidArr(values), "/ filled", filledPuzzle(values));
    console.log("done solving, iteration " + iteration);
    console.log("final values: ", values);
    console.log("Last value: ", values[values.length - 1], values[values.length - 2]);
    console.log("# final values: ", values.length);
    console.log(rowConflicts, colConflicts, sqConflicts);*/
    return arr1D_toStr(values);
}
exports.backtraceSolve = backtraceSolve;
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
    // use backtracking to complete the solve
    solvedStr = backtraceSolve(solvedStr);
    return solvedStr;
}
exports.solveSudoku = solveSudoku;
function testProgram() {
    // let exPuzzle = "020608000 580009700 000040000 370000500 600000004 008000013 000020000 009800036 000306090"; //intermediate
    let exPuzzle = "000600400 700003600 000091080 000000000 050180003 000306045 040200060 903000000 020000100"; //difficult
    let startTime = new Date().getTime();
    console.log("We will solve the following sudoku:");
    printBoard(exPuzzle);
    let solvedPuzzle = solveSudoku(exPuzzle);
    console.log("solved!");
    printBoard(solvedPuzzle);
    let msElapsed = new Date().getTime() - startTime;
    let secondsElapsed = msElapsed / 1000;
    console.log("Seconds elapsed: ", secondsElapsed);
    console.log("Checking if solution is valid: ", isValid(solvedPuzzle));
}
