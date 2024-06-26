/**
 * Test cases coded with Jest
 * 
 * @author Arthur Zarins
 */

const Sudoku = require('./sudoku.js');

/** remove spaces from a string */

test('Remove space characters from \' a  b  c  \'', () => {
    expect(Sudoku.removeSpaces(" a  b  c  ")).toBe("abc");
});

test('Remove space characters from example sudoku string (spaces between each row)', () => {
    expect(Sudoku.removeSpaces("002130748 804000002 017802600 068090270 093200004 500460300 009024003 006300190 385001020"))
        .toBe("002130748804000002017802600068090270093200004500460300009024003006300190385001020");
});

/** convert string to array */

const zero = [1, 2, 3, 4, 5, 6, 7, 8, 9];
test('Convert sudoku string to 3d array', () => {
    expect(Sudoku.convertToArray('048000065 000037204 210405000 600170500 950006140 102040730 301084007 070291080 096000401'))
        .toEqual([
            [zero, [4], [8], zero, zero, zero, zero, [6], [5]],
            [zero, zero, zero, zero, [3], [7], [2], zero, [4]],
            [[2], [1], zero, [4], zero, [5], zero, zero, zero],
            [[6], zero, zero, [1], [7], zero, [5], zero, zero],
            [[9], [5], zero, zero, zero, [6], [1], [4], zero],
            [[1], zero, [2], zero, [4], zero, [7], [3], zero],
            [[3], zero, [1], zero, [8], [4], zero, zero, [7]],
            [zero, [7], zero, [2], [9], [1], zero, [8], zero],
            [zero, [9], [6], zero, zero, zero, [4], zero, [1]],
        ]);
});

/** convert array to string */

test('Convert sudoku 3d array to string', () => {
    expect(
        Sudoku.convertToString([
            [zero, [4], [8], zero, zero, zero, zero, [6], [5]],
            [zero, zero, zero, zero, [3], [7], [2], zero, [4]],
            [[2], [1], zero, [4], zero, [5], zero, zero, zero],
            [[6], zero, zero, [1], [7], zero, [5], zero, zero],
            [[9], [5], zero, zero, zero, [6], [1], [4], zero],
            [[1], zero, [2], zero, [4], zero, [7], [3], zero],
            [[3], zero, [1], zero, [8], [4], zero, zero, [7]],
            [zero, [7], zero, [2], [9], [1], zero, [8], zero],
            [zero, [9], [6], zero, zero, zero, [4], zero, [1]],
        ])
    ).toEqual("048000065000037204210405000600170500950006140102040730301084007070291080096000401");
});

/** convert string to printable multiline string */
test('Convert board string to printable multiline string', () => {
    expect(
        Sudoku.createPrintString("002130748 804000002 017802600 068090270 093200004 500460300 009024003 006300190 385001020")
    ).toBe(
        `-------------------
|    2|1 3  |7 4 8|
|8   4|     |    2|
|  1 7|8   2|6    |
-------------------
|  6 8|  9  |2 7  |
|  9 3|2    |    4|
|5    |4 6  |3    |
-------------------
|    9|  2 4|    3|
|    6|3    |1 9  |
|3 8 5|    1|  2  |
-------------------`);
});

/** verify if finished sudoku puzzles are actually solved */

test('Verify a solved sudoku is solved', () => {
    expect(Sudoku.isValid(
        '435269781 682571493 197834562 826195347 374682915 951743628 519326874 248957136 763418259'
    )).toBe(true); // This is a solved sudoku puzzle
});

test('Detect that a \'solution\' is incorrect (column 2/8 has two number 3s)', () => {
    expect(Sudoku.isValid('435269781 682571493 193834562 826195347 374682915 951743628 519326874 248957136 763418259')).toBe(false);
});

test('Detect that a \'solution\' is incorrect (row 8/8 has two number 7s)', () => {
    expect(Sudoku.isValid(
        '435269781 682571493 197834562 826195347 374682915 951743627 519326874 248957136 763418259'
    )).toBe(false);
});

test('Detect that a \'solution\' is incorrect (grid 2/8 has two number 4s)', () => {
    expect(Sudoku.isValid(
        '435269741 682571493 197834562 826195347 374682915 951743627 519326874 248957136 763418259'
    )).toBe(false);
});

/**
 *  Solve sudoku puzzles
 *  Example puzzles and solutions from https://sandiway.arizona.edu/sudoku/examples.html
*/

// Easy puzzle 1
test('Solve the following sudoku (rated Easy): "002130748 804000002 017802600 068090270 093200004 500460300 009024003 006300190 385001020"', () => {
    expect(Sudoku.solveSudoku("002130748 804000002 017802600 068090270 093200004 500460300 009024003 006300190 385001020"))
        .toBe("652139748834756912917842635468593271793218564521467389179624853246385197385971426");
});

// Easy puzzle 2
test('Solve the following sudoku (rated Easy): "100489006 730000040 000001295 007120600 500703008 006095700 914600000 020000037 800512004"', () => {
    expect(Sudoku.solveSudoku("100489006 730000040 000001295 007120600 500703008 006095700 914600000 020000037 800512004"))
        .toBe("152489376739256841468371295387124659591763428246895713914637582625948137873512964");
});

console.log("beginning intermediate puzzle 1");

// Intermediate puzzle 1
test('Solve the following sudoku (rated Intermediate): "020608000 580009700 000040000 370000500 600000004 008000013 000020000 009800036 000306090"', () => {
    expect(Sudoku.solveSudoku("020608000 580009700 000040000 370000500 600000004 008000013 000020000 009800036 000306090"))
        .toBe(Sudoku.removeSpaces("123678945 584239761 967145328 372461589 691583274 458792613 836924157 219857436 745316892"));
});

console.log("beginning difficult puzzle 1");

// Difficult puzzle 1
test('Solve the following sudoku (rated Difficult): "000600400 700003600 000091080 000000000 050180003 000306045 040200060 903000000 020000100"', () => {
    expect(Sudoku.solveSudoku("000600400 700003600 000091080 000000000 050180003 000306045 040200060 903000000 020000100"))
        .toBe(Sudoku.removeSpaces("581672439 792843651 364591782 438957216 256184973 179326845 845219367 913768524 627435198"));
});