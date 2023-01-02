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
/////////////////////////////////////////////////////////////////////////

//UPDATING EMPLOYEES
//Chooses employee to populate form to edit details
var updatingEmployees = function (eid) {
    return new Promise((resolve, reject) => {
        var mySqlQuery = {
            sql: 'select * from employee where eid=?',
            values: [eid]
        }

        pool.query(mySqlQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//updates employee data which user has entered
var updateEmployeeData = function (eid, ename, role, salary) {
    return new Promise((resolve, reject) => {
        var mySqlQuery = {
            sql: 'update employee set ename = ?, role = ?, salary = ? where eid = ?',
            values: [ename, role, salary, eid]
        }

        pool.query(mySqlQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
/////////////////////////////////////////////////////////////////////////

//Departments
var departments = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from dept')
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Deleating departments
//Must add dep first in the command promt for sql
var deleteDepartment = function (did) {
    return new Promise((resolve, reject) => {
        var mySqlQuery = {
            sql: 'delete from dept where did = ?',
            values: [did]
        }

        pool.query(mySqlQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/////////////////////////////////////////////////////////////////////////
//Mongo employees

//Checks if employee exists
var checkingEID = function (eid){
    return new Promise((resolve, reject) => {
        var mySqlQuery = {
            sql: 'select * from employee where eid like ?',
            values: [eid]
        }
        pool.query(mySqlQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}




//Exporting all functions
module.exports = { employees, updatingEmployees, updateEmployeeData,departments,deleteDepartment,checkingEID };