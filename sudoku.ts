/**
 * Sudoku solving program
 * @author Arthur Zarins
 */

/**
 * @param board a string representation of a board. Whitespace is ignored.
 * @returns a 3d array representing a board, with possible candidate lists for each square
 */
export function convertToArray(str: string): Array<Array<Array<Number>>> {
    str = removeSpaces(str); //remove space characters
    let arr: Array<Array<Array<Number>>> = [];
    for (let row = 0; row < 9; row++) {
        let currRow: Array<Array<Number>> = [];
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

/** Return a version of a given string with no space characters */
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
            if((offset + 1) != 9) res += "\n"; //begin newline
        }
    }
    return res;
}

function printBoard(board: string) {
    console.log(createPrintString(board));
}

printBoard("002130748 804000002 017802600 068090270 093200004 500460300 009024003 006300190 385001020");


/**
 * @param board 
 * @author Nate Abbott
 * For individualSolved, scanRows, scanCols, and scanBoxes
 */

export function individualSolved(board: Array<Array<Array<Number>>>,row:number,col:number):boolean{
    //If the spot has only one solution (array of one) then return true, else return false
    return board[row][col].length==1;
}

//Testing individualSolved:
let natesArr: Array<Array<Array<Number>>> = convertToArray("002130748 804000002 017802600 068090270 093200004 500460300 009024003 006300190 385001020")
console.log("start");
for(let currRow: number = 0; currRow < 9; currRow){
    for (let currCol: number = 0; currCol < 9; currCol++) {
        console.log(individualSolved(natesArr,currRow,currCol));
    }
}

export function scanRows(board: Array<Array<Array<Number>>>){
    //Board = x,y,avaiable
    //Look at every row
    for(let currRow: number = 0; currRow < 9; currRow){
        //create a var that holds which numbers are know in a row
        let numsInRow: Array<Number> = [];
        // look at every spot in the row
        for (let currCol: number = 0; currCol < 9; currCol++) {
            // add to numInRow if the spot is know
            if(individualSolved(board,currRow,currCol)){
                numsInRow.push(board[currRow][currCol][0])
            }
        }
        // look at every spot in the row
        for (let currCol: number = 0; currCol < 9; currCol++) {
            // look at every num that needs to be deleted
            for(let numSolved: number = 0; numSolved < numsInRow.length; numSolved++){
                // See if the spot has that number (if it's already deleted, do nothing)
                if(board[currRow][currCol].includes(numsInRow[numSolved])){
                    // Find index that needs to be deleted
                    let indexToDelete: number = board[currRow][currCol].indexOf(numsInRow[numSolved]);
                    // Delete the number thats already been solved
                    board[currRow][currCol].splice(indexToDelete);
                }
            }
        }
    }
}

//Testing scanRows:


// Copy from the scanRows - should work the same
export function scanCols(board: Array<Array<Array<Number>>>){
    //Board = x,y,avaiable
    //Look at every row
    for(let currCol: number = 0; currCol < 9; currCol){
        //create a var that holds which numbers are know in a col
        let numsInCol: Array<Number> = [];
        // look at every spot in the col
        for (let currRow: number = 0; currRow < 9; currRow++) {
            // add to numInCol if the spot is know
            if(individualSolved(board,currRow,currCol)){
                numsInCol.push(board[currRow][currCol][0])
            }
        }
        // look at every spot in the row
        for (let currRow: number = 0; currRow < 9; currRow++) {
            // look at every num that needs to be deleted
            for(let numSolved: number = 0; numSolved < numsInCol.length; numSolved++){
                // See if the spot has that number (if it's already deleted, do nothing)
                if(board[currRow][currCol].includes(numsInCol[numSolved])){
                    // Find index that needs to be deleted
                    let indexToDelete: number = board[currRow][currCol].indexOf(numsInCol[numSolved]);
                    // Delete the number thats already been solved
                    board[currRow][currCol].splice(indexToDelete);
                }
            }
        }
    }
}

export function scanSquares(board: Array<Array<Array<Number>>>){
    // Board = x,y,available
    // finding which of the nine blocks we're in
    for(let whichBox: number = 0; whichBox < 9; whichBox++){
        //Finding where boxes start
        let rowStart: number = (whichBox/3)*3;
        let colStart: number = (whichBox%3)*3;
        //create a var that holds which numbers are know in a row
        let numsInBox: Array<Number> = [];
        //look at every spot in the box
        for(let currRow: number = rowStart; currRow < 3; currRow++){
            for(let currCol: number = colStart; currCol < 3; currCol++){
                //record if the spot has only one solution
                if(individualSolved(board,currRow,currCol)){
                    numsInBox.push(board[currRow][currCol][0])
                }
            }
        }
        //look at every spot in the box
        for(let currRow: number = rowStart; currRow < 3; currRow++){
            for(let currCol: number = colStart; currCol < 3; currCol++){
                // look at every num that needs to be deleted
                for(let numSolved: number = 0; numSolved < numsInBox.length; numSolved++){
                    // See if the spot has that number (if it's already deleted, do nothing)
                    if(board[currRow][currCol].includes(numsInBox[numSolved])){
                         // Find index that needs to be deleted
                         let indexToDelete: number = board[currRow][currCol].indexOf(numsInBox[numSolved]);
                         // Delete the number thats already been solved
                        board[currRow][currCol].splice(indexToDelete);
                    }
                }
            }
        }            
    }
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
 * @returns true if game is completed and solved, false otherwise
 */
export function isSolved(str: string): boolean {
    let game = convertToArray(str);

    //verify each row contains nine unique digits
    for (let row = 0; row < 9; row++) {
        let digits: Set<Number> = new Set();
        for (let col = 0; col < 9; col++) {
            if (game[row][col].length != 1) return false;
            digits.add(game[row][col][0]);
        }
        if (digits.size < 9) return false;
    }

    //verify each column contains nine unique digits
    for (let col = 0; col < 9; col++) {
        let digits: Set<Number> = new Set();
        for (let row = 0; row < 9; row++) {
            if (game[row][col].length != 1) return false;
            digits.add(game[row][col][0]);
        }
        if (digits.size < 9) return false;
    }

    //verify each 3x3 square contains nine unique digits
    for (let grid = 0; grid < 9; grid++) {
        let digits: Set<Number> = new Set();
        let row_i: number = (grid % 3) * 3;
        let col_i: number = Math.floor(grid / 3) * 3;
        for (let row = row_i; row < row_i + 3; row++) {
            for (let col = col_i; col < col_i + 3; col++) {
                if (game[row][col].length != 1) return false;
                digits.add(game[row][col][0]);
            }
        }
        if (digits.size < 9) return false;
    }

    return true; //all checks have passed
}

/**
 * @param str a string representation of the uncompleted board
 * @returns a string representation of the solved sudoku puzzle 
 */
function solveSudoku(str: string) {

}