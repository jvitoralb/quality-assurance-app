import * as dotenv from 'dotenv'
import http from 'node:http'
import app from './app.js'

dotenv.config()

const server = http.createServer(app)
const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`)
})
