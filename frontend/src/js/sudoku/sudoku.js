import createHTMLElem from '../utils/domElements.js';
import handleAPICalls from './sudokuHandlers.js';
import puzzles from './sudokuPuzzles.js';

export const resultContainer = document.querySelector('#validate-solve-result');

const loadBoard = () => {
    const sudokuBoard = document.querySelector('#sudoku-board');
    const tableBody = createHTMLElem['tbody']();

    const setCoordinate = (index) => {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        return letters[Math.floor(index / 9)] + ((index % 9) + 1);
    }

    const getStyle = (coord) => {
        const coordVals = new Set(['C', 'F', 'I', '3', '6', '9']);
        let defaultStyle = 'border:1px solid lightgrey;height:40px;width:40px;';
        const borderPosition = {
            1: 'left',
            A: 'top',
            [coordVals.has(coord[1]) && coord[1]]: 'right',
            [coordVals.has(coord[0]) && coord[0]]: 'bottom',
        }
        if (borderPosition[coord[1]]) {
            defaultStyle += `border-${borderPosition[coord[1]]}-color:black;`;
        }
        if (borderPosition[coord[0]]) {
            defaultStyle += `border-${borderPosition[coord[0]]}-color:black;`;
        }
        return defaultStyle;
    }

    let tableRow = createHTMLElem['trow']();

    for(let i = 0; i < 81; i++) {
        let coord = setCoordinate(i);
        let tableCell = createHTMLElem['tcell'](getStyle(coord));

        let inputSquare = createHTMLElem['input']('', 'text', coord);
        inputSquare.setAttribute('maxlength', '1');
        inputSquare.setAttribute('style', 'width:40px;height:40px;border:0;outline:none;text-align:center;');

        tableCell.appendChild(inputSquare);

        if (coord[0] > setCoordinate(i - 1)[0]) {
            tableBody.appendChild(tableRow);
            tableRow = createHTMLElem['trow']();
        }

        tableRow.appendChild(tableCell);

        if (coord === 'I9') {
            tableBody.appendChild(tableRow);
        }
    }

    sudokuBoard.appendChild(tableBody);
}

const getIndex = (coordinate) => {
    const lettersNumbers = {
        'A': 0, 'B': 9, 'C': 18,
        'D': 27,'E': 36,'F': 45,
        'G': 54, 'H': 63, 'I': 72,
    }
    return (lettersNumbers[coordinate[0]]) + (coordinate[1] - 1);
}

const loadPuzzle = () => {
    const selectedPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    const allDataCells = document.querySelectorAll('td');

    for(let i = 0; i < allDataCells.length; i++) {
        let coord = allDataCells[i].firstChild.getAttribute('id');
        let coordIndex = getIndex(coord);
        if (selectedPuzzle[coordIndex] !== '.') {
            allDataCells[i].firstChild.value = selectedPuzzle[coordIndex];
        }
    }
}

const getPuzzleState = () => {
    const allDataCells = document.querySelectorAll('td');
    let puzzle = '';

    for(let i = 0; i < allDataCells.length; i++) {
        if (allDataCells[i].firstChild.value === '') {
            puzzle += '.';
        } else {
            puzzle += allDataCells[i].firstChild.value;
        }
    }

    return { puzzle };
}

const getFormState = (targetForm) => {
    const coordValue = {}

    for(const pair of new FormData(targetForm).entries()) {
        coordValue[pair[0]] = pair[1];
    }

    return coordValue;
}

export const resultCleaner = () => {
    const gameSection = document.querySelector('#game-section');
    const removeInfo = () => {
        while(resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }
        gameSection.removeEventListener('click', removeInfo);
    }
    gameSection.addEventListener('click', removeInfo);
}

export const completePuzzle = (result) => {
    const allDataCells = document.querySelectorAll('td');

    for(let i = 0; i < allDataCells.length; i++) {
        let coord = allDataCells[i].firstChild.getAttribute('id');
        let coordIndex = getIndex(coord);

        if (allDataCells[i].firstChild.value === '') {
            allDataCells[i].firstChild.value = result.solution[coordIndex];
        }
    }
}

const initEvents = () => {
    const solveButton = document.querySelector('#solve-puzzle-btn');
    const checkValueForm = document.querySelector('#check-value');
    const solvePuzzle = (e) => {
        const puzzle = getPuzzleState();
        const targetId = e.target.getAttribute('id');
        handleAPICalls(puzzle, targetId);
    }
    const checkOnPuzzle = (e) => {
        e.preventDefault();
        const puzzle = getPuzzleState();
        const coordValue = getFormState(e.target);
        const targetId = e.target.getAttribute('id');
        const allData = Object.assign({}, puzzle, coordValue);
        handleAPICalls(allData, targetId);
    }

    solveButton.addEventListener('click', solvePuzzle);
    checkValueForm.addEventListener('submit', checkOnPuzzle);
}

const start = () => {
    initEvents();
    loadBoard();
    loadPuzzle();
}

window.addEventListener('load', start);