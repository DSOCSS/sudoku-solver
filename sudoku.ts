/**
 * Sudoku solving program.
 * @author Arthur Zarins
 * @author Nate Abbott
 */

/**
 * @param board a string representation of a board. Whitespace is ignored.
 * @returns a 3d array representing a board, with possible candidate lists for each square
 * @author Arthur Zarins
 */
export function convertToArray(str: string): Array<Array<Array<number>>> {
    str = removeSpaces(str); //remove space characters
    let arr: Array<Array<Array<number>>> = [];
    for (let row = 0; row < 9; row++) {
        let currRow: Array<Array<number>> = [];
        for (let col = 0; col < 9; col++) {
            if (str.charAt(row * 9 + col) == "0") {
                //empty squares can become any number
                currRow.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            } else {
                //filled squares can only be that number
                currRow.push([Number(str.charAt(row * 9 + col))]);
            }
        }
        arr.push(currRow);
    }
    return arr;
}

/** 
 * Return a version of a given string with no space characters 
 * @author Arthur Zarins
*/
export function removeSpaces(str: string): string {
    while (str.indexOf(' ') > -1) {
        let space_i = str.indexOf(' ');
        str = str.slice(0, space_i) + str.slice(space_i + 1);
    }
    return str;
}

/**
 * @author Nate Abbott
 */
export function createPrintString(board: string) {
    let res: string = "";
    board = removeSpaces(board);
    res += "-".repeat(19) + "\n";
    for (let offset: number = 0; offset < 9; offset++) {
        res += "|"; //left border
        for (let char: number = 0; char < 9; char++) {
            let x: string = " ";
            if (board.charAt(char + 9 * offset) != "0") {
                x = board.charAt(char + 9 * offset);
            }
            if ((char + 1) % 3 == 0) {
                res += x + "|"; // vertical gridline
            } else {
                res += (x + " ");
            }
        }
        res += "\n"; // begin newline
        if ((offset + 1) % 3 == 0) {
            res += "-".repeat(19); // horizontal gridline
            if ((offset + 1) != 9) res += "\n"; //begin newline
        }
    }
    return res;
}

function printBoard(board: string) {
    console.log(createPrintString(board));
}

/**
 * If a number is a candidate for only one box in a row, make that box the number 
 * @author Arthur Zarins
 */
