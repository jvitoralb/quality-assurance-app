import express from 'express'
import cors from 'cors'
import pathFrontend from './configs/pathConfig.js'
import notFound from './components/middleware/notFound.js'
import errorHandler from './components/middleware/error.js'
import gateway from './components/api/index.js'


const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))
app.use(express.urlencoded({extended: true}))
app.use(express.static(pathFrontend))

gateway(app)

app.use(notFound)
app.use(errorHandler)

export default app