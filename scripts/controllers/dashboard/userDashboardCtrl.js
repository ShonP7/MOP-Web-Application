"use strict";
angular
  .module("mediaServicesApp")
  .controller("userDashboardCtrl", function (
    $scope,
    $http,
    errors,
    $localStorage,
    $interval,
    $window
  ) {
    $scope.errorCount = 0;
    $scope.showDuplications = false;
    $scope.showIngests = false;
    $scope.showRestores = false;
    $scope.showArchives = false;

    $scope.duplicationCount = null;
    $scope.duplications = null;

    $scope.ingestCount = null;
    $scope.ingests = null;

    $scope.restoreCount = null;
    $scope.restores = null;

    $scope.archiveCount = null;
    $scope.archives = null;

    $scope.getResponseCounts = null;
    $scope.getResponseData = null;

    //------------------
    // Functions
    // -----------------

    $scope.showHideDashboard = function () {
      // Duplications
      $scope.duplicationCount =
        $scope.getResponseCounts["duplicationsPendingCount"] +
        $scope.getResponseCounts["duplicationsApprovedCount"] +
        $scope.getResponseCounts["duplicationsDeniedCount"] +
        $scope.getResponseCounts["duplicationsProcessingCount"] +
        $scope.getResponseCounts["duplicationsCompletedDayAgoCount"] +
        $scope.getResponseCounts["duplicationsResubmittedCount"] +
        $scope.getResponseCounts["duplicationsRemovedDayAgoCount"];

      $scope.ingestCount =
        $scope.getResponseCounts.ingestsApprovedCount +
        $scope.getResponseCounts.ingestsCompletedDayAgoCount +
        $scope.getResponseCounts.ingestsPendingCount +
        $scope.getResponseCounts.ingestsProcessingCount;

      $scope.restoreCount =
        $scope.getResponseCounts.restoresApprovedCount +
        $scope.getResponseCounts.restoresCompletedDayAgoCount +
        $scope.getResponseCounts.restoresPendingCount +
        $scope.getResponseCounts.restoresProcessingCount;

      $scope.archiveCount =
        $scope.getResponseCounts.archivesApprovedCount +
        $scope.getResponseCounts.archivesArchiveCount +
        $scope.getResponseCounts.archivesPendingCount +
        $scope.getResponseCounts.archivesMixdownCount +
        $scope.getResponseCounts.archivesProxyCount +
        $scope.getResponseCounts.archivesCompletedDayAgoCount;


      // Show or hide fields that matter
      if ($scope.duplicationCount == 0 || $scope.duplicationCount == null) {
        $scope.showDuplications = false;
      } else {
        $scope.showDuplications = true;
        $scope.updateDubData();
      }

      if ($scope.ingestCount == 0 || $scope.ingestCount == null) {
        $scope.showIngests = false;
      } else {
        $scope.showIngests = true;
        $scope.updateIngData();
      }

      if ($scope.restoreCount == 0 || $scope.restoreCount == null) {
        $scope.showRestores = false;
      } else {
        $scope.showRestores = true;
        $scope.updateRestores();
      }

      if ($scope.archiveCount == 0 || $scope.archiveCount == null) {
        $scope.showArchives = false;
      } else {
        $scope.showArchives = true;
        $scope.updateArcData();
      }


      if (
        ($scope.duplicationCount == 0 || $scope.duplicationCount == null) &&
        ($scope.ingestCount == 0 || $scope.ingestCount == null) &&
        ($scope.restoreCount == 0 || $scope.restoreCount == null) &&
        ($scope.archiveCount == 0 || $scope.archiveCount == null)
      ) {
        $scope.showNothing = true;
      } else {
        $scope.showNothing = false;
      }

      $scope.getResponseCounts = null;
      $scope.getResponseData = null;
    };

    $scope.updateDubData = function () {
      $scope.duplications = [];
      //  Populate Tables with Data from JSON
      angular.forEach($scope.getResponseData["duplicationsPending"], function (
        selected
      ) {
        $scope.duplications.push(selected);
      });
      angular.forEach($scope.getResponseData["duplicationsApproved"], function (
        selected
      ) {
        $scope.duplications.push(selected);
      });
      angular.forEach($scope.getResponseData["duplicationsDenied"], function (
        selected
      ) {
        $scope.duplications.push(selected);
      });
      angular.forEach(
        $scope.getResponseData["duplicationsProcessing"],
        function (selected) {
          $scope.duplications.push(selected);
        }
      );
      angular.forEach(
        $scope.getResponseData["duplicationsCompletedDayAgo"],
        function (selected) {
          $scope.duplications.push(selected);
        }
      );
      angular.forEach(
        $scope.getResponseData["duplicationsResubmitted"],
        function (selected) {
          $scope.duplications.push(selected);
        }
      );
      angular.forEach(
        $scope.getResponseData["duplicationsRemovedDayAgo"],
        function (selected) {
          $scope.duplications.push(selected);
        }
      );

      angular.forEach($scope.duplications, function (selected) {
        selected.displayId = "D" + selected.id;

        if (selected.statusId == 1) {
          selected.status = "Pending";
        } else if (selected.statusId == 2) {
          selected.status = "Approved";
        } else if (selected.statusId == 3) {
          selected.status = "Denied";
        } else if (selected.statusId == 4) {
          selected.status = "Processing";
        } else if (selected.statusId == 5) {
          selected.status = "Completed";
        } else if (selected.statusId == 6) {
          selected.status = "Resubmitted";
        } else if (selected.statusId == 7) {
          selected.status = "Removed";
        } else if (selected.statusId == 8) {
          selected.status = "Failed";
        } else if (selected.statusId == 9) {
          selected.status = "Mixdown";
        } else if (selected.statusId == 10) {
          selected.status = "Archive";
        } else if (selected.statusId == 11) {
          selected.status = "Proxy";
        } else if (selected.statusId == 12) {
          selected.status = "Canceled";
        }

        selected.timeSubmitted = moment(selected.timeSubmitted).format("h:mma - M/D/Y");

      });
    };

    $scope.updateRestores = function () {
      $scope.restores = [];
      //  Populate Tables with Data from JSON
      angular.forEach($scope.getResponseData["restoresPendingCount"], function (
        selected
      ) {
        $scope.restores.push(selected);
      });
      angular.forEach($scope.getResponseData["restoresApprovedCount"], function (
        selected
      ) {
        $scope.restores.push(selected);
      });
      angular.forEach(
        $scope.getResponseData["restoresProcessingCount"],
        function (selected) {
          $scope.restores.push(selected);
        }
      );
      angular.forEach(
        $scope.getResponseData["restoresRemovedDayAgoCount"],
        function (selected) {
          $scope.restores.push(selected);
        }
      );
      angular.forEach(
        $scope.getResponseData["restoresCompletedDayAgoCount"],
        function (selected) {
          $scope.restores.push(selected);
        }
      );
      angular.forEach(
        $scope.getResponseData["restoresResubmittedCount"],
        function (selected) {
          $scope.restores.push(selected);
        }
      );
      angular.forEach(
        $scope.getResponseData["restoresFailedDayAgoCount"],
        function (selected) {
          $scope.restores.push(selected);
        }
      );

      angular.forEach($scope.restores, function (selected) {
        selected.displayId = "R" + selected.id;

        if (selected.statusId == 1) {
          selected.status = "Pending";
        } else if (selected.statusId == 2) {
          selected.status = "Approved";
        } else if (selected.statusId == 3) {
          selected.status = "Denied";
        } else if (selected.statusId == 4) {
          selected.status = "Processing";
        } else if (selected.statusId == 5) {
          selected.status = "Completed";
        } else if (selected.statusId == 6) {
          selected.status = "Resubmitted";
        } else if (selected.statusId == 7) {
          selected.status = "Removed";
        } else if (selected.statusId == 8) {
          selected.status = "Failed";
        } else if (selected.statusId == 9) {
          selected.status = "Mixdown";
        } else if (selected.statusId == 10) {
          selected.status = "Archive";
        } else if (selected.statusId == 11) {
          selected.status = "Proxy";
        } else if (selected.statusId == 12) {
          selected.status = "Canceled";
        }

        selected.timeSubmitted = moment(selected.timeSubmitted).format("h:mma - M/D/Y");

      });
    };

    $scope.updateIngData = function () {
      $scope.ingests = [];
      //  Populate Tables with Data from JSON
      angular.forEach($scope.getResponseData["ingestsPending"], function (
        selected
      ) {
        $scope.ingests.push(selected);
      });
      angular.forEach($scope.getResponseData["ingestsApproved"], function (
        selected
      ) {
        $scope.ingests.push(selected);
      });
      angular.forEach($scope.getResponseData["ingestsDenied"], function (
        selected
      ) {
        $scope.ingests.push(selected);
      });
      angular.forEach($scope.getResponseData["ingestsProcessing"], function (
        selected
      ) {
        $scope.ingests.push(selected);
      });
      angular.forEach(
        $scope.getResponseData["ingestsCompletedDayAgo"],
        function (selected) {
          $scope.ingests.push(selected);
        }
      );
      angular.forEach($scope.getResponseData["ingestsResubmitted"], function (
        selected
      ) {
        $scope.ingests.push(selected);
      });
      angular.forEach($scope.getResponseData["ingestsRemovedDayAgo"], function (
        selected
      ) {
        $scope.ingests.push(selected);
      });

      angular.forEach($scope.ingests, function (selected) {
        selected.displayId = "I" + selected.id;

        if (selected.statusId == 1) {
          selected.status = "Pending";
        } else if (selected.statusId == 2) {
          selected.status = "Approved";
        } else if (selected.statusId == 3) {
          selected.status = "Denied";
        } else if (selected.statusId == 4) {
          selected.status = "Processing";
        } else if (selected.statusId == 5) {
          selected.status = "Completed";
        } else if (selected.statusId == 6) {
          selected.status = "Resubmitted";
        } else if (selected.statusId == 7) {
          selected.status = "Removed";
        } else if (selected.statusId == 8) {
          selected.status = "Failed";
        } else if (selected.statusId == 9) {
          selected.status = "Mixdown";
        } else if (selected.statusId == 10) {
          selected.status = "Archive";
        } else if (selected.statusId == 11) {
          selected.status = "Proxy";
        } else if (selected.statusId == 12) {
          selected.status = "Canceled";
        }

        selected.timeSubmitted = moment(selected.timeSubmitted).format("h:mma - M/D/Y");
      });
    };

    $scope.updateArcData = function () {
      $scope.archives = [];
      //  Populate Tables with Data from JSON
      angular.forEach($scope.getResponseData["archivesPending"], function (
        selected
      ) {
        $scope.archives.push(selected);
      });
      angular.forEach($scope.getResponseData["archivesMixdown"], function (
        selected
      ) {
        $scope.archives.push(selected);
      });
      angular.forEach($scope.getResponseData["archivesArchive"], function (
        selected
      ) {
        $scope.archives.push(selected);
      });
      angular.forEach($scope.getResponseData["archivesProxy"], function (
        selected
      ) {
        $scope.archives.push(selected);
      });
      angular.forEach($scope.getResponseData["archivesDenied"], function (
        selected
      ) {
        $scope.archives.push(selected);
      });
      angular.forEach(
        $scope.getResponseData["archivesCompletedDayAgo"],
        function (selected) {
          $scope.archives.push(selected);
        }
      );
      angular.forEach($scope.getResponseData["archivesResubmitted"], function (
        selected
      ) {
        $scope.archives.push(selected);
      });
      angular.forEach($scope.getResponseData["archivesRemovedDayAgo"], function (
        selected
      ) {
        $scope.archives.push(selected);
      });

      angular.forEach($scope.archives, function (selected) {
        selected.displayId = "AR" + selected.id;

        if (selected.statusId == 1) {
          selected.status = "Pending";
        } else if (selected.statusId == 2) {
          selected.status = "Approved";
        } else if (selected.statusId == 3) {
          selected.status = "Denied";
        } else if (selected.statusId == 4) {
          selected.status = "Processing";
        } else if (selected.statusId == 5) {
          selected.status = "Completed";
        } else if (selected.statusId == 6) {
          selected.status = "Resubmitted";
        } else if (selected.statusId == 7) {
          selected.status = "Removed";
        } else if (selected.statusId == 8) {
          selected.status = "Failed";
        } else if (selected.statusId == 9) {
          selected.status = "Mixdown";
        } else if (selected.statusId == 10) {
          selected.status = "Archive";
        } else if (selected.statusId == 11) {
          selected.status = "Proxy";
        } else if (selected.statusId == 12) {
          selected.status = "Canceled";
        }

        selected.timeSubmitted = moment(selected.timeSubmitted).format("h:mma - M/D/Y");

      });
    };

    $scope.getPdf = function (id, type) {
      $window.open(
        "https://moc.golfchannel.com/api/v1/" +
        type +
        "/" +
        id +
        "/?authuser=" +
        $localStorage.authUser +
        "&authtoken=" +
        $localStorage.authToken +
        "&doctype=pdf"
      );
    };
    $scope.getDashboard = function () {
      $http({
        method: "GET",
        url: "https://moc.golfchannel.com/api/v1/overview/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken +
          "&itemized=1"
      }).then(
        function successCallback(response) {
          $scope.getResponseCounts = response.data["counts"];
          $scope.getResponseData = response.data["jobDetails"];
          $scope.showHideDashboard();
          $scope.errorCount = 0;
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    $scope.interval = $interval(function () {
      if ($localStorage.authUser != null) {
        $scope.getDashboard();
      } else {
        $interval.cancel($scope.interval);
      }
    }, 3600000);

    $scope.$on("$destroy", function () {
      $interval.cancel($scope.interval);
    });
  });