export function oneCandidateInRow(board: Array<Array<Array<number>>>): boolean {
    let changed: boolean = false;
    for (let currRow: number = 0; currRow < 9; currRow++) {
        // create an object storing columns of each item
        let numberCandidates: Object = {};
        for (let i = 1; i < 10; i++) {
            numberCandidates[i] = [];
        }
        // find where each number is a candidate in each column
        for (let currCol: number = 0; currCol < 9; currCol++) {
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

/**
 * If a number is a candidate for only one box in a col, make that box the number 
 * @author Arthur Zarins
 */
export function oneCandidateInCol(board: Array<Array<Array<number>>>): boolean {
    let changed: boolean = false;
    for (let currCol: number = 0; currCol < 9; currCol++) {
        // create an object storing columns of each item
        let numberCandidates: Object = {};
        for (let i = 1; i < 10; i++) {
            numberCandidates[i] = [];
        }
        // find where each number is a candidate in each column
        for (let currRow: number = 0; currRow < 9; currRow++) {
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

/**
 * @param board a 3d array of the board
 * @returns a string representation of the board
 */
export function convertToString(board: Array<Array<Array<Number>>>): string {
    let res: string = "";
    for (let row: number = 0; row < 9; row++) {
        for (let col: number = 0; col < 9; col++) {
            if (board[row][col].length == 1) {
                res += board[row][col];
            } else {
                res += "0"; //unknown value
            }
        }
    }
    return res;
}

/**
 * @returns true if game valid (no conflicts), false otherwise
 * The game does not have to be fully solved to be valid
 * 
 * TODO: we can instead just check if the row/col/square containing the changed coordinate is valid, and it will be 9x efficient. Do this later!
 * @author Arthur Zarins
 */
export function isValid(str: string): boolean {
    let game = convertToArray(str);

    //verify each row has no repeating digits
    for (let row = 0; row < 9; row++) {
        let digits: Set<Number> = new Set();
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
        let digits: Set<Number> = new Set();
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
        let digits: Set<Number> = new Set();
        let row_i: number = (grid % 3) * 3;
        let col_i: number = Math.floor(grid / 3) * 3;
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

// old method (will be retired)
export function OLD_isValidArr(arr: number[]): boolean {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] <= 9) {
            str = str + arr[i];
        } else {
            //console.log("WARNING: SPOTTED GREATER THAN 10;");
            return false;
        }
    }
    return isValid(str);
}

// get 2d coordinates of a scalar index
function getCoords(index: number) {
    return {
        row: Math.floor(index / 9),
        col: index % 9
    }
}

// convert 2d coordinates to scalar index
function convertTo1D(row: number, col: number) {
    return row * 9 + col;
}

/**
 * See if the col/row/square containing a box are valid
 */

var rowConflicts = 0;
var colConflicts = 0;
var sqConflicts = 0;

export function isBoxValid(arr: number[], index: number): boolean {
    let boxVal = arr[index];
    if (boxVal >= 10) return false; // values of 10+ not allowed
    if (boxVal == 0) return true; // box is blank; no conflicts
    let boxRow = getCoords(index).row;
    let boxCol = getCoords(index).col;

    //verify the digit in the given box doesn't repeat in the row
    for (let col = 0; col < 9; col++) {
        let checkI = convertTo1D(boxRow, col);
        if (checkI >= arr.length) console.log("OVERFLOW");
        if (arr[checkI] == boxVal && checkI != index) {
            rowConflicts++;
            //console.log("row conflict");
            return false;
        }
    }

    //verify the digit in the given box doesn't repeat in the column
    for (let row = 0; row < 9; row++) {
        let checkI = convertTo1D(row, boxCol);
        if (checkI >= arr.length) console.log("OVERFLOW");
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
            if (checkI >= arr.length) console.log("OVERFLOW");
            if (arr[checkI] == boxVal && checkI != index) {
                sqConflicts++;
                //console.log(`square conflict at ${row} ${col}`);
                return false;
            }
        }
    }

    return true; //passed all checks
}

/**
 * @returns true if every cell in the game is filled (not 0)
 */
export function filledPuzzle(arr: number[]): boolean {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == 0) return false;
    }
    return true; // there are no empty sqaures
}

function arr1D_toStr(arr: number[]): string {
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
export function backtraceSolve(str: string): string {
    let varIndicies: number[] = []; //indicies we will change
    let values: number[] = []; // store string values in array

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
            if (zeroI >= 0) values[varIndicies[zeroI]]++;
        } else {
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
            } else {
                // the box invalidated the board or the box is empty
                // increment the number
                values[varIndicies[zeroI]]++;
            }
        }
        if (iteration % 10000 == 0 && document != undefined) {
            let status = document.getElementById("statusUpdate");
            if(status != undefined) status.innerHTML = `iteration ${iteration} (index=${zeroI})`;
        }
        //if (iteration % 10000 == 0) console.log("iteration: " + iteration + ",\t\tzeroI: " + zeroI);
        iteration++;
    }

    // clear status message
    if (document != undefined) {
        let status = document.getElementById("statusUpdate");
        if(status != undefined) status.innerHTML = '';
    }

    /*console.log("zeroI:", zeroI, "/ valid:", OLD_isValidArr(values), "/ filled", filledPuzzle(values));
    console.log("done solving, iteration " + iteration);
    console.log("final values: ", values);
    console.log("Last value: ", values[values.length - 1], values[values.length - 2]);
    console.log("# final values: ", values.length);
    console.log(rowConflicts, colConflicts, sqConflicts);*/
    return arr1D_toStr(values);
}

/**
 * @param board 
 * @author Nate Abbott
 * For individualSolved, scanRows, scanCols, and scanBoxes
 */
export function individualSolved(board: Array<Array<Array<Number>>>, row: number, col: number): boolean {
    //If the spot has only one solution (array of one) then return true, else return false
    return board[row][col].length == 1;
}

