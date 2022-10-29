import express from 'express'
import cors from 'cors'
import fcctesting from './routes/fcctesting.cjs'
import notFound from './middleware/notFound.js'
import imperialConverter from './routes/api.js'


const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.status(200).json({
        page: 'home'
    })
})

app.use('/metric-converter', imperialConverter)


fcctesting(app)

app.use(notFound)

export default app