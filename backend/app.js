import express from 'express'
import cors from 'cors'
import pathFrontend from './configs/pathConfig.js'
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/error.js'
import issueTracker from './components/tracker/api/routes.js'
import imperialConverter from './components/converter/api/routes.js'
import personalLibrary from './components/library/api/routes.js'
import sudokuSolver from './components/sudoku/api/routes.js'
import translator from './components/translator/api/routes.js'


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