import pathFrontend from '../../configs/pathConfig.js'


export const homepage = (req, res) => {
    res.status(200).sendFile(`${pathFrontend}/public/index.html`)
}
