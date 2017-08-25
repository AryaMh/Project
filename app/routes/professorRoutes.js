/**
 * Created by ARYA on 8/24/2017.
 */
var professor = require('../models/professor.js');

module.exports = function (app, passport) {
    app.get('/courses', function (req, res) {
        var professorModel = professor.getProfessorModel();
        var result = new Object();
        result.courses = [];
        professorModel.findOne({'ProfessorEmail' : req.user.local.email}, function(error, data) {
            if(data){
                    result.courses = data.Courses;
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
                result.tas = data.TeachingAssistants;
                res.json(result);
            }
        });
    });
};