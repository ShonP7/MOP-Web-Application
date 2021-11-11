'use strict';
angular.module('mediaServicesApp')
    .controller('LogoutCtrl', function ($scope, $http, $state, $localStorage, valueTrans, errors) {

        $scope.success = null;
        $scope.action = null;
        $scope.user = $localStorage.authUser;

        $scope.errorKind = "errorKind";
        $scope.errorText = "errorText";

        $scope.startLogout = function () {
            if (valueTrans.userIsAdmin == true) {
                $scope.checkForActiveJobClocks();
            } else {
                $scope.logoutt();
            }
        };

        $scope.logoutt = function () {

            $http.post('https://moc.golfchannel.com/api/v1/user/logout/?authuser=' + $localStorage.authUser + '&authtoken=' + $localStorage.authToken, {
                // Post No data
            }).then(function successCallback(response) {
                $scope.success = response.success;
                $scope.action = response.action;
                valueTrans.reset();
                $localStorage.$reset();
                $state.go('login');
            }, function errorCallback(response) {
                console.log(response);
                errors.httpError(response.status, $scope.errorCount++);
            });
            swal("Logged Out!", "See you again soon", "success");
        };

        $scope.checkForActiveJobClocks = function () {
            $http({
                method: "GET",
                url: "https://moc.golfchannel.com/api/v1/stopwatch/user/?authuser=" +
                    $localStorage.authUser +
                    "&authtoken=" +
                    $localStorage.authToken
            }).then(
                function successCallback(response) {
                    console.log(response.data.swUserCurrentActive);
                    if (response.data.swUserCurrentActive == false) {
                        $scope.logoutt();
                    } else {
                        swal({
                                title: "Do you want to stop all job clock(s)?",
                                text: "You still have clock(s) running on " + response.data.swUserCurrentActiveCount + " job(s)",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "Yes, stop all clocks",
                                cancelButtonText: "No, leave them running",
                                closeOnConfirm: false,
                                closeOnCancel: false
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    $scope.stopAllMyJobs();
                                } else {
                                    $scope.logoutt();
                                }
                            }
                        );
                    }
                },
                function errorCallback(response) {
                    console.log(response);
                    errors.httpError(response.status, $scope.errorCount++);
                }
            );
        };

        $scope.stopAllMyJobs = function () {
            $http({
                method: "DELETE",
                url: "https://moc.golfchannel.com/api/v1/stopwatch/user/?authuser=" +
                    $localStorage.authUser +
                    "&authtoken=" +
                    $localStorage.authToken
            }).then(
                function successCallback(response) {
                    $scope.logoutt();
                },
                function errorCallback(response) {
                    console.log(response);
                    errors.httpError(response.status, $scope.errorCount++);
                }
            );
        };


    });