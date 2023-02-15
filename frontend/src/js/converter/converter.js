const form = document.querySelector('#convert-form')
const displayJson = document.querySelector('#json-result')
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
    const valueInput = document.querySelector('#value-field')
    const unitInput = document.querySelector('#unit-field')

    const getUnit = (unit) => {
        const twoDigitUnit = {
            kilograms: "kg",
            pounds: "lbs",
            liters: "l",
            gallons: "gal",
            kilometers: "km",
            miles: "mi"
        }
        let lowerUnit = unit.toLowerCase()

        if (twoDigitUnit[lowerUnit]) {
            return twoDigitUnit[lowerUnit]
        }
        return unit
    }

    let params = new URLSearchParams({
        input: valueInput.value + getUnit(unitInput.value)
    })

    try {
        const data = await fetch('/metric-converter/api/v1/convert?' + params)
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