import express from 'express'
import cors from 'cors'
import pathFrontend from './utils/config.js'
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/error.js'
import issueTracker from './routes/tracker.js'
import imperialConverter from './routes/converter.js'
import personalLibrary from './routes/library.js'
import sudokuSolver from './routes/sudoku.js'


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

app.use(notFound)
app.use(errorHandler)

export default app