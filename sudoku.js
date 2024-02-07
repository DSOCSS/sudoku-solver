/**
 * Sudoku solving program
 * @author Arthur Zarins
 */
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
                currRow.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }
            else {
                currRow.push([Number(str.charAt(row * 9 + col))]);
            }
        }
        arr.push(currRow);
    }
    return arr;
}
/** Return a version of a given string with no space characters */
function removeSpaces(str) {
    while (str.indexOf(' ') > -1) {
        var space_i = str.indexOf(' ');
        str = str.slice(0, space_i) + str.slice(space_i + 1);
    }
    return str;
}
/**
 * @param board a 3d array of the board
 * @returns a string representation of the board
 */
function convertToString(board) {
    return "";
}
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
    return true;
}
/**
 * @param str a string representation of the uncompleted board
 * @returns a string representation of the solved sudoku puzzle
 */
function solveSudoku(str) {
}
module.exports = { removeSpaces: removeSpaces, convertToArray: convertToArray, isSolved: isSolved };
