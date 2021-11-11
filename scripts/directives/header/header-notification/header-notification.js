'use strict';
angular.module('mediaServicesApp')
  .directive('headerNotification',function() {
      return {
        templateUrl:'scripts/directives/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true,
        controller:function($scope, $state, $localStorage) {

          $scope.user = $localStorage.authUser;

        }
      }
    }
  );