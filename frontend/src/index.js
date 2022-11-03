const form = document.querySelector('#convertForm')
const displayJson = document.querySelector('#jsonResult')
const displayResult = document.querySelector('#result')

// Set up for a submit without value
const handleError = (err) => {
    let errorStr = err.split('"')[1]

    if (err.includes('...')) {
        errorStr = 'invalid number and unit'
    }

    displayJson.textContent = errorStr
    displayResult.textContent = errorStr
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
        displayValues(result)
    } catch(err) {
        // console.error(err.message);
        handleError(err.message)
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    displayValues('')
    getData()
})