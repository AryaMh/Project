/**
 * Created by ARYA on 8/24/2017.
 */
var professor = require('../models/professor.js');

var tarequests = require('../models/taRequest.js');

module.exports = function (app, passport) {
    app.get('/courses', function (req, res) {
        var professorModel = professor.getProfessorModel();
        var result = new Object();
        result.courses = [];
        professorModel.findOne({'ProfessorEmail' : req.user.local.email}, function(error, data) {
            if(data) {
                for (var i = 0; i < data.Courses.length; i++)
                {
                    result.courses.push(data.Courses[i].courseNo + " - " + data.Courses[i].courseName);
                }
                    res.json(result);
            }
        });
    });

    app.get('/tas', function (req, res) {
        var professorModel = professor.getProfessorModel();
        var result = new Object();
        result.tas = [];
        professorModel.findOne({'ProfessorEmail' : req.user.local.email}, function(error, data) {
            if(data){
                for (var i = 0; i < data.Courses.length; i++)
                {
                    for(var j = 0 ; j < data.Courses[i].tas.length; j++)
                    result.tas.push(data.Courses[i].tas[j]);
                }
                res.json(result);
            }
        });
    });

    app.get('/tas/:cnumber', function (req, res) {
        var professorModel = professor.getProfessorModel();
        var result = new Object();
        result.tas = [];
        professorModel.findOne({'ProfessorEmail' : req.user.local.email}, function(error, data) {
            if(data){
                for (var i = 0; i < data.Courses.length; i++)
                {
                    if(data.Courses[i].courseNo == req.params.cnumber){
                        result.tas.push(data.Courses[i].tas);
                        break;
                    }
                }
                res.json(result);
            }
        });
    });

    app.get('/tarequests', function (req, res) {
        var result = new Object();
        result.tarequests = [];
        tarequests.getTARequestModel().find({ProfessorEmail: req.user.local.email}, function (error, data) {
            result.tarequests = data;
            res.json(result);
        });
    });

    app.get('/tarequests/:cnumber', function (req, res) {
        var result = new Object();
        result.tarequests = [];
        tarequests.getTARequestModel().find({ProfessorEmail: req.user.local.email, CourseNo: req.params.cnumber}, function (error, data) {
            result.tarequests = data;
            res.json(result);
        });
    });
};