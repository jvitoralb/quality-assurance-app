import express from 'express'
import cors from 'cors'
import pathFrontEnd from './config.js'
import notFound from './middleware/notFound.js'
import imperialConverter from './routes/api.js'


const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))
app.use(express.urlencoded({extended: true}))
app.use(express.static(pathFrontEnd))

app.get('/', (req, res) => {
    res.status(200).sendFile(`${pathFrontEnd}/public/index.html`)
})

app.use('/metric-converter', imperialConverter)

app.use(notFound)

export default app