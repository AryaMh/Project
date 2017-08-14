var MONGODB_PORT = 27017;
var mongoose = require('mongoose');

var MongoServerIP = "127.0.0.1";
var DBName = "University";


var StudentStructure = {
  firstName: String,
  lastName: String,
  studentID: Number,
  courses: []
};



module.exports.initial = function (){
    mongoose.connect("mongodb://"+MongoServerIP+"/"+DBName,{
        useMongoClient: true
        /* other options */
    });
};

var Schema = new mongoose.Schema(StudentStructure);
var StudentModel = mongoose.model("Student", Schema);


module.exports.getStudentModel = function(){
	return StudentModel;
};

module.exports.deleteModel = function(id){
	StudentModel.remove({studentID: id}, function (error) {} );
};

module.exports.deleteAll = function(){
	StudentModel.remove({}, function (err) {} );
};

module.exports.add = function(firstName1, lastName1, studentID1, courses1){
		new StudentModel({ firstName: firstName1, lastName: lastName1, studentID: studentID1, courses: courses1}).save();
};




