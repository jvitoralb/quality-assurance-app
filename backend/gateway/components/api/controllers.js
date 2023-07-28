import pathFrontend from '../../configs/pathConfig.js'


export const homepage = (req, res) => {
    res.status(200).sendFile(`${pathFrontend}/public/index.html`)
}

export const converterHome = (req, res, next) => {
    res.status(200).sendFile(`${pathFrontend}/public/converter.html`)
}

export const libraryHome = (req, res, next) => {
    res.status(200).sendFile(`${pathFrontend}/public/library.html`)
}

export const sudokuHome = (req, res, next) => {
    res.status(200).sendFile(`${pathFrontend}/public/sudoku.html`);
}

export const trackerHome = (req, res, next) => {
    res.status(200).sendFile(`${pathFrontend}/public/tracker.html`)
}

export const translatorHome = (req, res, next) => {
    res.status(200).sendFile(`${pathFrontend}/public/translator.html`);
}