/**
 * Remove duplicate candidates from a row
 * @author Nate Abbott
 */
export function scanRows(board: Array<Array<Array<number>>>): boolean {
    let changed: boolean = false;
    //Board = x,y,avaiable
    //Look at every row
    for (let currRow: number = 0; currRow < 9; currRow++) {
        //create a var that holds which numbers are know in a row
        let numsInRow: Array<number> = [];
        // look at every spot in the row
        for (let currCol: number = 0; currCol < 9; currCol++) {
            // add to numInRow if the spot is know
            if (individualSolved(board, currRow, currCol)) {
                numsInRow.push(board[currRow][currCol][0])
            }
        }
        // look at every spot in the row
        for (let currCol: number = 0; currCol < 9; currCol++) {
            // look at every num that needs to be deleted
            for (let numSolved: number = 0; numSolved < numsInRow.length; numSolved++) {
                // See if the spot has that number (if it's already deleted, do nothing)
                if (board[currRow][currCol].length != 1 && board[currRow][currCol].includes(numsInRow[numSolved])) {
                    // Find index that needs to be deleted
                    let indexToDelete: number = board[currRow][currCol].indexOf(numsInRow[numSolved]);
                    // Delete the number thats already been solved
                    board[currRow][currCol].splice(indexToDelete, 1);
                    changed = true;
                }
            }
        }
    }
    return changed;
}

// Copy from the scanRows - should work the same
export function scanCols(board: Array<Array<Array<number>>>): boolean {
    let changed: boolean = false;
    //Board = x,y,avaiable
    //Look at every row
    for (let currCol: number = 0; currCol < 9; currCol++) {
        //create a var that holds which numbers are know in a col
        let numsInCol: Array<number> = [];
        // look at every spot in the col
        for (let currRow: number = 0; currRow < 9; currRow++) {
            // add to numInCol if the spot is know
            if (individualSolved(board, currRow, currCol)) {
                numsInCol.push(board[currRow][currCol][0])
            }
        }
        // look at every spot in the row
        for (let currRow: number = 0; currRow < 9; currRow++) {
            // look at every num that needs to be deleted
            for (let numSolved: number = 0; numSolved < numsInCol.length; numSolved++) {
                // See if the spot has that number (if it's already deleted, do nothing)
                if (board[currRow][currCol].length != 1 && board[currRow][currCol].includes(numsInCol[numSolved])) {
                    // Find index that needs to be deleted
                    let indexToDelete: number = board[currRow][currCol].indexOf(numsInCol[numSolved]);
                    // Delete the number thats already been solved
                    board[currRow][currCol].splice(indexToDelete, 1);
                    changed = true;
                }
            }
        }
    }
    return changed; //true if we made any changes to array
}

