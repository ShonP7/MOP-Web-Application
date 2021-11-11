"use strict";
angular.module("mediaServicesApp").directive("dubPanel", function () {
  return {
    templateUrl: "scripts/directives/dubPanel/dubPanel.html",
    restrict: "E",
    replace: true,
    scope: {
      jobs: "=",
      active: "="
    },
    controllerAs: "dubPanel",
    controller: function dubPanel(
      $scope,
      $http,
      errors,
      $interval,
      $timeout,
      $localStorage
    ) {
      
    }
  };
});