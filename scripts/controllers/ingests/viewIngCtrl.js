"use strict";
angular
  .module("mediaServicesApp")
  .controller("viewIngestsCtrl", function (
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
      $scope.passToChat.jobType = "Ingests"
      $scope.passToChat.jobId = jobId;
      $scope.passToChat.jobTypeId = 3;
      $scope.selectedJob = null;
      $scope.windowToShow = "chat";
    };

    $scope.showJobTimeCard = function (jobId) {
      $scope.passToJobTimeCard = {};
      $scope.passToJobTimeCard.id = jobId;
      $scope.passToJobTimeCard.jobType = "Ingests";
      $scope.windowToShow = "jobTimeCard";
    }


    $scope.getPdf = function (id) {
      $window.open(
        "https://moc.golfchannel.com/api/v1/ingest/" +
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
        url: "https://moc.golfchannel.com/api/v1/ingest/" + id + "?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken
      }).then(
        function successCallback(response) {
          $scope.errorCount = 0;
          var temp = response.data.ingest;

          if (temp.title === null) {
            temp.title = "---";
          }

          if (temp.avidPath === null) {
            temp.avidPath = "---";
          }

          if (temp.instructions === null) {
            temp.instructions = "---";
          }

          if (temp.ownerNameFull === null) {
            temp.ownerNameFull = "---";
          }

          if (temp.requestNeed === null) {
            temp.requestNeed = "---";
          }

          if (temp.cameraModel === null) {
            temp.cameraModel = "---";
          }

          if (temp.colorSpace === null) {
            temp.colorSpace = "---";
          }

          // This will hold each item untill it is ready to be 
          // set into the larger data structre. IE Create the 
          // Array then push it.
          var holdLineItem = [];
          if (temp.lineItems !== null) {
            var i = 0;
            angular.forEach(temp.lineItems, function (selected) {
              holdLineItem[i] = [];
              holdLineItem[i][0] = selected.clipTitle;
              holdLineItem[i][1] = $scope.listOfAssetSources[selected.mediaType];
              holdLineItem[i][2] = selected.clipNumber;
              holdLineItem[i][3] = parseInt(selected.id);
              i++;
            });
            temp.lineItems = holdLineItem;
          }

          if (temp.noteStatus == null) {
            temp.notStatus = 3;
          }

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
            temp.timeSubmitted = moment(temp.timeSubmitted).format(dateFormatString);
          } else {
            temp.timeSubmitted = "---";
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

    // Gets the media formats for the drop down select
    $http({
      method: "GET",
      url: "https://moc.golfchannel.com/api/v1/system/codex/media/?authuser=" +
        $localStorage.authUser +
        "&authtoken=" +
        $localStorage.authToken
    }).then(
      function successCallback(response) {
        $scope.errorCount = 0;
        // Reformat the data for better latter use
        var temp = {};
        angular.forEach(response.data.mediaFormats, function (selected) {
          temp[selected["mf_id"]] = selected["mf_format_name"];
        });
        $scope.listOfAssetSources = temp;
      },
      function errorCallback(response) {
        console.log(response);
        errors.httpError(response.status, $scope.errorCount++);
      }
    );

    // This will get all the records and push them in to the data array for the 
    // table plugin to then display.
    $http({
      method: "GET",
      url: "https://moc.golfchannel.com/api/v1/ingest/?authuser=" +
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

        angular.forEach(response.data.ingests, function (selected) {

          selected.timeNeeded = moment(selected.timeNeeded).format(dateFormatString);

          data.push({
            id: selected.id,
            owner: selected.ownerNameFull,
            title: selected.title,
            time: selected.timeNeeded
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
  });