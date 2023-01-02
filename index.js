//importing my SQL function
var SqlFunction = require('./SqlFunction');
//importing mongoDB function
var MongoFunctions = require('./MongoFunctions');

//express 
var express = require('express')
var app = express();

//Body Parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

//Ejs
app.set('view engine', 'ejs');

/////////////////////////////////////////////////////////////
//http://localhost:3004/ HOME PAGE
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

/////////////////////////////////////////////////////////////
//Departments
//http://localhost:3004/department - Gets all departments and lists in listDepartments.ejs
app.get('/departments', (req, res) => {
    SqlFunction.departments()
        .then((result) => {
            res.render('departments', { departmentList: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//Deleating departments using ID
app.get('/department/delete/:did', (req, res) => {
    //Deletes department
    //First u must insert a dept into thsql command promt
    SqlFunction.deleteDepartment(req.params.did)
        .then((result) => {
            //If no rows are affected then dept does not exist
            if (result.affectedRows == 0) {
                res.send("<h1> ERROR </h1>" + "<br> </br>" + "<h2> Department: " + req.params.did + " can't be deleted.</h2>" + "<a href='/'>Home</a>")
            } else {
                res.send("<h2> Department: " + req.params.did + " Deleted!</h2>" + "<a href='/'>Home</a>")
            }
        })
        .catch((error) => {
            //If error code is ER_ROW_IS_REFERENCED_2 then dept has employees in it
            if (error.code == "ER_ROW_IS_REFERENCED_2") {
                res.send("<h1> ERROR </h1>" + "<br> </br>" + "<h2>Department ID: " + req.params.did + " cannot be deleted as there a employee is in this department!!!!!</h2>" + "<a href='/'>Home</a>")
            }
            console.log(error)
        })
})

/////////////////////////////////////////////////////////////
//Empoyees MongoDB

//http://localhost:3004/employeesMongoDB - Gets all employees and lists in employeesMongoDB.ejs
app.get('/employeesMongoDB', (req, res) => {
    MongoFunctions.ListEmployeesMongoDB()
        .then((data) => {
            res.render('employeesMongoDB', { employeesList: data })
        })
        .catch(() => {
            res.send('error')
        })
})

//ADDING EMPLOYEES TO MONGODB
app.get('/employeesMongoDB/add', (req, res) => {
    res.render("addEmployee")
})


//Adding employees to mongoDB-using post request to get data from addEmployee.ejs
app.post('/employeesMongoDB/add', (req, res) => {
    //Checks if employee exists in mySql Database
    SqlFunction.checkingEID(req.body._id).then((result) => {
        //If employee exists in mySQL
        //when result is null means there is no id that matches
        if (result[0] != null) {
            //Adds employee to mongoDB
            MongoFunctions.addEmployees(req.body._id, req.body.phone, req.body.email)
            .then((result) => {
                res.redirect("/employeesMongoDB")
            })
            .catch((error) => {
                if (error.message.includes("11000")) {
                    res.send("<h1>ERROR </h1> <br> <h1>_ID: " + req.body._id + " already exists in the data base</h1>" + "<a href='/'>Home</a>")
                } else {
                    res.send(error.message)
                }
            })
        //ERROR ID DOES NOT EXIST
        }else{
            res.send("<h1>ERROR </h1> <br> <h1>Employee: " + req.body._id + " does not exist in mySQL</h1>" + "<a href='/'>Home</a>")
        }
    })
    .catch((error) => {
        console.log(error)
    })
})


/////////////////////////////////////////////////////////////

//listening to port 3004
app.listen(3004, () => {
    console.log("Server is listening")
})