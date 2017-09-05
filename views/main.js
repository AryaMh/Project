/**
 * Created by ARYA on 8/30/2017.
 */
var app = angular.module('main', ['ngRoute']);
app.controller('mainCtrl', function($scope, $http, $anchorScroll, $window) {
    $scope.courses = [];
    $scope.tas = [];
    $scope.mainPage = false;
    $scope.midtermHidden = true;
    $scope.finalHidden = true;
    $scope.quizHidden = true;
    $scope.assignmentsHidden = true;
    $scope.taAcceptorRejectHidden = true;
    $scope.allCoursesHidden = true;
    $scope.showPopUp = true;
    $scope.myTasHidden = true;
    $scope.myCoursesHidden = true;
    $scope.myEventsHidden = true;
    $scope.tareqs = [];

    $scope.isProfessor = true;
    $scope.allCourses = [];
    $scope.editMidtermHidden = [];
    $scope.editFinalHidden = [];
    $scope.editAssignmentsHidden = [];
    $scope.editQuizHidden = [];

    $http.get("/userType")
        .then(function(response) {
            if(response.data == "professor"){
                $scope.taAcceptorRejectHidden = false;
                $scope.isProfessor = false;
            }
        });
    $http.get("/courses")
        .then(function(response) {
            $scope.courses = response.data;
        });

    $http.get("/tarequests/").then(function (res) {
        $scope.tareqs = res.data;
        if(res.data.length == 0){
            $http.get("/sttarequest")
                .then(function(response) {
                    $scope.tareqs = response.data;
                });
        }
    });


    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("goTop").style.display = "block";
        } else {
            document.getElementById("goTop").style.display = "none";
        }
    }