export function scanSquares(board: Array<Array<Array<number>>>): boolean {
    let changed: boolean = false;
    // Board = x,y,available
    // finding which of the nine blocks we're in
    for (let whichBox: number = 0; whichBox < 9; whichBox++) {
        //Finding where boxes start
        let rowStart: number = Math.floor(whichBox / 3) * 3;
        let colStart: number = (whichBox % 3) * 3;
        //create a var that holds which numbers are know in a row
        let numsInBox: Array<number> = [];
        //look at every spot in the box
        for (let currRow: number = rowStart; currRow < rowStart + 3; currRow++) {
            for (let currCol: number = colStart; currCol < colStart + 3; currCol++) {
                //record if the spot has only one solution
                if (individualSolved(board, currRow, currCol)) {
                    numsInBox.push(board[currRow][currCol][0])
                }
            }
        }
        //look at every spot in the box
        for (let currRow: number = rowStart; currRow < rowStart + 3; currRow++) {
            for (let currCol: number = colStart; currCol < colStart + 3; currCol++) {
                // look at every num that needs to be deleted
                for (let numSolved: number = 0; numSolved < numsInBox.length; numSolved++) {
                    // See if the spot has that number (if it's already deleted, do nothing)
                    if (board[currRow][currCol].length != 1 && board[currRow][currCol].includes(numsInBox[numSolved])) {
                        // Find index that needs to be deleted
                        let indexToDelete: number = board[currRow][currCol].indexOf(numsInBox[numSolved]);
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

/**
 * Solve an unsolved sudoku puzzle
 * @param str a string representation of the uncompleted board
 * @returns a string representation of the solved sudoku puzzle 
 * @author Arthur Zarins
 */
export function solveSudoku(str: string): string {
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

function testProgram() {
    let exPuzzle = "020608000 580009700 000040000 370000500 600000004 008000013 000020000 009800036 000306090"; //intermediate
    // let exPuzzle = "000600400 700003600 000091080 000000000 050180003 000306045 040200060 903000000 020000100"; //difficult
    let startTime = new Date().getTime();
    console.log("We will solve the following sudoku:");
    printBoard(exPuzzle);

    let solvedPuzzle = solveSudoku(exPuzzle)
    console.log("solved!");
    printBoard(solvedPuzzle);

    let msElapsed = new Date().getTime() - startTime;
    let secondsElapsed = msElapsed / 1000;
    console.log("Seconds elapsed: ", secondsElapsed);
    console.log("Checking if solution is valid: ", isValid(solvedPuzzle));
}

// create a board in an HTML file
function createHTMLBoard() {
    const borderStyle = "5px solid black";
    let htmlBoard: any = document.getElementById("sudokuBoard");
    for (let i = 0; i < 81; i++) {
        let square = document.createElement("input");
        square.type = "text";
        square.maxLength = 1;
        square.classList.add("cell");
        square.id = String(i); //store number id
        square.autocomplete = "off";

        square.oninput = () => {
            if (i < 80 && square.value != '') {
                //advance to the next square after input
                document.getElementById(String(Number(i + 1))).focus();
            } 
            // ensure user input is only numbers
            let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ''];
            if (numbers.indexOf(square.value) == -1) {
                square.value = ''; // make square blank
            }
        }
        // navigate board with arrow keys
        square.onkeyup = (evt) => {
            if(evt.key == "ArrowLeft" && i > 0){
                document.getElementById(String(Number(i - 1))).focus();
            } else if (evt.key == "ArrowRight" && i < 80){
                document.getElementById(String(Number(i + 1))).focus();
            } else if (evt.key == "ArrowDown" && i < 72){
                document.getElementById(String(Number(i + 9))).focus();
            } else if (evt.key == "ArrowUp" && i > 8){
                document.getElementById(String(Number(i - 9))).focus();
            }
        }
        htmlBoard.appendChild(square);

        if ((i + 1) % 9 == 0) {
            //start a new row
            htmlBoard.appendChild(document.createElement("div"));
        }

        // Emphasize 3x3 box borders
        if (i % 3 == 0 && i % 9 != 0) {
            square.style.borderLeft = borderStyle;
        }
        if (Math.floor(i / 9) % 3 == 0 && Math.floor(i / 9) != 0) {
            square.style.borderTop = borderStyle;
        }
    }

    // set the html offset height
    let htmlBoardOffset: any = document.getElementById("sudokuBoardOffset");
    htmlBoardOffset.height = htmlBoard.height;
    htmlBoardOffset.width = "5px";
}

function clearHTMLBoard() {
    for (let i = 0; i < 81; i++) {
        let square: any = document.getElementById(String(i));
        if (square != undefined) square.value = "";
    }
}

// parse and solve a board in an HTML file
function htmlSolveSudoku() {
    let sudokuStr = "";
    // read all square values
    for (let i = 0; i < 81; i++) {
        let square: any = document.getElementById(String(i));
        let val = square.value;
        if (val == "") val = "0";
        sudokuStr += val;
    }
    console.log(sudokuStr);

    // solve the sudoku
    let solvedPuzzle = solveSudoku(sudokuStr);
    // update the board
    for (let i = 0; i < 81; i++) {
        let square: any = document.getElementById(String(i));
        square.value = solvedPuzzle.charAt(i);
    }
    console.log("done!");
}