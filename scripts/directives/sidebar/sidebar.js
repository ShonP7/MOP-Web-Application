'use strict';

angular.module('mediaServicesApp')
  .directive('sidebar',['$location',function() {

    return {
      templateUrl:'scripts/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {},
      controller:function($scope, $localStorage, $interval, $window, valueTrans){
        $('#side-menu').metisMenu();
        $scope.meCollapse = null;

        $scope.selectedMenu = 'dashboard';

          $scope.permissionArray = $localStorage.userPermissions;

          $scope.duplicationsPermission = $scope.permissionArray.duplications.permissionValue;
          $scope.ingestsPermission = $scope.permissionArray.ingests.permissionValue;
          $scope.restoresPermission = $scope.permissionArray.restores.permissionValue;
          $scope.archivesPermission = $scope.permissionArray.archives.permissionValue;
          $scope.forePermission = $scope.permissionArray.fore.permissionValue;

          $scope.meSeeDubs = false;
          $scope.meEditDubs = false;
          $scope.meManageDubs = false;
          $scope.meSeeIngs = false;
          $scope.meEditIngs = false;
          $scope.meManageIngs = false;
          $scope.meSeeArcs = false;
          $scope.meEditArcs = false;
          $scope.meManageArcs = false;
          $scope.meSeeRests = false;
          $scope.meEditRests = false;
          $scope.meManageRests = false;
          $scope.meAdmin = false;

          if ($scope.duplicationsPermission == 5 && $scope.ingestsPermission == 5
          && $scope.restoresPermission == 5 && $scope.archivesPermission == 5) {
              $scope.meSeeDubs = true;
              $scope.meEditDubs = true;
              $scope.meManageDubs = true;
              $scope.meSeeIngs = true;
              $scope.meEditIngs = true;
              $scope.meManageIngs = true;
              $scope.meSeeArcs = true;
              $scope.meEditArcs = true;
              $scope.meManageArcs = true;
              $scope.meSeeRests = true;
              $scope.meEditRests = true;
              $scope.meManageRests = true;
              $scope.meAdmin = true;
              $scope.myDashboard = "dashboard.operatorHome";
              valueTrans.userIsAdmin = true;
              valueTrans.myDashboard = "dashboard.operatorHome";
          } else {
              $scope.myDashboard = "dashboard.userHome";
              valueTrans.userIsAdmin = false;
              valueTrans.myDashboard = "dashboard.userHome";
          }


          if ($scope.duplicationsPermission == 2) {
              $scope.meSeeDubs = true;
              $scope.meEditDubs = true;
          } else if ($scope.duplicationsPermission == 3) {
              $scope.meSeeDubs = true;
              $scope.meEditDubs = true;
          } else if ($scope.duplicationsPermission == 4) {
              $scope.meSeeDubs = true;
              $scope.meEditDubs = true;
              $scope.meManageDubs = true;
          }

          if ($scope.ingestsPermission == 2) {
              $scope.meSeeIngs = true;
              $scope.meEditIngs = true;
          } else if ($scope.ingestsPermission == 3) {
              $scope.meSeeIngs = true;
              $scope.meEditIngs = true;
          } else if ($scope.ingestsPermission == 4) {
              $scope.meSeeIngs = true;
              $scope.meEditIngs = true;
              $scope.meManageIngs = true;
          }

          if ($scope.restoresPermission == 2) {
              $scope.meSeeRests = true;
              $scope.meEditRests = true;
          } else if ($scope.restoresPermission == 3) {
              $scope.meSeeRests = true;
              $scope.meEditRests = true;
          } else if ($scope.restoresPermission == 4) {
              $scope.meSeeRests = true;
              $scope.meEditRests = true;
              $scope.meManageRests = true;
          }

          if ($scope.archivesPermission == 2) {
              $scope.meSeeArcs = true;
              $scope.meEditArcs = true;
          } else if ($scope.archivesPermission == 3) {
              $scope.meSeeArcs = true;
              $scope.meEditArcs = true;
          } else if ($scope.archivesPermission == 4) {
              $scope.meSeeArcs = true;
              $scope.meEditArcs = true;
              $scope.meManageArcs = true;
          }

        if ($window.innerWidth <= 768) {
          $scope.meCollapse = "collapse"
        } else {
          $scope.meCollapse = "null"
        }
      }


    }
  }]);