// When the user clicks on the button, scroll to the top of the document
    $scope.topFunction = function() {
        document.body.scrollTop = 0; // For Chrome, Safari and Opera
        document.documentElement.scrollTop = 0; // For IE and Firefox
    };


    $scope.sendTaRequest = function(popUpProf, popUpGrade, popUpTATerms, popUpAvg, popUpTADesc, popUpFurtherDesc, ProfessorEmail, courseNo, courseName){
        var req = new Object();
        req.ProfessorEmail = ProfessorEmail;
        req.CourseNo = courseNo;
        req.CourseName = courseName;
        req.StudentResume = "استاد قبلی : " + popUpProf + " - نمره : " + popUpGrade +
            " - تعداد ترم های دستیاری : " + popUpTATerms + " - معدل : " + popUpAvg +
            " - سابقه دستیاری در دروس دیگر : " + popUpTADesc + " - توضیحات : " + popUpFurtherDesc;

        console.log(JSON.stringify(req));
        $http({
            url: '/tarequest/',
            method: "POST",
            data: JSON.stringify(req)
        })
            .then(function (response) {
                if(response.data){
                    // var elem = document.getElementById('popUpId');
                    // elem.parentNode.removeChild(elem);
                    $scope.PopUpContent = true;
                    $scope.PopUpContentMessage = response.data;
                    $window.location.href = '/profile';
                }
            });

    };

    $scope.courseInfo = function(info){
        $scope.mainPage = true;
        $http.get("/courseInfo/"+info).then(function (res) {
            console.log(res.data.courseName);
            $scope.CourseInfo = res.data;
            if($scope.CourseInfo.messages)
                $scope.CourseInfo.messages = $scope.CourseInfo.messages.reverse();

            for (var i = 0; i < res.data.events.midterm.length; i++)
            {
                $scope.editMidtermHidden[i] = true;
            }
            for (var i = 0; i < res.data.events.final.length; i++)
            {
                $scope.editFinalHidden[i] = true;
            }
            for (var i = 0; i < res.data.events.assignments.length; i++)
            {
                $scope.editAssignmentsHidden[i] = true;
            }
            for (var i = 0; i < res.data.events.quiz.length; i++)
            {
                $scope.editQuizHidden[i] = true;
            }
        });
    };


    $scope.acceptta = function (taEmail, courseNo) {


        var object = new Object();
        object.StudentEmail = taEmail;
        object.CourseNo = courseNo;
        $http({
            url: '/acceptta/',
            method: "POST",
            data: JSON.stringify(object)
        })
            .then(function (response) {
                 var elem = document.getElementById(taEmail);
                 elem.parentNode.removeChild(elem);
            });
    };

    $scope.rejectta = function (taEmail, courseNo) {


        var object = new Object();
        object.StudentEmail = taEmail;
        object.CourseNo = courseNo;
        $http({
            url: '/rejectta/',
            method: "POST",
            data: JSON.stringify(object)
        })
            .then(function (response) {
                var elem = document.getElementById(taEmail);
                elem.parentNode.removeChild(elem);
            });
    };

    $scope.showMainPage = function () {
        $scope.mainPage = false;
    };

    $scope.eventpage = function (courseNo, url, eventDate) {
        $scope.mainPage = true;
        $scope.eventCourseNo = courseNo;
        $scope.eventType = url;
        $scope.eventDate = eventDate;
        $anchorScroll();

    };
    //CoursePage
    $scope.taHidden = true;
    $scope.eventHidden = true;
    $scope.newMidtermHidden = true;
    $scope.newFinalHidden = true;
    $scope.newQuizHidden = true;
    $scope.newAssignmentHidden = true;
    $scope.new_val=new Object();
    $scope.new_val.first="";

    $scope.taToggle = function () {
        $scope.taHidden = !$scope.taHidden;
    };
    $scope.eventToggle = function () {
        $scope.eventHidden = !$scope.eventHidden;
    };
    $scope.midtermToggle = function () {
        $scope.newMidtermHidden = !$scope.newMidtermHidden;
    };
    $scope.finalToggle = function () {
        $scope.newFinalHidden = !$scope.newFinalHidden;
    };
    $scope.quizToggle = function () {
        $scope.newQuizHidden = !$scope.newQuizHidden;
    };
    $scope.assignmentToggle = function () {
        $scope.newAssignmentHidden = !$scope.newAssignmentHidden;
    };


    $scope.getEvent = function (url) {
        console.log(url);
        $http.get('/getevent?eventType='+url).then(function (res) {
            if(url == "midterm") {
                $scope.midtermHidden = !$scope.midtermHidden;
                $scope.midterms = res.data;
            }
            if(url == "final") {
                $scope.finalHidden = !$scope.finalHidden;
                $scope.final = res.data;
            }
            if(url == "quiz") {
                $scope.quizHidden = !$scope.quizHidden;
                $scope.quiz = res.data;
            }
            if(url == "assignments") {
                $scope.assignmentsHidden = !$scope.assignmentsHidden;
                $scope.assignments = res.data;
            }

        });
    };

    $scope.showCourse = function (courseName, professorName, professorEmail, courseNo) {
        $scope.showPopUp = !$scope.showPopUp;
        var reqCourse = new Object();
        reqCourse.courseName = courseName;
        reqCourse.ProfessorName = professorName;
        reqCourse.ProfessorEmail = professorEmail;
        reqCourse.courseNo = courseNo;
        $scope.reqCourse = reqCourse;
    };

    $scope.showCourses = function () {
        $scope.allCoursesHidden = !$scope.allCoursesHidden;
        $http.get("/allCourses")
            .then(function(response) {
                $scope.allCourses = response.data;
            });
    };

    $scope.removeEvent = function (courseNo, eventType, eventDate) {
        var object = new Object();
        object.eventType = eventType;
        object.CourseNo = courseNo;
        object.date = eventDate;

        $http({
            url: '/removeEvent/',
            method: "POST",
            data: JSON.stringify(object)
        })
            .then(function (response) {
                if(object.eventType == 'midterm') {
                    var index = $scope.CourseInfo.events.midterm.indexOf(object.date);
                    if (index > -1)
                        $scope.CourseInfo.events.midterm.splice(index, 1);
                }
                else if(object.eventType == 'final'){
                    var index = $scope.CourseInfo.events.final.indexOf(object.date);
                    if (index > -1)
                        $scope.CourseInfo.events.final.splice(index, 1);
                }
                else if(object.eventType == 'quiz'){
                    var index = $scope.CourseInfo.events.quiz.indexOf(object.date);
                    if (index > -1)
                        $scope.CourseInfo.events.quiz.splice(index, 1);
                }
                else if(object.eventType == 'assignments'){
                    var index = $scope.CourseInfo.events.assignments.indexOf(object.date);
                    if (index > -1)
                        $scope.CourseInfo.events.assignments.splice(index, 1);
                }
            })
    };

    $scope.editEvent = function (courseNo, eventType, eventDate, newDate) {
        var object = new Object();
        object.eventType = eventType;
        object.CourseNo = courseNo;
        object.date = eventDate;
        object.newDate = newDate;

        $http({
            url: '/editEvent/',
            method: "POST",
            data: JSON.stringify(object)
        })
            .then(function (response) {
                if(object.eventType == 'midterm') {
                    var index = $scope.CourseInfo.events.midterm.indexOf(object.date);
                    if (index > -1) {
                        $scope.CourseInfo.events.midterm[index] = newDate;
                        $scope.editMidtermHidden[index] = true;
                    }
                }
                else if(object.eventType == 'final'){
                    var index = $scope.CourseInfo.events.final.indexOf(object.date);
                    if (index > -1){
                        $scope.CourseInfo.events.final[index] = newDate;
                        $scope.editFinalHidden[index] = true;
                    }
                }
                else if(object.eventType == 'quiz'){
                    var index = $scope.CourseInfo.events.quiz.indexOf(object.date);
                    if (index > -1){
                        $scope.CourseInfo.events.quiz[index] = newDate;
                        $scope.editQuizHidden[index] = true;
                    }
                }
                else if(object.eventType == 'assignments'){
                    var index = $scope.CourseInfo.events.assignments.indexOf(object.date);
                    if (index > -1){
                        $scope.CourseInfo.events.assignments[index] = newDate;
                        $scope.editAssignmentsHidden[index] = true;
                    }
                }
            });
    };

    $scope.submitNewEvent = function (courseNo, eventType, eventDate) {
        var object = new Object();
        object.eventType = eventType;
        object.CourseNo = courseNo;
        object.date = eventDate;

        $http({
            url: '/setevent/',
            method: "POST",
            data: JSON.stringify(object)
        })
            .then(function (response) {
                if($scope.CourseInfo.events == null){
                    $scope.CourseInfo.events = new Object();
                    $scope.CourseInfo.events.midterm = [];
                    $scope.CourseInfo.events.final = [];
                    $scope.CourseInfo.events.quiz = [];
                    $scope.CourseInfo.events.assignments = [];
                }
                if(eventType == 'midterm'){
                    if($scope.CourseInfo.events.midterm)
                        $scope.CourseInfo.events.midterm.push(object.date);
                    else {
                        $scope.CourseInfo.events.midterm = [];
                        $scope.CourseInfo.events.midterm.push(object.date);
                    }
                    $scope.newMidtermHidden = true;
                }
                else if(eventType == 'final'){
                    if($scope.CourseInfo.events.final)
                        $scope.CourseInfo.events.final.push(object.date);
                    else {
                        $scope.CourseInfo.events.final = [];
                        $scope.CourseInfo.events.final.push(object.date);
                    }
                    $scope.newFinalHidden = true;
                }
                else if(eventType == 'quiz'){
                        if($scope.CourseInfo.events.quiz)
                            $scope.CourseInfo.events.quiz.push(object.date);
                        else {
                            $scope.CourseInfo.events.quiz = [];
                            $scope.CourseInfo.events.quiz.push(object.date);
                        }
                        $scope.newQuizHidden = true;
                    }
                else if(eventType == 'assignments'){
                        if($scope.CourseInfo.events.assignments)
                            $scope.CourseInfo.events.assignments.push(object.date);
                        else {
                            $scope.CourseInfo.events.assignments = [];
                            $scope.CourseInfo.events.assignments.push(object.date);
                        }
                        $scope.newAssignmentHidden = true;
                    }
                    //document.getElementById('messageBoard').append('<div class="mainPageObjects" style="margin-bottom: 10px;"><div>فرستنده: {{msg.sender}}</div> <div>متن پیام: {{msg.msg}}</div> <div style="position:relative; font-size: small;">تاریخ ارسال:{{msg.time}}</div></div>');
                    //console.log(response.data);
                    // $append('');
                    //angular.element(document.getElementById('_item')).append($compile("<div class="mainPageObjects" style="margin-bottom: 10px;"><div>فرستنده: {{msg.sender}}</div> <div>متن پیام: {{msg.msg}}</div> <div style="position:relative; font-size: small;">تاریخ ارسال:{{msg.time}}</div></div>")($scope));
                    if (response.data != null) {
                    }
                },
                function (response) { // optional
                    // failed
                });
    };

    $scope.sendMessage = function (courseNo, msg) {
        var object = new Object();
        object.msg = msg;
        object.courseNo = courseNo;
        object.time = new Date();

        $http({
            url: '/sendMessage/',
            method: "POST",
            data: JSON.stringify(object)
        })
            .then(function (response) {
                console.log(response.data);
                object.sender = response.data.sender;
                if($scope.CourseInfo.messages) {
                    $scope.CourseInfo.messages.push(response.data);
                    // $scope.CourseInfo.messages = $scope.CourseInfo.messages.reverse();
                }
                else {
                    $scope.CourseInfo.messages = [];
                    $scope.CourseInfo.messages.push(object);
                    // $scope.CourseInfo.messages = $scope.CourseInfo.messages.reverse();
                }
                document.getElementById('sendmsg').value = "";
                 //document.getElementById('messageBoard').append('<div class="mainPageObjects" style="margin-bottom: 10px;"><div>فرستنده: {{msg.sender}}</div> <div>متن پیام: {{msg.msg}}</div> <div style="position:relative; font-size: small;">تاریخ ارسال:{{msg.time}}</div></div>');
                    //console.log(response.data);
               // $append('');
                    //angular.element(document.getElementById('_item')).append($compile("<div class="mainPageObjects" style="margin-bottom: 10px;"><div>فرستنده: {{msg.sender}}</div> <div>متن پیام: {{msg.msg}}</div> <div style="position:relative; font-size: small;">تاریخ ارسال:{{msg.time}}</div></div>")($scope));
                    if (response.data != null) {
                    }
                },
                function (response) { // optional
                    // failed
                });
    };

});

app.config(function($routeProvider) {
    $routeProvider
        .when("/coursePage/", {
            restrict : 'A',
            templateUrl : "/coursePage/"
        })
        .when("/mainPage/", {
            restrict : 'A',
            templateUrl : "/mainPage/"
        })
        .when("/eventPage/", {
            restrict : 'A',
            templateUrl : "/eventPage/"
        })

});