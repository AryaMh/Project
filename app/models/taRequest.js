/**
 * Created by ARYA on 8/25/2017.
 */
var mongoose = require('mongoose');

var TARequestStructure = {
    ProfessorEmail: String,
    Courses: []
};

var Schema = new mongoose.Schema(TARequestStructure);
var TARequestModel = mongoose.model('tarequests', Schema);

module.exports.getTARequestModel = function () {
    return TARequestModel;
};

module.exports.add = function (requestObject) {
    TARequestModel.findOne({ProfessorEmail: requestObject.ProfessorEmail},function (error, data) {
       if(data){
           var courseFound = false;
            for(var i = 0 ; i < data.Courses.length; i++){
                if(data.Courses[i].courseNo == requestObject.CourseNo)
                {
                    console.log(data.Courses[i].tas);
                    data.Courses[i].tas.push(requestObject.StudentEmail);
                    courseFound = true;
                }
            }
           if(!courseFound){
               var obj = new Object();
               obj.courseNo = requestObject.CourseNo;
               obj.tas = [];
               obj.tas.push(requestObject.StudentEmail);
               data.Courses.push(obj);
           }
           TARequestModel.findOneAndUpdate({ProfessorEmail: requestObject.ProfessorEmail}, {$set:{Courses: data.Courses}},function (error, doc) {});
       }
       else {
           var Courses = [];
           var obj = new Object();
           obj.courseNo = requestObject.CourseNo;
           obj.tas = [];
           obj.tas.push(requestObject.StudentEmail);
           Courses.push(obj);
           new TARequestModel({ProfessorEmail: requestObject.ProfessorEmail
               ,Courses: Courses}).save();
       }
    });
};