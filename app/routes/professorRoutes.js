/**
 * Created by ARYA on 8/24/2017.
 */
var professor = require('../models/professor.js');

var tarequests = require('../models/taRequest.js');

module.exports = function (app, passport) {
    app.get('/courses', isLoggedIn, function (req, res) {
        var professorModel = professor.getProfessorModel();
        var result = new Object();
        result.courses = [];
        professorModel.findOne({'ProfessorEmail' : req.user.local.email}, function(error, data) {
            if(data) {
                res.json(data.Courses);
            }
            else {
                res.redirect('/studentcourses');
            }
        });
    });

    app.get('/allCourses', isLoggedIn, function (req, res) {
        var professorModel = professor.getProfessorModel();
        var allCourses = [];
        professorModel.find({}, function(error, data) {
            if(data) {
                for (var j = 0; j < data.length; j++) {
                    for (var i = 0; i < data[j].Courses.length; i++) {
                        var courseObject = new Object();
                        courseObject.ProfessorName = data.ProfessorName;
                        courseObject.courseNo = data.Courses[i].courseNo;
                        courseObject.courseName = data.Courses[i].courseName;
                        allCourses.push(courseObject);
                    }
                    res.json(allCourses);
                }
            }
        });
    });

    app.get('/courseInfo/:cno', isLoggedIn, function (req, res) {
        var professorModel = professor.getProfessorModel();
        var result = new Object();
        result.courses = [];
        professorModel.findOne({'ProfessorEmail' : req.user.local.email}, function(error, data) {
            if(data) {
                for(var i = 0 ; i < data.Courses.length; i++){
                    if(data.Courses[i].courseNo == req.params.cno){
                        res.json(data.Courses[i]);
                    }
                }
            }
            else {
                professorModel.findOne({"Courses": {$elemMatch:{"courseNo" : req.params.cno}}}, function (error, doc) {
                    for(var j = 0 ; j < doc.Courses.length; j++){
                        if(doc.Courses[j].courseNo == req.params.cno){
                            return res.json(doc.Courses[j]);
                        }
                    }
                });
            }
        });
    });


    app.get('/coursePage', isLoggedIn, function (req, res) {
       res.sendfile("./views/coursePage.html");
    });

    app.get('/eventPage', isLoggedIn, function(req, res) {
        res.sendfile('./views/event.html');
        //res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/tas', isLoggedIn, function (req, res) {
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

    app.get('/tas/:cnumber', isLoggedIn, function (req, res) {
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

    app.get('/tarequests', isLoggedIn, function (req, res) {
        tarequests.getTARequestModel().find({ProfessorEmail: req.user.local.email}, function (error, data) {
            res.json(data);
        });
    });

    app.get('/tarequests/:cnumber', isLoggedIn, function (req, res) {
        var result = new Object();
        result.tarequests = [];
        tarequests.getTARequestModel().find({ProfessorEmail: req.user.local.email, CourseNo: req.params.cnumber}, function (error, data) {
            result.tarequests = data;
            res.json(result);
        });
    });

    app.post('/acceptta', isLoggedIn, function (req, res) {
        var profEmail = req.user.local.email;//req.body.ProfessorEmail
        var studentEmail = req.body.StudentEmail;
        var courseNo = req.body.CourseNo;
        professor.getProfessorModel().findOne({ProfessorEmail: profEmail}, function (error, data) {
            if(data){
                var courses = data.Courses;
                for(var i = 0; i < courses.length; i++){
                    if(courseNo == courses[i].courseNo){
                        if(courses[i].tas.indexOf(studentEmail) == -1) {
                            courses[i].tas.push(studentEmail);
                            professor.getProfessorModel().findOneAndUpdate({ProfessorEmail: profEmail}, {$set: {Courses: courses}},
                                function (error, doc) {
                                console.log(error);
                                    tarequests.getTARequestModel().findOne({ProfessorEmail: profEmail},
                                        function (error, data) {
                                            for(var j = 0 ; j < data.Courses.length; j++){
                                                if(courseNo == data.Courses[j].courseNo) {
                                                    data.Courses[j].tas.splice(data.Courses[j].tas.indexOf(studentEmail), 1);
                                                    tarequests.getTARequestModel().findOneAndUpdate({ProfessorEmail: profEmail}, {$set:{Courses: data.Courses}}, function (error, doc) {
                                                        if(error)
                                                            console.log(error);
                                                        else {
                                                            console.log(doc);
                                                            return res.json(doc);
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                });
                        }
                        else{
                            return res.json({"Message": "You already Requested!"});
                        }
                    }
                }
            }
        });
    });

    app.post('/rejectta', isLoggedIn, function (req, res) {
        var profEmail = req.user.local.email; //req.body.ProfessorEmail;
        var studentEmail = req.body.StudentEmail;
        var courseNo = req.body.CourseNo;
        tarequests.getTARequestModel().findOne({ProfessorEmail: profEmail},
            function (error, data) {
                for(var j = 0 ; j < data.Courses.length; j++){
                    if(courseNo == data.Courses[j].courseNo) {
                        data.Courses[j].tas.splice(data.Courses[j].tas.indexOf(studentEmail), 1);
                        tarequests.getTARequestModel().findOneAndUpdate({ProfessorEmail: profEmail}, {$set:{Courses: data.Courses}}, function (error, doc) {
                            if(error)
                                console.log(error);
                            else {
                                console.log(doc);
                                return res.json(doc);
                            }
                        });
                    }
                }
            });
    });

    app.post('/setevent', isLoggedIn, function (req, res) {
        var eventType = req.body.eventType;
        var ProfessorEmail = req.user.local.email;//req.body.ProfessorEmail;
        var CourseNo = req.body.CourseNo;
        var date = req.body.date;

        professor.getProfessorModel().findOne({ProfessorEmail: ProfessorEmail}, function (error, data) {
            if(data) {
                for (var i = 0; i < data.Courses.length; i++) {
                    if (data.Courses[i].courseNo == CourseNo) {
                        if (data.Courses[i].events != null) {
                            if (eventType == "midterm") {
                                data.Courses[i].events.midterm.push(date);
                            }
                            else if (eventType == "final") {
                                data.Courses[i].events.final.push(date);
                            }
                            else if (eventType == "quiz") {
                                data.Courses[i].events.quiz.push(date);
                            }
                            else if (eventType == "assignments") {
                                data.Courses[i].events.assignments.push(date);
                            }

                            professor.getProfessorModel().findOneAndUpdate({ProfessorEmail: ProfessorEmail}, {$set: {Courses: data.Courses}}, function (error, doc) {
                                console.log(error);
                            });
                            return res.json("200 OK");
                        }
                        else {
                            data.Courses[i].events = new Object();
                            data.Courses[i].events.midterm = [];
                            data.Courses[i].events.final = [];
                            data.Courses[i].events.quiz = [];
                            data.Courses[i].events.assignments = [];
                            if (eventType == "midterm") {
                                data.Courses[i].events.midterm.push(date);
                            }
                            else if (eventType == "final") {
                                data.Courses[i].events.final.push(date);
                            }
                            else if (eventType == "quiz") {
                                data.Courses[i].events.quiz.push(date);
                            }
                            else if (eventType == "assignments") {
                                data.Courses[i].events.assignments.push(date);
                            }
                            professor.getProfessorModel().findOneAndUpdate({ProfessorEmail: ProfessorEmail}, {$set: {Courses: data.Courses}}, function (error, doc) {
                                console.log(error);
                            });
                            return res.json("200 OK");
                        }
                    }
                }
            }
        });
    });

    app.get('/getevent', isLoggedIn, function (req, res) {
        var ProfessorEmail = req.user.local.email;
        var CourseNo = req.query.CourseNo;
        var eventType = req.query.eventType;
        var results = [];

        professor.getProfessorModel().findOne({ProfessorEmail: ProfessorEmail}, function (error, data) {
            if(data) {
                for (var i = 0; i < data.Courses.length; i++) {
                    if (data.Courses[i].courseNo == CourseNo && CourseNo != null) {
                        if (eventType == "midterm") {
                            return res.json(data.Courses[i].events.midterm);
                        }
                        else if (eventType == "final") {
                            return res.json(data.Courses[i].events.final);
                        }
                        else if (eventType == "quiz") {
                            return res.json(data.Courses[i].events.quiz);
                        }
                        else if (eventType == "assignments") {
                            return res.json(data.Courses[i].events.assignments);
                        }
                    }
                    else if (CourseNo == null) {
                        var object = new Object();
                        object.CourseNo = data.Courses[i].courseNo;
                        object.events = [];
                        if (eventType == "midterm") {
                            object.events = data.Courses[i].events.midterm;
                            results.push(object);
                        }
                        else if (eventType == "final") {
                            object.events = data.Courses[i].events.final;
                            results.push(object);
                        }
                        else if (eventType == "quiz") {
                            object.events = data.Courses[i].events.quiz;
                            results.push(object);
                        }
                        else if (eventType == "assignments") {
                            object.events = data.Courses[i].events.assignments;
                            results.push(object);
                        }
                        if (i == data.Courses.length - 1) {
                            return res.json(results);
                        }
                    }
                }
            }
            else {
                professor.getProfessorModel().findOne({"Courses": {$elemMatch:{"tas" : {$elemMatch: {$eq: req.user.local.email}}}}}, function (error, doc) {
                    for(var i = 0 ; i < doc.Courses.length; i++){
                        if (doc.Courses[i].courseNo == CourseNo && CourseNo != null) {
                            if (eventType == "midterm") {
                                return res.json(doc.Courses[i].events.midterm);
                            }
                            else if (eventType == "final") {
                                return res.json(doc.Courses[i].events.final);
                            }
                            else if (eventType == "quiz") {
                                return res.json(doc.Courses[i].events.quiz);
                            }
                            else if (eventType == "assignments") {
                                return res.json(doc.Courses[i].events.assignments);
                            }
                        }
                        else if (CourseNo == null) {
                            var object = new Object();
                            object.CourseNo = doc.Courses[i].courseNo;
                            object.events = [];
                            if (eventType == "midterm") {
                                object.events = doc.Courses[i].events.midterm;
                                results.push(object);
                            }
                            else if (eventType == "final") {
                                object.events = doc.Courses[i].events.final;
                                results.push(object);
                            }
                            else if (eventType == "quiz") {
                                object.events = doc.Courses[i].events.quiz;
                                results.push(object);
                            }
                            else if (eventType == "assignments") {
                                object.events = doc.Courses[i].events.assignments;
                                results.push(object);
                            }
                            if (i == doc.Courses.length - 1) {
                                return res.json(results);
                            }
                        }
                    }
                });
            }
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