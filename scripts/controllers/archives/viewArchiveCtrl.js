"use strict";
angular
  .module("mediaServicesApp")
  .controller("viewArchiveCtrl", function (
    $scope,
    $anchorScroll,
    $location,
    $http,
    errors,
    $localStorage,
    valueTrans,
    NgTableParams,
    $window
  ) {
    $scope.errorCount = 0;
    $scope.windowWidth = $window.innerWidth;
    $scope.windowHigh = $window.innerHeight;
    $scope.nothingToShow = false;
    $scope.gotDataYet = false;
    $scope.windowToShow = "nothing";
    $scope.userIsAdmin = valueTrans.userIsAdmin;
    var dateFormatString = "h:mma - M/D/Y";
    var data = [];

    // This will watch for the the value trans service to update.
    // This is needed when the user refreshes while on this page
    // To deal with the page loading before the valuetrans does.
    $scope.$watch(
      function () {
        return valueTrans.userIsAdmin;
      },
      function (newVal) {
        $scope.userIsAdmin = newVal;
      }
    );

    // This will pass in job id. This is needed to get more info for
    // a specific job.
    $scope.setJobWindow = function (input) {
      $scope.getSelected(input);
    };


    $scope.showChat = function (jobId) {
      $scope.passToChat = {};
      $scope.passToChat.jobType = "Archive"
      $scope.passToChat.jobId = jobId;
      $scope.passToChat.jobTypeId = 4;
      $scope.selectedJob = null;
      $scope.windowToShow = "chat";
    };

    $scope.showJobTimeCard = function (jobId) {
      $scope.passToJobTimeCard = {};
      $scope.passToJobTimeCard.id = jobId;
      $scope.passToJobTimeCard.jobType = "Archives";
      $scope.windowToShow = "jobTimeCard";
    }

    $scope.getPdf = function (id) {
      $window.open(
        "https://moc.golfchannel.com/api/v1/archive/" +
        id +
        "/?authuser=" +
        $localStorage.authUser +
        "&authtoken=" +
        $localStorage.authToken +
        "&doctype=pdf"
      );
    };

    // This will get and format the specifics of the job selected to be dispalyed
    // in the pannel to the right of the table with all records.
    $scope.getSelected = function (id) {
      $http({
        method: "GET",
        url: "https://moc.golfchannel.com/api/v1/archive/" + id + "?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken
      }).then(
        function successCallback(response) {
          $scope.errorCount = 0;
          var temp = response.data.archives;

          // Format Asset code
          if (temp.assetCode === null) {
            temp.assetCode = "---";
          }

          // Formst Asset Name
          if (temp.assetName === null) {
            temp.assetName = "---";
          }

          // Format avid path
          if (temp.avidPath === null) {
            temp.avidPath = "---";
          }

          // Format Instructions
          if (temp.instructions === null) {
            temp.instructions = "---";
          }

          // Format Owner Name
          if (temp.ownerNameFull === null) {
            temp.ownerNameFull = "---";
          }

          // Format Spacific Assets
          if (temp.specificAssets === null) {
            temp.specificAssets = {};
            temp.specificAssets[0] = "ALL!"
          } else if (temp.specificAssets.length === 0) {
            temp.specificAssets = {};
            temp.specificAssets[0] = "ALL!"
          }

          if (temp.noteStatus == null) {
            temp.notStatus = 3;
          }

          // Format All of the times
          if (temp.timeApproved !== null) {
            temp.timeApproved = moment(temp.timeApproved).format(dateFormatString);
          } else {
            temp.timeApproved = "---";
          }

          if (temp.timeNeeded !== null) {
            temp.timeNeeded = moment(temp.timeNeeded).format(dateFormatString);
          } else {
            temp.timeNeeded = "---";
          }

          if (temp.timeSubmitted !== null) {
            temp.timeSubmitted = moment(temp.timeSubmitted).format(
              dateFormatString
            );
          } else {
            temp.timeSubmitted = "---";
          }

          if (temp.timeStartArchive !== null) {
            temp.timeStartArchive = moment(temp.timeStartArchive).format(
              dateFormatString
            );
          } else {
            temp.timeStartArchive = "---";
          }

          if (temp.timeStartMixdown !== null) {
            temp.timeStartMixdown = moment(temp.timeStartMixdown).format(
              dateFormatString
            );
          } else {
            temp.timeStartMixdown = "---";
          }

          if (temp.timeStartProxy !== null) {
            temp.timeStartProxy = moment(temp.timeStartProxy).format(
              dateFormatString
            );
          } else {
            temp.timeStartProxy = "---";
          }

          $scope.selectedJob = temp;
          $scope.windowToShow = "panel";
          $location.hash("scrollToData");
          $anchorScroll();

        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    // This will get all the records and push them in to the data array for the 
    // table plugin to then display.
    $http({
      method: "GET",
      url: "https://moc.golfchannel.com/api/v1/archive/?authuser=" +
        $localStorage.authUser +
        "&authtoken=" +
        $localStorage.authToken,
      params: {
        scope: "user"
      }
    }).then(
      function successCallback(response) {
        $scope.gotDataYet = true;
        if (response.data["recordCount"] === 0) {
          $scope.nothingToShow = true;
        }
        angular.forEach(response.data.archives, function (selected) {
          selected.timeSubmitted = moment(selected.timeSubmitted).format(
            "h:mma - M/D/Y"
          );

          data.push({
            id: selected.id,
            owner: selected.ownerNameFull,
            title: selected.assetName,
            time: selected.timeSubmitted
          });
        });
        $scope.errorCount = 0;
        $scope.tableParams = new NgTableParams({
          count: 10
        }, {
          counts: [10, 50, 100],
          dataset: data
        });
      },
      function errorCallback(response) {
        console.log(response);
        errors.httpError(response.status, $scope.errorCount++);
      }
    );
  });