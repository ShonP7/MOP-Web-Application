"use strict";
angular.module("mediaServicesApp").directive("chat", function () {
  return {
    templateUrl: "scripts/directives/chat/chat.html",
    restrict: "E",
    replace: true,
    scope: {
      jobs: "=",
      active: "="
    },
    controllerAs: "chat",
    controller: function chatCtrl(
      $scope,
      $http,
      errors,
      $interval,
      $timeout,
      $localStorage
    ) {
      $scope.errorCount = 0;
      $scope.message = null;
      $scope.firstLoad = true;
      $scope.lastJobLoaded = null;

      $scope.status = 1;
      $scope.statusColor = "lightblue";
      $scope.statusText = "Informational";

      $scope.visabilty = 1;
      $scope.visabilityColor = "lightblue";
      $scope.visabiltyText = "Admin";

      document.getElementById("send").style.height = document.getElementById("messageText").style.height;

      $scope.$watch("jobs", function () {
        if ($scope.jobs !== undefined && $scope.active === "chat") {
          $scope.notes = null;
          $scope.getChat();
          $scope.startChatChecks();
        }
      });

      $scope.startChatChecks = function () {
        $scope.interval = $interval(function () {
          if ($scope.active == "chat") {
            $scope.getChat();
          } else {
            $interval.cancel($scope.interval);
          }
        }, 30000);
      };

      $scope.$on("$destroy", function () {
        $interval.cancel($scope.interval);
      });

      $scope.goToBottom = function () {
        $timeout(function () {
          if ($scope.firstLoad) {
            $("div").animate({
                scrollTop: $("#bottom").position().top
              },
              "slow"
            );
          }
          $scope.firstLoad = false;
        }, 30);
      };

      $scope.onMessageKeyPress = function (event) {
        console.log(event);
        if (event.charCode == 13) {
          $scope.postChat();
        }
        $scope.autoExpand("messageText");
      };

      $scope.autoExpand = function (e) {
        var element =
          typeof e === "object" ? e.target : document.getElementById(e);
        var scrollHeight = element.scrollHeight; // replace 60 by the sum of padding-top and padding-bottom
        element.style.height = scrollHeight + "px";

        document.getElementById("send").style.height = document.getElementById("messageText").style.height;

      };

      $scope.changeStatus = function () {
        if ($scope.status === 3) {
          $scope.status = 1;
          $scope.statusColor = "lightblue";
          $scope.statusText = "Informational";
        } else if ($scope.status === 1) {
          $scope.status = 2;
          $scope.statusColor = "#F0B428";
          $scope.statusText = "Urgent";
        } else if ($scope.status === 2) {
          $scope.status = 3;
          $scope.statusColor = "#B42846";
          $scope.statusText = "Critical";
        }
      };

      $scope.whoView = function () {
        if ($scope.visabilty === 0) {
          $scope.visabilty = 1;
          $scope.visabilityColor = "lightblue";
          $scope.visabiltyText = "Admin";
        } else if ($scope.visabilty === 1) {
          $scope.visabilty = 0;
          $scope.visabilityColor = "#B42846";
          $scope.visabiltyText = "All";
        }
      };

      $scope.getChat = function () {
        // Set true if the get is for a diffrent chat than previously got
        // to avoid scrolling to the bottom when not wanted too.
        if ($scope.lastJobLoaded != $scope.jobs.jobId) {
          $scope.firstLoad = true;
        }
        $scope.lastJobLoaded = $scope.jobs.jobId;
        $http({
          method: "GET",
          url: "https://moc.golfchannel.com/api/v1/note",
          params: {
            authuser: $localStorage.authUser,
            authtoken: $localStorage.authToken,
            jobtype: $scope.jobs.jobTypeId,
            jobid: $scope.jobs.jobId
          }
        }).then(
          function successCallback(response) {
            $scope.notes = response.data.notes;
            angular.forEach($scope.notes, function (selected) {
              selected.timeCreated = moment(selected.timeCreated).format(
                "h:mma - M/D/Y"
              );

              if (selected.ownerId === $localStorage.userId) {
                selected.pullMe = "right";
                selected.color = "lightblue";
              } else {
                selected.pullMe = "left";
                selected.color = "Gainsboro";
              }

              if (
                selected.statusId === 1 &&
                selected.ownerId === $localStorage.userId
              ) {
                selected.background = "lightblue";
              } else if (
                selected.statusId === 1 &&
                selected.ownerId != $localStorage.userId
              ) {
                selected.background = "Gainsboro";
              } else if (selected.statusId === 2) {
                selected.background = "#F0B428";
              } else if (selected.statusId === 3) {
                selected.background = "#B42846";
              }
            });

            $scope.goToBottom();
            $scope.errorCount = 0;
          },
          function errorCallback(response) {
            console.log(response);
            errors.httpError(response.status, $scope.errorCount++);

          }
        );
      };

      $scope.postChat = function () {
        if ($scope.message !== null && $scope.message != "") {
          $http({
            method: "POST",
            url: "https://moc.golfchannel.com/api/v1/note",
            params: {
              authuser: $localStorage.authUser,
              authtoken: $localStorage.authToken
            },
            data: {
              jobType: $scope.jobs.jobTypeId,
              jobId: $scope.jobs.jobId,
              statusId: $scope.status,
              adminOnly: $scope.visabilty,
              message: $scope.message
            }
          }).then(
            function successCallback(response) {
              $scope.message = null;
              $scope.firstLoad = true;
              $scope.getChat();
              $scope.errorCount = 0;
            },
            function errorCallback(response) {
              console.log(response);
              errors.httpError(response.status, $scope.errorCount++);
            }
          );
        }
      };
    }
  };
});