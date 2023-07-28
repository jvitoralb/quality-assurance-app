const notFound = (req, res) => {
    res.status(404).send('Something is missing!')
}

export default notFound