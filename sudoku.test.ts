/**
 * Test cases coded with Jest
 */
const { removeSpaces, convertToArray, isSolved, convertToString } = require('./sudoku');

/** remove spaces from a string */

test('Remove space characters from \' a  b  c  \'', () => {
    expect(removeSpaces(" a  b  c  ")).toBe("abc");
});

test('Remove space characters from example sudoku string (spaces between each row)', () => {
    expect(removeSpaces("002130748 804000002 017802600 068090270 093200004 500460300 009024003 006300190 385001020"))
        .toBe("002130748804000002017802600068090270093200004500460300009024003006300190385001020");
});

/** convert string to array */

const zero = [1, 2, 3, 4, 5, 6, 7, 8, 9];
test('Convert sudoku string to 3d array', () => {
    expect(convertToArray('048000065 000037204 210405000 600170500 950006140 102040730 301084007 070291080 096000401'))
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
        convertToString([
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

/** verify if sudoku puzzles are solved */

test('Verify a solved sudoku is solved', () => {
    expect(isSolved(
        '435269781 682571493 197834562 826195347 374682915 951743628 519326874 248957136 763418259'
    )).toBe(true); // This is a solved sudoku puzzle
});

test('Detect that a \'solution\' is incorrect (column 2/8 has two number 3s)', () => {
    expect(isSolved('435269781 682571493 193834562 826195347 374682915 951743628 519326874 248957136 763418259')).toBe(false);
});

test('Detect that a \'solution\' is incorrect (row 8/8 has two number 7s)', () => {
    expect(isSolved(
        '435269781 682571493 197834562 826195347 374682915 951743627 519326874 248957136 763418259'
    )).toBe(false);
});

test('Detect that a \'solution\' is incorrect (grid 2/8 has two number 4s)', () => {
    expect(isSolved(
        '435269741 682571493 197834562 826195347 374682915 951743627 519326874 248957136 763418259'
    )).toBe(false);
});