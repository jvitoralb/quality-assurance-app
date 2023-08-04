import express from 'express'
import homepage from './controllers.js'


const qaApp = express();

qaApp.get('/', homepage);

export default qaApp;