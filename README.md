# Quality Assurance App

This is an end-to-end app with five different projects built mainly with JavaScript. The main goal for the app was to practice Test Driven Development. This project is part of the freeCodeCamp curriculum.

- [Metric Converter](#metric-imperial-converter)
- [Issue Tracker](#issue-tracker)
- [Personal Library](#personal-library)
- [Sudoku Solver](#sudoku-solver)
- [English Translator](#english-translator)

### [Backend](https://github.com/jvitoralb/quality-assurance-app/tree/main/backend)  
The backend was built with Nodejs and Expressjs following the MVC software design pattern, and all APIs follow the REST architectural style.  
The choice for the database was MongoDB and the mongoose library to manage and store the data.  

### [Tests](https://github.com/jvitoralb/quality-assurance-app/tree/main/backend/tests)  
As said before, the main goal of this project was to practice TDD. So I used Chai.js and ChaiHttp libraries to handle all the tests - unit and functional.

### [Frontend](https://github.com/jvitoralb/quality-assurance-app/tree/main/frontend)  
The frontend was built using only HTML, Bootstrap, and JavaScript.


## [Metric-Imperial Converter](./backend/README.md/#metric-imperial-converter)
A simple metric-imperial converter with only 3 basic units of measurement:  
- Length: we can convert Kilometers to Miles and vice-versa.
- Mass: we can convert Kilograms to Pounds and vice-versa.
- Volume: we can convert Liters to Gallons and vice-versa.

## [Issue Tracker](./backend/README.md/#issue-tracker)
The idea behind this project was to create a tool to track issues on a project.


## [Personal Library](./backend/README.md/#personal-library)
A simple library project in which we can store books and keep track of comments in all books.

## [Sudoku Solver](./backend/README.md/#sudoku-solver)
This is a simple project, and as the name implies is a sudoku solver but can also be used to check if a number is valid to be used in a given coordinate - we use coordinates to track all squares in a puzzle.

The game is divided into rows, columns, and areas.
Starting from the fact that the game is a larger area of `9X9` - that gives us `81 squares` to work with:
- Each `row` is composed of 9 squares, as well as each `column` and each `area` - in `3x3` format.
- Each `row` receives a letter from `A to I` as a coordinate being the first line - top - the letter `A` and the last line - base - the letter `I`.
- Each `column` receives as a coordinate a number from `1 to 9`, the first column - left, column `1`, and the last column - right - column `9`.

![Image explaining the sudoku grid coordinates](./frontend/public/images/sudoku-solver-usage.png)

## [English Translator](./backend/README.md/#english-translator)
As the name implies this project work as a translator between british english and north american english.


## Conclusion
Overall this isn't a big project but I can say I did my best here to write some good code and, of course, I had to work with some coditions, given the fact this is part of freeCodeCamp curriculum and had to pass all the tests they asked.  
While working on this project I had study a lot, not only in terms of TDD which was the main goal here but I also concepts of backend architecture and OOP.

Was a really good experience.