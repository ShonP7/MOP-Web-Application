'use strict';

angular.module('mediaServicesApp')
  .controller('TimeCtrl', function ($scope, valueTrans) {

      $scope.hstep = 1;
      $scope.mstep = 30;

      $scope.mytime = new Date();
      $scope.mytime.setHours($scope.mytime.getHours() + 2);
      $scope.mytime.setMinutes(0);
      var tempMin = Math.floor($scope.mytime.getMinutes() / $scope.mstep);
      $scope.mytime.setMinutes(tempMin * $scope.mstep);
      valueTrans.dubTime = $scope.mytime.getHours() + ':00:00';
      valueTrans.dubTimeObj = $scope.mytime;


          $scope.options = {
              hstep: [1],
              mstep: [30]
          };

          $scope.ismeridian = true;
          $scope.toggleMode = function() {
              $scope.ismeridian = ! $scope.ismeridian;
          };

          $scope.changed = function () {
              var tempMin = Math.floor($scope.mytime.getMinutes() / $scope.mstep);
              $scope.mytime.setMinutes(tempMin * $scope.mstep);
              if ($scope.mytime.getMinutes() == 0) {
                  valueTrans.dubTime = $scope.mytime.getHours() + ':00:00';
              } else {
                  valueTrans.dubTime = $scope.mytime.getHours() + ':30:00';
              }

              // Clear Confusion up about people selecting midnight and 
              // not knowing it is hour 0 or a day
              if ($scope.mytime.getHours() == 0) {
                $scope.mytime.setHours(23);
                $scope.mytime.setMinutes(59);
                valueTrans.dubTime = 23 + ':59:00'
                valueTrans.dubTimeObj = $scope.mytime
              }

              valueTrans.dubTimeHours = $scope.mytime.getHours();

              valueTrans.dubTimeObj = $scope.mytime;
          };

          $scope.clear = function() {
              $scope.mytime = null;
          };
      });