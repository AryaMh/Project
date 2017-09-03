/**
 * Created by ARYA on 8/25/2017.
 */
var tarequest = require('../models/taRequest.js');
var professor = require('../models/professor.js');

module.exports = function (app, passport) {
    app.post('/tarequest', function (req, res) {
        var profEmail = req.body.ProfessorEmail;
        var studentUser = req.user.local.email;//req.body.StudentEmail;
        var courseNo = req.body.CourseNo;
        var requestObject = new Object();
        requestObject.ProfessorEmail = profEmail;
        requestObject.StudentEmail = studentUser;
        requestObject.CourseNo = courseNo;
        requestObject.StudentResume = req.body.StudentResume;
        tarequest.add(requestObject);
        res.json({'response': '200'});
    });
    app.get('/studentcourses', isLoggedIn, function (req, res) {
        var taEmail = req.user.local.email;

        professor.getProfessorModel().find({}, function (error, data) {
            var results = [];
            for(var i = 0 ; i < data.length; i++) {
                for (var j = 0; j < data[i].Courses.length; j++) {
                    if (data[i].Courses[j].tas.indexOf(taEmail) != -1){
                        results.push(data[i].Courses[j]);
                    }
                }
            }
            res.json(results);
        });
    });

    app.get('/sttarequest', function (req, res) {
        tarequest.getTARequestModel().find({"Courses": {$elemMatch:{"tas" : {$elemMatch: {'StudentEmail': req.user.local.email}}}}}, function (error, doc) {
            res.json(doc);
        });
    });
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
};