/**
 * Created by ARYA on 9/1/2017.
 */
var app = angular.module('login', []);
app.controller('loginCtrl', function($scope, $http) {
        $scope.emailDomain = "@ce.sharif.edu";
        $scope.login = function (email, password, emailDomain) {
            var object = new Object();
            object.email = email+emailDomain;
            object.password = password;
            console.log(object);
            $http({
                url: '/login/',
                method: "POST",
                data: JSON.stringify(object)
            })
                .then(function (response) {
                        if (response.data != null) {
                        }
                    },
                    function (response) { // optional
                        // failed
                    });
        };

});