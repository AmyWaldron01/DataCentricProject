//importing my Employess function
var SqlFunction = require('./SqlFunction');
//express 
var express = require('express')
var app = express();
//Body Parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
//Ejs
app.set('view engine', 'ejs');

//http://localhost:3004/ - This goes to home page
app.get('/', (req, res) => {
    //Sends to home page
    res.sendFile(__dirname + '/views/homepage.html')
})

//getting employees
app.get('/employees', (req, res) => {
    SqlFunction.employees()
        .then((result) => {
            res.render('employess', { employeeList: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//Editing Employees
//getting all the data of employees
app.get('/employees/edit/:eid', (req, res) => {
    //Populates form with employee details
    SqlFunction.updatingEmployees(req.params.eid)
        .then((result) => {
            //results=JSON.parse(JSON.stringify(result)) 
            //console.log(result)
            res.render('updatingEmployees', { updatingEmployees: result })
        })
        .catch((error) => {
            console.log(error)

        })
})

//Updates employee mySQL with edited data
app.post('/employees/edit/:eid', (req, res) => {
    SqlFunction.updateEmployeeData(req.body.eid, req.body.ename, req.body.role, req.body.salary)
        .then((result) => {
            res.redirect("/employees")
        })
        .catch((error) => {
            console.log(error)
        })
})

app.listen(3004, () => {
    console.log("Server is listening")
})