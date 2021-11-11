"use strict";
angular.module("mediaServicesApp").directive("jobTimeCard", function () {
  return {
    templateUrl: "scripts/directives/jobTimeCard/jobTimeCard.html",
    restrict: "E",
    replace: true,
    scope: {
      jobs: "=",
      active: "="
    },
    controllerAs: "jobTimeCard",
    controller: function chatCtrl(
      $scope,
      $http,
      errors,
      $interval,
      $timeout,
      $localStorage
    ) {
      $scope.errorCount = 0;
      var dateFormatString = "h:mma - M/D/Y";

      $scope.$watch("jobs", function () {
        if ($scope.jobs !== undefined && $scope.active === "jobTimeCard") {
          $scope.timeCard = {};
          $scope.getTimeCard();
        }
      });

      $scope.getTimeCard = function () {
        if ($scope.jobs.jobType == "Duplications") {
          var jobTypeId = 2;
        } else if ($scope.jobs.jobType == "Restores") {
          var jobTypeId = 1;
        } else if ($scope.jobs.jobType == "Ingests") {
          var jobTypeId = 3;
        } else if ($scope.jobs.jobType == "Archives") {
          var jobTypeId = 4;
        }
        $http({
          method: "GET",
          url: "https://moc.golfchannel.com/api/v1/stopwatch/job/" +
            jobTypeId +
            "/" +
            $scope.jobs.id +
            "/?authuser=" +
            $localStorage.authUser +
            "&authtoken=" +
            $localStorage.authToken
        }).then(
          function successCallback(response) {
            $scope.timeCard.hasRunningClocks = response.data.swUserAnyActive;
            $scope.timeCard.hadRunningClocks = response.data.swUserAnyExists;

            $scope.currentlyClockedOn = response.data.swUserCurrentActive;

            if ($scope.timeCard.hasRunningClocks) {
              angular.forEach(response.data.swUserAnyActiveList, function (
                selected
              ) {
                selected.timeStart = moment(selected.timeStart).format(
                  dateFormatString
                );
                var tempHours = 0;
                var tempMin = 0;
                tempHours = Math.round(selected.durationSeconds / 3600, 0);
                tempMin = Math.round((selected.durationSeconds % 3600) / 60, 0);
                if (tempHours > 0) {
                  selected.durationSeconds = tempHours + " H " + tempMin + " M";
                } else {
                  selected.durationSeconds = tempMin + " M";
                }
              });
              $scope.currentActiveClocks = response.data.swUserAnyActiveList;
            }

            if ($scope.timeCard.hadRunningClocks) {
              $scope.testClocks = [];
              var j = 0;
              angular.forEach(response.data.swUserAnyDetails, function (user) {
                //userNameFull: "Michael Burton", totalSeconds: 36713
                var i = 0;
                var key = user.userNameFull;
                $scope.testClocks[j] = [];

                angular.forEach(user.stopwatches, function (selected) {
                  selected.sortTime = moment(selected.timeStart).format("x");
                  selected.timeStart = moment(selected.timeStart).format(
                    dateFormatString
                  );
                  selected.timeEnd = moment(selected.timeEnd).format(
                    dateFormatString
                  );
                  var tempHours = 0;
                  var tempMin = 0;
                  tempHours = Math.round(selected.durationSeconds / 3600, 0);
                  tempMin = Math.round(
                    (selected.durationSeconds % 3600) / 60,
                    0
                  );
                  if (tempHours > 0) {
                    selected.durationSeconds =
                      tempHours + " H " + tempMin + " M";
                  } else {
                    selected.durationSeconds = tempMin + " M";
                  }
                  selected.user = key;
                  $scope.testClocks[j] = selected;
                  i++;
                  j++;
                });
              });
              $scope.testClocks.sort( function compare(a, b) {
                if (a.sortTime < b.sortTime)
                  return 1;
                if (a.sortTime > b.sortTime)
                  return -1;
                return 0;
              });

              // trying to remove duplicates.
              var lastHit = 0;
              for (var i = 1; i < $scope.testClocks.length; i++) {
                if ($scope.testClocks[i - 1].user === $scope.testClocks[i].user) {
                  lastHit = i-1;
                  $scope.testClocks[i].user = "-";
                }
                if ($scope.testClocks[lastHit].user === $scope.testClocks[i].user) {
                  $scope.testClocks[i].user = "-";
                }
              }
            }
          },
          function errorCallback(response) {
            console.log(response);
            errors.httpError(response.status, $scope.errorCount++);
          }
        );
      };

      $scope.statMyClock = function () {
        if ($scope.jobs.jobType == "Duplications") {
          var jobTypeId = 2;
        } else if ($scope.jobs.jobType == "Restores") {
          var jobTypeId = 1;
        } else if ($scope.jobs.jobType == "Ingests") {
          var jobTypeId = 3;
        } else if ($scope.jobs.jobType == "Archives") {
          var jobTypeId = 4;
        }
        $http({
          method: "POST",
          url:
            "https://moc.golfchannel.com/api/v1/stopwatch/job/" +
            jobTypeId +
            "/" + 
            $scope.jobs.id +
            "/?authuser=" +
            $localStorage.authUser +
            "&authtoken=" +
            $localStorage.authToken
        }).then(
          function successCallback(response) {
            $scope.getTimeCard();
            $scope.jobs.updateActiveClocks = true;
          },
          function errorCallback(response) {
            console.log(response);
            errors.httpError(response.status, $scope.errorCount++);
          }
        );
      };
      

      $scope.stopAllClocks = function () {
        if ($scope.jobs.jobType == "Duplications") {
          var jobTypeId = 2;
        } else if ($scope.jobs.jobType == "Restores") {
          var jobTypeId = 1;
        } else if ($scope.jobs.jobType == "Ingests") {
          var jobTypeId = 3;
        } else if ($scope.jobs.jobType == "Archives") {
          var jobTypeId = 4;
        }
        $http({
          method: "DELETE",
          url: "https://moc.golfchannel.com/api/v1/stopwatch/job/" +
            jobTypeId +
            "/" +
            $scope.jobs.id +
            "/?authuser=" +
            $localStorage.authUser +
            "&authtoken=" +
            $localStorage.authToken
        }).then(
          function successCallback(response) {
            $scope.getTimeCard();
            $scope.jobs.updateActiveClocks = true;
          },
          function errorCallback(response) {
            console.log(response);
            errors.httpError(response.status, $scope.errorCount++);
          }
        );
      };
    }
  };
});