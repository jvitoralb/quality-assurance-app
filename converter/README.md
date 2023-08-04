## [Metric-Imperial Converter](https://quality-assurance-app.onrender.com/metric-converter)
A simple metric-imperial converter with only 3 basic units of measurement:
- Length: we can convert Kilometers to Miles and vice-versa.
- Mass: we can convert Kilograms to Pounds and vice-versa.
- Volume: we can convert Liters to Gallons and vice-versa.

To convert any value, you must send the value and unit as value to an `input` key encoded in the URL.  
This means that to convert 10 kilograms to pounds `?input=10kg` should be added to the URL.  
All endpoints use `/api/v1`, so, in this case, the URL is `/metric-converter/api/v1/convert?input=4kg`.  
The answer to that call will be an object with 5 key-value pairs:
```
{
    "initNum":10,
    "initUnit":"kg",
    "returnNum":22.04624,
    "returnUnit":"lbs",
    "string":"10 kilograms converts to 22.04624 pounds"
}
```
The init keys are the value and unit sent for conversion, and the return keys are the value and unit converted, and there's a `string` key that is a message saying it.

**NOTE:**
- The API does not accept the name of the unit. This means you can't send `input=10kilometers`, you have to use `km`.
- To be aware of the accepted abbreviations (not case sensitive):  
  - `Kilometers - km`
  - `Kilograms- kg`
  - `Liters - l`
  - `Miles- mi`
  - `Pounds - lbs`
  - `Gallons - gal`
- If only the unit is sent - `input=kg` - it infers that the value is 1. So it will be converted from 1kg to pounds.
- If no unit is sent the answer will be an error message.
- If no unit and no value are sent, the answer will be an error message.
