/**
 * Created by ARYA on 8/30/2017.
 */
var app = angular.module('main', ['ngRoute']);
app.controller('mainCtrl', function($scope, $http) {
    $scope.courses = [];
    $scope.tas = [];
    $scope.mainPage = false;
    $scope.midtermHidden = true;
    $scope.finalHidden = true;
    $scope.quizHidden = true;
    $scope.assignmentsHidden = true;
    var allCourses = [];

    $http.get("/courses")
        .then(function(response) {
            $scope.courses = response.data;
        });
    $http.get("/tarequests/").then(function (res) {
        $scope.reqs = res.data;
    });

    $scope.courseInfo = function(info){
        $scope.mainPage = true;
        $http.get("/courseInfo/"+info).then(function (res) {
            console.log(res.data.courseName);
            $scope.CourseInfo = res.data;
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
    $scope.taToggle = function () {
        $scope.taHidden = !$scope.taHidden;
    };
    $scope.eventToggle = function () {
        $scope.eventHidden = !$scope.eventHidden;
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
                object.sender = response.data.ProfessorEmail;
                if($scope.CourseInfo.messages)
                    $scope.CourseInfo.messages.push(object);
                else {
                    $scope.CourseInfo.messages = [];
                    $scope.CourseInfo.messages.push(object);
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