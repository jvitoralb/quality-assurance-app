import CustomError from '../../lib/error/custom.js'


export class Cell {
    constructor(val, coord, game) {
        this.value = String(val);
        this.solved = false;
        this.coordinate = coord.toUpperCase();
        this.currentGame = game;
        this.possibilities = [];
        this.currentValue = 0;
    }

    getStatus = () => {
        const validValues = new Set(['1', '2', '3', '4', '5', '6', '7','8', '9']);

        if (validValues.has(this.value) == false) {
            throw { message: 'Invalid value' }
        }

        const [ row, col ] = this.coordinate.split('');

        let letterChar = (() => {
            let min = 'A'.charCodeAt();
            let max = 'I'.charCodeAt();
            if(row.charCodeAt() < min || row.charCodeAt() > max) {
                return false;
            }
            return true;
        })();

        if (this.coordinate.length > 2 || validValues.has(col) === false || letterChar === false) {
            throw { message: 'Invalid coordinate' }
        }
        return { valid: true }
    }

    getRows = (letter) => {
        const rows = {
            'A': 0, 'B': 9, 'C': 18,
            'D': 27,'E': 36,'F': 45,
            'G': 54, 'H': 63, 'I': 72,
        }
        if (letter) {
            return rows[letter];
        }
        return rows[this.coordinate[0]];
    }

    getColumns = (num) => {
        if (num) {
            return (Number(num) - 1);
        }
        return (Number(this.coordinate[1]) - 1);
    }

    onBoard = (place) => {
        const placements = {
            'row': (i) => (this.getRows() + i),
            'column': (i) => (this.getColumns() + (9 * i)),
            'region': (i) => {
                let letter = this.coordinate[0] > 'F' ? 'G' : this.coordinate[0] > 'C' ? 'D' : 'A';
                let num = this.coordinate[1] > '6' ? '7' : this.coordinate[1] > '3' ? '4' : '1';
                let leap = i > 5 ? 12 : i > 2 ? 6 : 0;
                return (this.getRows(letter) + this.getColumns(num) + i + leap);
            }
        }
        const valuesOnBoard = new Set([]);

        for(let i = 0; i < 9; i++) {
            let index = placements[place](i);
            if (this.getColumns() + this.getRows() === index && this.currentGame[index] === this.value) {
                // If we're checking for a coordinate that already have a value in the default puzzle
                // and its value is the value asked for checking it should return { valid: true }
                continue;
            }
            valuesOnBoard.add(this.currentGame[index]);
        }

        if (valuesOnBoard.has(this.value)) {
            return place;
        }
        return '';
    }

    check = () => {
        const conflictCases = ['row', 'column', 'region'].filter(str => this.onBoard(str))

        if (conflictCases.length) {
            return {
                valid: false,
                conflict: conflictCases
            }
        }
        return { valid: true }
    }

    resetValues = () => {
        this.currentValue = 0;
        this.value = '.';
    }

    updateGame = () => {
        let idx = this.getRows() + this.getColumns();
        let tempArr = this.currentGame.split('');
        tempArr[idx] = this.value;
        this.currentGame = tempArr.join('');
        return this.currentGame;
    }

    isCellSolved = () => {
        if (this.possibilities.length === 1) {
            this.setValue();
            this.solved = true;
        }
    }

    notSolvable = () => {
        if (!this.possibilities.length && !this.solved) {
            throw { message: 'Puzzle cannot be solved' }
        }
    }

    updateValue = () => {
        if (!this.check().valid && this.currentValue < this.possibilities.length - 1) {
            this.currentValue++;
            this.setValue();
            return this.updateValue();
        }
    }

    setCoordinate = (index = 0) => {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        this.coordinate = letters[Math.floor(index / 9)] + ((index % 9) + 1);
    }

    setValue = (num) => {
        if (num) {
            this.value = `${num}`;
        } else {
            this.value = this.possibilities[this.currentValue];
        }
    }

    setPossibilities = () => {
        for(let i = 1; i < 10; i++) {
            this.setValue(i);
            if (this.check().valid) {
                this.possibilities.push(this.value);
            }
        }

        this.resetValues();
        this.isCellSolved();
        this.notSolvable()
    }
}

export class SudokuSolver {
    constructor(cell, puzzle) {
        this.cell = cell;
        this.cellsList = [];
        this.cellIndex = 0;
        this.puzzle = puzzle;
    }

    validate = () => {
        if (this.puzzle.length !== 81) {
            throw { message: 'Expected puzzle to be 81 characters long' }
        }
        const validChars = new Set(['1', '2', '3', '4', '5', '6', '7','8', '9', '.'])

        for(let i = 0; i < this.puzzle.length; i++) {
            if (validChars.has(this.puzzle[i]) === false) {
                throw { message: 'Invalid characters in puzzle' }
            }
        }

        return { valid: true }
    }

    updatePuzzle = () => {
        this.puzzle = this.cell.updateGame();
    }

    reset = () => {
        this.cell.resetValues();
        this.updatePuzzle();
    }

    backtrack = () => {
        this.cellIndex--;

        if (this.cellIndex < 0) {
            throw { message: 'Puzzle cannot be solved' }
        }

        if (this.cellsList[this.cellIndex].solved) {
            return this.backtrack();
        }
    }

    updateCell = () => {
        if (this.cell.currentValue === this.cell.possibilities.length - 1) {
            this.reset();
            this.backtrack();
            this.cell = this.cellsList[this.cellIndex];
            return this.updateCell();
        }
        this.cell.currentValue++;
    }

    changeCell = () => {
        if (this.cell.check().valid) {
            this.cellIndex++;
        } else {
            this.updateCell();
        }
    }

    allCellsSolved = () => {
        for(let i = 0; i < this.cellsList.length; i++) {
            if (this.cellsList[i].solved === false) {
                return false;
            }
        }
        return true;
    }

    forward = () => {
        if (this.cellsList[this.cellIndex].solved && this.cellIndex < this.cellsList.length) {
            this.cellIndex++;
            return this.forward();
        }
    }

    setCell = () => {
        this.cell = this.cellsList[this.cellIndex];
        this.cell.currentGame = this.puzzle;
        this.cell.setValue();
        this.cell.updateValue();
    }

    solve = () => {
        this.forward();
        this.setCell();
        this.changeCell();
        this.updatePuzzle();

        if (this.puzzle.includes('.')) {
            return this.solve();
        }
        return { message: 'Puzzle solved' }
    }

    setCellsList = () => {
        for(let i = 0; i < this.puzzle.length; i++) {
            if (this.puzzle[i] !== '.') continue;

            this.cell = new Cell('.', '', this.puzzle);
            this.cell.setCoordinate(i);
            this.cell.setPossibilities();
            this.cellsList.push(this.cell);

            if (this.cell.solved) {
                this.updatePuzzle();
            }
        }
    }

    getSolution = () => {
        try {
            this.validate();
            this.setCellsList();

            if (!this.cellsList.length) {
                throw { message: 'Puzzle cannot be solved' }
            }

            if (this.allCellsSolved() === true) {
                return {
                    message: 'Puzzle solved',
                    solution: this.puzzle
                }
            }

            this.solve();
        } catch(e) {
            throw new CustomError(e.message, 200);
        }

        return {
            message: 'Puzzle solved',
            solution: this.puzzle
        }
    }
}