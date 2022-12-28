var mysql = require('promise-mysql');

var pool;

//Creating mysql pool and connecting to database
mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2022'
}).then((data) => {
    pool = data
})
    .catch((error) => {
        console.log(error)
    })

//List out all my employyes
var employees = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from employee')
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Exporting all functions
module.exports = { employees };