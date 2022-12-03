const form = document.querySelector('#convertForm')
const displayJson = document.querySelector('#jsonResult')
const displayResult = document.querySelector('#result')


const handleError = (err) => {
    displayJson.textContent = JSON.stringify(err)
    displayResult.textContent = err.error
}

const displayValues = (data) => {
    displayResult.textContent = data.string
    displayJson.textContent = JSON.stringify(data)
}

const getData = async () => {
    const { value, name } = document.querySelector('#convertField')
    let params = new URLSearchParams({
        [name]: value
    })

    try {
        const data = await fetch('/metric-converter/api/convert?' + params)
        const result = await data.json()
        if (result.error) {
            throw result
        }
        displayValues(result)
    } catch(err) {
        handleError(err)
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    getData()
})