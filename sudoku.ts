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
 * @param board a 3d array of the board
 * @returns a string representation of the board
 */
function convertToString(board: Array<Array<Array<Number>>>): string {
    return "";
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

// module.exports = { removeSpaces, convertToArray, isSolved };