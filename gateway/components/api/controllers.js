import pathFrontend from '../../lib/pathConfig.js'


const homepage = (req, res) => {
    res.status(200).sendFile(`${pathFrontend}/public/index.html`)
}

export default homepage