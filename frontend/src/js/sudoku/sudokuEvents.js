import handleAPICalls from './sudokuHandlers.js';
import { getPuzzleState, clearBoard, loadPuzzle, resultContainer } from './sudoku.js';


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

const getFormState = (targetForm) => {
    const coordValue = {}
    for(const pair of new FormData(targetForm).entries()) {
        coordValue[pair[0]] = pair[1];
    }
    return coordValue;
}

const initEvents = () => {
    const solveButton = document.querySelector('#solve-puzzle-btn');
    const newGameButton = document.querySelector('#new-game-btn');
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
    const newGame = () => {
        clearBoard();
        loadPuzzle();
    }

    newGameButton.addEventListener('click', newGame);
    solveButton.addEventListener('click', solvePuzzle);
    checkValueForm.addEventListener('submit', checkOnPuzzle);
}

export default initEvents;