/**
 * Created by ARYA on 8/23/2017.
 */
var crawlJson = require('./crawl.json');
var professor = require('../app/models/professor');
var mongoose = require('mongoose');

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
    CPModel.remove({}, function (err) {} );
};

module.exports.getCPS = function() {
    for(var i = 0 ; i < crawlJson.CP.length; i++){
        new CPModel({ProfessorName: crawlJson.CP[i].ProfessorName, ProfessorEmail: crawlJson.CP[i].ProfessorEmail, CourseName: crawlJson.CP[i].CourseName}).save();
    }
    this.loadProfessorCourses();
    //console.log(crawlJson[0]);
};

module.exports.getAllCPs = function () {
  CPModel.find({}, function (error, data) {
      var allCps = data;
      var allProfs = [];
          var checked = false;
          for(var i = 0 ; i < allCps.length ; i ++){
              checked = false;
              for(var j = 0 ; j < allProfs.length; j++){
                    if(allCps[i].ProfessorEmail == allProfs[j].ProfessorEmail){
                        var course = new Object();
                        course.courseNo = allCps[i].CourseName.split(" ")[0];
                        course.courseName = allCps[i].CourseName;
                        course.tas = [];
                        allProfs[j].Courses.push(course);
                        checked = true;
                    }
              }
              if(!checked){
                  var course = new Object();
                  var Courses = [];
                  course.courseNo = allCps[i].CourseName.split(" ")[0];
                  course.courseName = allCps[i].CourseName;
                  course.tas = [];
                  Courses.push(course);
                  var prof = new Object();
                  prof.ProfessorEmail = allCps[i].ProfessorEmail;
                  prof.Courses = [];
                  prof.Courses = Courses;
                  prof.ProfessorName = allCps[i].ProfessorName;
                  allProfs.push(prof);
              }
          }
          for(var i = 0 ; i < allProfs.length; i++){
                new professor.getProfessorModel() ({ProfessorName: allProfs[i].ProfessorName,
                    ProfessorEmail: allProfs[i].ProfessorEmail, Courses: allProfs[i].Courses
                }).save();
          }
      });
};

module.exports.deleteAll = function(){
    CPModel.remove({}, function (err) {} );
};
