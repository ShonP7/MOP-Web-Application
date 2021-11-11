"use strict";
angular
  .module("mediaServicesApp")
  .controller("viewDubRequestsCtrl", function (
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
    $scope.listOfAssetSources = null;
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
      $scope.passToChat.jobType = "Duplications"
      $scope.passToChat.jobId = jobId;
      $scope.passToChat.jobTypeId = 2;
      $scope.selectedJob = null;
      $scope.windowToShow = "chat";
    };

    $scope.showJobTimeCard = function (jobId) {
      $scope.passToJobTimeCard = {};
      $scope.passToJobTimeCard.id = jobId;
      $scope.passToJobTimeCard.jobType = "Duplications";
      $scope.windowToShow = "jobTimeCard";
    }

    // This will get and format the specifics of the job selected to be dispalyed
    // in the pannel to the right of the table with all records.
    $scope.getSelected = function (id) {
      $http({
        method: "GET",
        url: "https://moc.golfchannel.com/api/v1/duplication/" + id + "?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken
      }).then(
        function successCallback(response) {
          $scope.errorCount = 0;
          var temp = response.data.duplication;

          temp.status = $scope.statudIdToStatusText(temp.statusId);
          if (temp.assetName == null) {
            temp.assetName = "---";
          }
          if (temp.assetCode == null) {
            temp.assetCode = "---";
          }
          if (temp.instructions == null) {
            temp.instructions = "---";
          }
          if (temp.ownerNameFull == null) {
            temp.ownerNameFull = "---";
          }
          if (temp.clientName === null) {
            temp.clientName = "---";
          }
          if (temp.sourceMediaFormatId == null) {
            temp.sourceMediaFormatId = "---";
          }
          if (temp.destinationMedia == null) {
            temp.destinationMedia = "---";
          }
          if (temp.specialInstructions == null) {
            temp.specialInstructions = "---";
          }
          if (temp.watermark == null) {
            temp.watermark = "---";
          } else if (temp.watermark == 1) {
            temp.watermark = "Use Bug";
          } else {
            temp.watermark = "Don't Use Bug";
          }
          if (temp.label == null) {
            temp.label = "---";
          }
          if (temp.requestNeed == null) {
            temp.requestNeed = "---";
          }
          if (temp.userSuppliedStock == null) {
            temp.userSuppliedStock = "---";
          } else if (temp.userSuppliedStock == 0) {
            temp.userSuppliedStock = "No";
          } else {
            temp.userSuppliedStock = "Yes";
          }

          if (temp.noteStatus == null) {
            temp.notStatus = 3;
          }

          temp.timeNeeded = moment(temp.timeNeeded).format(dateFormatString);
          temp.timeSubmitted = moment(temp.timeSubmitted).format(dateFormatString);

          if (temp.sourceMediaFormatId !== null) {
            temp.sourceMediaFormatId =
              $scope.listOfAssetSources[temp.sourceMediaFormatId];
          }

          var destinationSrt = {};
          angular.forEach(temp.destinationMedia, function (selected, key) {
            destinationSrt[$scope.listOfAssetSources[key]] = selected;
          });
          temp.destinationMedia = destinationSrt;


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

    // Kind self explanitory
    $scope.statudIdToStatusText = function (id) {
      if (id == 1) {
        return "Pending";
      } else if (id == 2) {
        return "Approved";
      } else if (id == 3) {
        return "Denied";
      } else if (id == 4) {
        return "Processing";
      } else if (id == 5) {
        return "Completed";
      } else if (id == 6) {
        return "Resubmitted";
      } else if (id == 7) {
        return "Removed";
      } else if (id == 8) {
        return "Failed";
      }
    };

    $scope.getPdf = function (id) {
      $window.open(
        "https://moc.golfchannel.com/api/v1/duplication/" +
        id +
        "/?authuser=" +
        $localStorage.authUser +
        "&authtoken=" +
        $localStorage.authToken +
        "&doctype=pdf"
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

    // Get all of the duplication jobs
    $http({
      method: "GET",
      url: "https://moc.golfchannel.com/api/v1/duplication/?authuser=" +
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

        angular.forEach(response.data.duplications, function (selected) {
          // Format time for display
          selected.timeNeeded = moment(selected.timeNeeded).format(dateFormatString);

          data.push({
            id: selected.id,
            owner: selected.ownerNameFull,
            title: selected.assetName,
            time: selected.timeNeeded
          });

          $scope.tableParams = new NgTableParams({
            count: 10
          }, {
            counts: [10, 50, 100],
            dataset: data
          });

        });
        $scope.errorCount = 0;
      },
      function errorCallback(response) {
        console.log(response);
        errors.httpError(response.status, $scope.errorCount++);
      }
    );
  });