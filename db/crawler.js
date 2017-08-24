/**
 * Created by ARYA on 8/23/2017.
 */
var crawlJson = require('./crawl.json');

var mongoose = require('mongoose');

var MongoServerIP = "127.0.0.1";
var DBName = "University";

var CourseProfessorStructure = {
    ProfessorName: String,
    ProfessorEmail: String,
    CourseName: String
};

var Schema = new mongoose.Schema(CourseProfessorStructure);
var CPModel = mongoose.model("CourseProfessors", Schema);


module.exports.getCPModel = function () {
  return CPModel;
};

module.exports.initial = function (){
    mongoose.connect("mongodb://"+MongoServerIP+"/"+DBName,{
        useMongoClient: true
        /* other options */
    });
    CPModel.remove({}, function (err) {} );
};

module.exports.getCPS = function() {
    for(var i = 0 ; i < crawlJson.CP.length; i++){
        new CPModel({ProfessorName: crawlJson.CP[i].ProfessorName, ProfessorEmail: crawlJson.CP[i].ProfessorEmail, CourseName: crawlJson.CP[i].CourseName}).save();
    }
    //console.log(crawlJson[0]);
};

module.exports.deleteAll = function(){
    CPModel.remove({}, function (err) {} );
};
