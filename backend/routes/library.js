import { Router } from 'express';
import fcctesting from './fcctesting.cjs';


const personalLibrary = Router();

personalLibrary.get('/', (req, res) => {
    res.send('Personal Library Home!')
})

fcctesting(personalLibrary);

export default personalLibrary;