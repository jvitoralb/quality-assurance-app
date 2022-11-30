const chai = require('chai')
const chaiHttp = require('chai-http')


chai.use(chaiHttp)

suite('Library Functional Tests', async () => {
    const app = (await import('../app.js')).default
    let assert = chai.assert

    suite('Routing tests', () => {
        suite('POST', () => {
            test('/api/books with title', (done) => {

            })
            test('/api/books with no title', (done) => {

            })      
            test('/api/books/[id] with comment', (done) => {

            });
            test('/api/books/[id] without comment field', (done) => {

            });
      
            test('/api/books/[id] with comment, id not in db', (done) => {

            });
        })
        suite('GET', () => {
            test('/api/books', (done) => {

            })
            test('/api/books/[id] with _id not in db', (done) => {

            })
            test('/api/books/[id] with valid _id in db', (done) => {

            })
        })
        suite('DELETE', () => {
            test('/api/books/[id] with valid id in db', (done) => {

            });
        
            test('/api/books/[id] with  id not in db', (done) => {

            });
        })
    })
})