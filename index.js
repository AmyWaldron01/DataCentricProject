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

app.listen(3004, () => {
    console.log("Server is listening")
})