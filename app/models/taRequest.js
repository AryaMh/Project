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

module.exports.add = function (requestObject, res) {

    TARequestModel.findOne({ProfessorEmail: requestObject.ProfessorEmail},function (error, data) {
        if(data){
            var courseFound = false;
            var alreadyrequest = false;
            for(var i = 0 ; i < data.Courses.length; i++){
                if(data.Courses[i].courseNo == requestObject.CourseNo)
                {
                    var x = 0;
                    data.Courses[i].tas.forEach(function (item) {
                        if(item.StudentEmail == requestObject.StudentEmail)
                        {
                            alreadyrequest = true;
                        }
                        if(!alreadyrequest) {
                            if (x == data.Courses[i].tas.length - 1) {
                                var taobj = new Object();
                                taobj.StudentEmail = requestObject.StudentEmail;
                                taobj.StudentResume = requestObject.StudentResume;
                                data.Courses[i].tas.push(taobj);
                                courseFound = true;
                            }
                        }
                        x++;
                    });
                    if(alreadyrequest){
                        return res.json("شما قبلاً درخواست داده اید");
                    }

                }
            }
            if(!courseFound){
                var obj = new Object();
                obj.courseNo = requestObject.CourseNo;
                obj.courseName = requestObject.CourseName;
                obj.tas = [];
                var taobj = new Object();
                taobj.StudentEmail = requestObject.StudentEmail;
                taobj.StudentResume = requestObject.StudentResume;
                obj.tas.push(taobj);
                data.Courses.push(obj);
            }
            TARequestModel.findOneAndUpdate({ProfessorEmail: requestObject.ProfessorEmail}, {$set:{Courses: data.Courses}},function (error, doc) {
                return res.json('با موفقیت انجام شد.');
            });
        }
        else {
            var Courses = [];
            var obj = new Object();
            obj.courseName = requestObject.CourseName;
            obj.courseNo = requestObject.CourseNo;
            obj.tas = [];
            var taobj = new Object();
            taobj.StudentEmail = requestObject.StudentEmail;
            taobj.StudentResume = requestObject.StudentResume;
            obj.tas.push(taobj);
            Courses.push(obj);
            new TARequestModel({ProfessorEmail: requestObject.ProfessorEmail
                ,Courses: Courses}).save(function (error, doc) {
                return res.json('با موفقیت انجام شد.');
            });
        }
    });
};