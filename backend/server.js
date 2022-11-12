import * as dotenv from 'dotenv'
import app from './app.js'
import emitter from './test-runner.js'
import connect from './connection.js'

dotenv.config()


connect()

const runner = emitter;
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`)
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...')
        setTimeout(() => {
            try {
                runner.run()
            } catch(err) {
                console.log('Tests are not valid:')
                console.log(err)
            }
        }, 1500)
    }
})