import { resultContainer, resultCleaner, completePuzzle } from './sudoku.js';
import createHTMLElem from '../utils/domElements.js';


const handleError = (errorResult, source) => {
    const checkError = (message) => {
        let text = createHTMLElem['paragraph'](message.error, 'm-1 text-center');
        resultContainer.appendChild(text);
    }
    const solveError = (message) => {
        let text = createHTMLElem['paragraph'](message.error, 'm-1 text-center');
        resultContainer.appendChild(text);
    }
    const actionsCallbacks = {
        'check-value': checkError,
        'solve-puzzle-btn': solveError
    }
    actionsCallbacks[source](errorResult);
    resultCleaner();
}

const handleAnswer = (answerResult, source) => {
    const solveAnswer = (result) => {
        let text = createHTMLElem['paragraph'](result.message, 'm-1 text-center');
        resultContainer.appendChild(text);
        completePuzzle(result);
    }
    const checkAnswer = (result) => {
        let text = result.valid === false ? 'Conflicts:' : 'No conflicts!';
        let textNode = createHTMLElem['paragraph'](text);
        resultContainer.appendChild(textNode);

        if (result.conflict) {
            let list = createHTMLElem['unorderedList']();
            for(let i = 0; i < result.conflict.length; i++) {
                list.appendChild(createHTMLElem['listItems'](result.conflict[i]));
            }
            resultContainer.appendChild(list);
        }
    }

    const actionsCallbacks = {
        'check-value': checkAnswer,
        'solve-puzzle-btn': solveAnswer
    }
    actionsCallbacks[source](answerResult);
    resultCleaner();
}

const handleAPICalls = (data, source) => {
    const checkValue = async (reqData) => {
        try {
            const request = await fetch('/sudoku-solver/api/v1/check', {
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqData)
            });
            const answer = await request.json();

            if (request.status === 400) {
                throw answer;
            }

            handleAnswer(answer, source);
        } catch (err) {
            handleError(err, source)
        }
    }
    const solvePuzzle = async (reqData) => {
        try {
            const request = await fetch('/sudoku-solver/api/v1/solve', {
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqData)
            });
            const answer = await request.json();

            if (request.status === 400) {
                throw answer;
            }

            handleAnswer(answer, source);
        } catch (err) {
            handleError(err, source)
        }
    }

    const actionsCallbacks = {
        'check-value': checkValue,
        'solve-puzzle-btn': solvePuzzle
    }
    actionsCallbacks[source](data);
}

export default handleAPICalls;