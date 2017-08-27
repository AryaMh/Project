/**
 * Created by ARYA on 8/25/2017.
 */
var mongoose = require('mongoose');

var TARequestStructure = {
    ProfessorEmail: String,
    StudentEmail: String,
    CourseNo: String
};

var Schema = new mongoose.Schema(TARequestStructure);
var TARequestModel = mongoose.model('tarequests', Schema);

module.exports.getTARequestModel = function () {
    return TARequestModel;
};

module.exports.add = function (requestObject) {
    new TARequestModel({ProfessorEmail: requestObject.ProfessorEmail, StudentEmail: requestObject.StudentEmail
    ,CourseNo: requestObject.CourseNo}).save();
};