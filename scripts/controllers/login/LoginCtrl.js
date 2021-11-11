"use strict";
angular
  .module("mediaServicesApp")
  .controller("LoginCtrl", function (
    $scope,
    $http,
    $state,
    $localStorage,
    $window
  ) {
    $scope.windowWidth = $window.innerWidth;
    $scope.listOfDeparments = [];

    if ($scope.windowWidth < 374) {
      $scope.windowWidth = false;
    }

    // Input
    $scope.userName = null;
    $scope.password = null;

    // Success and Fail
    $scope.successs = null;

    // Success
    $scope.action = null;
    $scope.userId = null;
    $scope.authUser = null;
    $scope.authToken = null;
    $scope.sessionExpires = null;
    $scope.userPermissions = null;
    $scope.userPreferences = null;

    // Fail
    $scope.errorkind = null;
    $scope.errorId = null;
    $scope.errorText =
      "Please Contact MO for help Trouble Shooting a Connections Issue";
    $scope.httpCode = null;

    // New User
    $scope.rePassword = null;
    $scope.firstName = null;
    $scope.lastName = null;
    $scope.email = null;
    $scope.phone = null;
    $scope.mobile = null;
    $scope.departmentId = null;
    $scope.accessNeed = null;


    function msieversion() {
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");
      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, 
      {
        swal({
          title: "We recommend NOT useing Internet Explorer to access your Media Operation Portal.",
          text: "Instead use an up to date version of Chrome, Edge, Firefox or Safari. You will encounter errors when using Internet Explorer because it is outdated and will not support modern technologies implemented in the page",
          type: "error"
        });
      }
      return false;
  } msieversion();


    // -----Login function-----
    // Set off my login button on login page, posts then redirects on success
    // loginn instead of login cuz i think that login is already taken
    $scope.loginn = function () {
      $http
        .post("https://moc.golfchannel.com/api/v1/user/login", {
          userName: $scope.userName,
          password: $scope.password
        })
        .then(
          function (response) {
            //console.log(JSON.stringify(response));
            // Store auth and user information in Local Storage
            $localStorage.authUser = response.data.authUser;
            $localStorage.authToken = response.data.authToken;
            $localStorage.userId = response.data.userId;
            $localStorage.authUserDepID = response.data.departmentId;
            $localStorage.sessionExpires = response.data.sessionExpires;
            $localStorage.userPermissions = response.data.userPermissions;
            $localStorage.userPreferences = response.data.userPreferences;

            // Directs to Dashboard

            if (
              response.data.userPermissions.duplications.permissionValue == 5 &&
              response.data.userPermissions.ingests.permissionValue == 5 &&
              response.data.userPermissions.restores.permissionValue == 5 &&
              response.data.userPermissions.archives.permissionValue == 5
            ) {
              $state.go("dashboard.operatorHome");
            } else {
              $state.go("dashboard.userHome");
            }
          },
          function (response) {
            // Display reason for error
            $scope.errorKind = "Login Error";
            $scope.errorText = response.data.errorText;
            swal({
              title: $scope.errorKind,
              text: $scope.errorText,
              type: "warning"
            });
          }
        );
    };

    // -----New User Password Modal Poper Uper-----
    $scope.newUser = function () {
      $("#newUser").modal("show");
    };
    // -----New User Controller-----
    // If passwords entered on form match then post if not show error
    // TODO fix post method to how it is in the login
    $scope.newUserSubmit = function () {
      if (
        $scope.password == $scope.rePassword &&
        newUserName.value.match(/^[0-9a-zA-Z]+$/)
      ) {
        $http
          .post("https://moc.golfchannel.com/api/v1/user", {
            userName: $scope.userName,
            password: $scope.password,
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            email: $scope.email,
            phone: $scope.phone,
            mobile: $scope.mobile,
            departmentId: $scope.departmentId,
            accessNeed: $scope.accessNeed
          })
          .success(function (response) {
            $scope.errorKind = "Success";
            $scope.errorText =
              "An Admin in MO must approve your account before use, if urgent call DTC";
            swal($scope.errorKind, $scope.errorText, "success");
            $("#newUser").modal("hide");
          })
          .error(function (response) {
            console.log(response);
            $scope.errorKind = "Error";
            $scope.errorText = response.errorText;
            swal($scope.errorKind, $scope.errorText, "warning");
          });
      } else if ($scope.password != $scope.rePassword) {
        $scope.errorKind = "Password Error";
        $scope.errorText = "Passwords do not match";
        swal($scope.errorKind, $scope.errorText, "warning");
      } else if (!newUserName.value.match(/^[0-9a-zA-Z]+$/)) {
        $scope.errorKind = "Username Error";
        $scope.errorText =
          "Your username can only contain letters and numbers. The username cannot contain spaces and and special characters.";
        swal($scope.errorKind, $scope.errorText, "warning");
      }
    };

  });