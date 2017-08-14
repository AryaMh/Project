var express = require('express');
var dbhandler = require('./db/dbhandler.js');
var app = express();
var bodyParser = require('body-parser');

app.get('/', function (req, res) {
    res.send("Testing");
});

dbhandler.initial();

var StudentModel = dbhandler.getStudentModel();
dbhandler.add("Pardis","Pardisan", "91123456",['kir', 'kir']);
dbhandler.add("Farbod","Farbodan", "92344923", ['kir', 'kir']);


app.use(express.static(process.cwd()+"/public"));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());

app.get('/students', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1333');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    StudentModel.find({}, function(error, data) {
        if (data)
            res.json(data);
    });
});

app.post('/students/add', function(req, res) {
    dbhandler.add(req.body.firstName, req.body.lastName, req.body.studentID);
});


app.listen(3000);
console.log("Listening on port *: 3000");