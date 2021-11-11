'use strict';
angular.module('mediaServicesApp')
  .controller('instructionalVideosCtrl', function ($scope, $window) {
    // TODO - Add video reszide watch


    $scope.windowWidth = window.innerWidth;
    $scope.test = $scope.windowWidth / 4;

  });