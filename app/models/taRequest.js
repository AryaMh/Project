/**
 * Created by ARYA on 8/25/2017.
 */
var mongoose = require('mongoose');
var professor = require('./professor');

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
    professor.getProfessorModel().findOne({ProfessorEmail: requestObject.ProfessorEmail}, function (error, doc) {
        for(var i = 0 ; i < doc.Courses.length; i++){
            if(doc.Courses[i].courseNo == requestObject.CourseNo){
                if(doc.Courses[i].tas.indexOf(requestObject.StudentEmail) == -1){
                    TARequestModel.findOne({ProfessorEmail: requestObject.ProfessorEmail},function (error, data) {
                        if(data){
                            var courseFound = false;
                            for(var i = 0 ; i < data.Courses.length; i++){
                                if(data.Courses[i].courseNo == requestObject.CourseNo)
                                {
                                    if(data.Courses[i].tas.indexOf(requestObject.StudentEmail) == -1) {
                                        var taobj = new Object();
                                        taobj.StudentEmail = requestObject.StudentEmail;
                                        taobj.StudentResume = requestObject.StudentResume;
                                        data.Courses[i].tas.push(taobj);
                                        courseFound = true;
                                    }
                                    else {
                                        return;
                                    }
                                }
                            }
                            if(!courseFound){
                                var obj = new Object();
                                obj.courseNo = requestObject.CourseNo;
                                obj.tas = [];
                                var taobj = new Object();
                                taobj.StudentEmail = requestObject.StudentEmail;
                                taobj.StudentResume = requestObject.StudentResume;
                                obj.tas.push(taobj);
                                data.Courses.push(obj);
                            }
                            TARequestModel.findOneAndUpdate({ProfessorEmail: requestObject.ProfessorEmail}, {$set:{Courses: data.Courses}},function (error, doc) {});
                        }
                        else {
                            var Courses = [];
                            var obj = new Object();
                            obj.courseNo = requestObject.CourseNo;
                            obj.tas = [];
                            var taobj = new Object();
                            taobj.StudentEmail = requestObject.StudentEmail;
                            taobj.StudentResume = requestObject.StudentResume;
                            obj.tas.push(taobj);
                            Courses.push(obj);
                            new TARequestModel({ProfessorEmail: requestObject.ProfessorEmail
                                ,Courses: Courses}).save();
                        }
                    });
                }
                else {
                    return;
                }
            }
        }
    });
};