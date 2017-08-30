/**
 * Created by ARYA on 8/30/2017.
 */
var app = angular.module('main', []);
app.controller('mainCtrl', function($scope, $http) {
    $scope.courses = [];
    $scope.tas = [];
    var allCourses = [];
    $http.get("/courses")
        .then(function(response) {
            $scope.courses = response.data;
        });
    $http.get("/tarequests/").then(function (res) {
        $scope.reqs = res.data;
    });
});