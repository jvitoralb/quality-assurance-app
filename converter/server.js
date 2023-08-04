import * as dotenv from 'dotenv';
import http from 'node:http';
import app from './app.js';
import emitter from './test-runner.js';

dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(() => {
            try {
                emitter.run();
            } catch(err) {
                console.log('Tests are not valid:');
                console.log(err);
            }
        }, 1500);
    }
});
