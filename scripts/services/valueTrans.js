'use strict';
angular.module('mediaServicesApp')
  .service('valueTrans', function ($http, $state, $localStorage) {


    this.userIsAdmin = null;
    this.myDashboard = null;
    this.setIntervalFlag = false;

    this.dubTime = null;
    this.dubTimeObj = null;
    this.dubDate = null;
    this.dubDateObj = null;


    this.reset = function () {
      $localStorage.authUser = null;
      $localStorage.authToken = null;
      $localStorage.authUserDepID = null;
      $localStorage.sessionExpires = null;
      $localStorage.userPermissions = null;
      $localStorage.userPreferences = null;
      $localStorage.userId = null;
      $localStorage.userName = null;
      $localStorage.firstName = null;
      $localStorage.lastName = null;
      $localStorage.email = null;
      angular.forEach(this, function (selected) {
        selected = null;
      });
    }

  });
