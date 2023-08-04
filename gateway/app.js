import express from 'express'
import cors from 'cors'
import qaApp from './components/api/routes.js'
import gateway from './components/gateway.js'
import pathFrontend from './lib/pathConfig.js'
import errorHandler from './lib/error/handler.js'
import notFound from './lib/notFound.js'


const app = express()

app.use(cors({origin: '*'}))
app.use(express.static(pathFrontend))

app.use(qaApp)

gateway(app)

app.use(notFound)
app.use(errorHandler)

export default app