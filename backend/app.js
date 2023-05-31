import express from 'express'
import cors from 'cors'
import pathFrontend from './configs/pathConfig.js'
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/error.js'
import issueTracker from './components/tracker/trackerAPI.js'
import imperialConverter from './components/converter/converterAPI.js'
import personalLibrary from './components/library/libraryAPI.js'
import sudokuSolver from './components/sudoku/sudokuAPI.js'
import translator from './components/translator/translatorAPI.js'


const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))
app.use(express.urlencoded({extended: true}))
app.use(express.static(pathFrontend))

app.get('/', (req, res) => {
    res.status(200).sendFile(`${pathFrontend}/public/index.html`)
})

app.use('/metric-converter', imperialConverter)
app.use('/issue-tracker', issueTracker)
app.use('/personal-library', personalLibrary)
app.use('/sudoku-solver', sudokuSolver)
app.use('/english-translator', translator)

app.use(notFound)
app.use(errorHandler)

export default app