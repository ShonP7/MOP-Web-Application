'use strict';

angular.module('mediaServicesApp')
  .directive('header',function(){
    return {
      templateUrl:'scripts/directives/header/header.html',
      restrict: 'E',
      replace: true,
      scope: {},
      controller:function($scope, $state, $localStorage, $http,  valueTrans, errors) {

        $http({
          method: 'GET',
          url: 'https://moc.golfchannel.com/api/v1/user/?authuser=' + $localStorage.authUser + '&authtoken=' + $localStorage.authToken + "&itemized=1" + '?userId=' + $localStorage.userId,
          params: { 'foobar': new Date().getTime() },
          cache: true
        }).then(function successCallback (response) {
          $scope.currentUser = response.data.firstName + "'s";
          $localStorage.userName = response.data.userName;
          $localStorage.firstName = response.data.firstName;
          $localStorage.lastName = response.data.lastName;
          $localStorage.email = response.data.email;

          if ($scope.currentUser.length > 12) {
            $scope.currentUser = "Your";
          }


        }, function errorCallback (response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        });


        $scope.logoClicked = function () {
          $state.go(valueTrans.myDashboard);
        }

      }
    }
  });