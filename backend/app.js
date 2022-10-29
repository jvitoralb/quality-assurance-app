import express from 'express'
import cors from 'cors'
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

app.use(notFound)

export default app