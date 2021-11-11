"use strict";
angular
  .module("mediaServicesApp")
  .controller("viewRestCtrl", function (
    $scope,
    $window,
    $anchorScroll,
    $location,
    $http,
    errors,
    $localStorage,
    valueTrans,
    NgTableParams,
  ) {
    $scope.errorCount = 0;
    $scope.windowWidth = $window.innerWidth;
    $scope.windowHigh = $window.innerHeight;
    $scope.nothingToShow = false;
    $scope.masterRest = {};
    $scope.gotDataYet = false;
    $scope.windowToShow = "nothing";
    $scope.userIsAdmin = valueTrans.userIsAdmin;
    var dateFormatString = "h:mma - M/D/Y";
    var data = [];

    // This will pass in job id. This is needed to get more info for
    // a specific job.
    $scope.setJobWindow = function (input) {
      $scope.selectedJob = $scope.masterRest[input];
      $scope.windowToShow = "panel";
      $location.hash("scrollToData");
      $anchorScroll();

    };

    $scope.showChat = function (jobId) {
      $scope.passToChat = {};
      $scope.passToChat.jobType = "Restores"
      $scope.passToChat.jobId = jobId;
      $scope.passToChat.jobTypeId = 1;
      $scope.selectedJob = null;
      $scope.windowToShow = "chat";
    };

    $scope.showJobTimeCard = function (jobId) {
      $scope.passToJobTimeCard = {};
      $scope.passToJobTimeCard.id = jobId;
      $scope.passToJobTimeCard.jobType = "Restores";
      $scope.windowToShow = "jobTimeCard";
    }

    // This will watch for the the value trans service to update.
    // This is needed when the user refreshes while on this page
    // To deal with the page loading before the valuetrans does.
    $scope.$watch(
      function () {
        return valueTrans.userIsAdmin;
      },
      function (newVal) {
        $scope.userIsAdmin = newVal;
        if (newVal === true) {
          if (newVal === true) {
            $scope.getJSON = {
              method: "GET",
              url: "https://moc.golfchannel.com/api/v1/restore/?authuser=" +
                $localStorage.authUser +
                "&authtoken=" +
                $localStorage.authToken
            };
          } else {
            $scope.getJSON = {
              method: "GET",
              url: "https://moc.golfchannel.com/api/v1/restore/?authuser=" +
                $localStorage.authUser +
                "&authtoken=" +
                $localStorage.authToken,
              params: {
                scope: "user"
              }
            };
          }
          $scope.getRestore();
        }
      }
    );

    $scope.getRestore = function () {
      $http($scope.getJSON).then(
        function successCallback(response) {
          $scope.gotDataYet = true;
          if (response.data["recordCount"] === 0) {
            $scope.nothingToShow = true;
          }
          delete response.data.restores["subRestores"];
          delete response.data.restores["subRestoresExist"];
          delete response.data.restores["subRestoresCount"];

          angular.forEach(response.data.restores, function (selected) {

            if (selected.ownerNameFull == false) {
              var n = selected.orphanEmail.indexOf("@");
              selected.ownerNameFull = selected.orphanEmail.substring(0, n) + " " + selected.orphanEmail.substring(n);
            }

            // Convert duration to Min.
            selected.duration = Math.floor(selected.duration / 60);
            selected.timeSubmitted = moment(selected.timeSubmitted).format(dateFormatString);
            selected.timeNeeded = moment(selected.timeNeeded).format(dateFormatString);

            $scope.masterRest[selected.id] = selected;

            data.push({
              id: selected.id,
              owner: selected.ownerNameFull,
              sName: selected.sequenceName,
              time: selected.timeSubmitted
            });
          });
          $scope.tableParams = new NgTableParams({
            count: 10
          }, {
            counts: [10, 50, 100],
            dataset: data
          });
          $scope.errorCount = 0;
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };
  });