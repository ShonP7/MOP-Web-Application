"use strict";
angular
  .module("mediaServicesApp")
  .controller("operatorDashboardCtrl", function(
    $scope,
    $anchorScroll,
    $window,
    $http,
    errors,
    valueTrans,
    $interval,
    $localStorage,
    $filter,
    $location,
    $state,
    uibDateParser
  ) {
    // Varz
    $scope.testing = "red";
    $scope.errorCount = 0;
    var dateFormatString = "h:mma - M/D/Y";
    $scope.windowWidth = $window.innerWidth;
    $scope.windowHigh = $window.innerHeight;
    $scope.bigWindowToShow = "jobsTable";
    $scope.selected = "Restores";
    $scope.subTSelectedype = "Restoring";
    $scope.selectedJob = null;
    $scope.windowToShow = null;

    $scope.listOfAssetSources = null;
    $scope.passToJobTimeCard = {};
    $scope.passToJobTimeCard.updateActiveClocks = false;

    $scope.dupColor = "green";
    $scope.dubStats = [];
    $scope.dubStats.pending = "-";
    $scope.dubStats.approved = "-";
    $scope.dubStats.processing = "-";

    $scope.restColor = "green";
    $scope.restStats = [];
    $scope.restStats.pending = "-";
    $scope.restStats.restoring = "-";

    $scope.ingColor = "green";
    $scope.ingStats = [];
    $scope.ingStats.pending = "-";
    $scope.ingStats.approved = "-";
    $scope.ingStats.processing = "-";

    $scope.arcColor = "green";
    $scope.arcStats = [];
    $scope.arcStats.pending = "-";
    $scope.arcStats.mixdown = "-";
    $scope.arcStats.proxy = "-";
    $scope.arcStats.archiving = "-";

    $scope.capColor = "green";
    $scope.capStats = [];
    $scope.capStats.pending = "-";
    $scope.capStats.processing = "-";
    $scope.capStats.complete = "-";

    // Some of the var's are Caps because of how they will display to the user

    $scope.Duplications = {
      Pending: {
        column: [
          "Job",
          "Customer",
          "Show Title",
          "Tape Number",
          "Time Needed",
          "Time Submitted"
        ],
        display: [],
        data: []
      },
      Approved: {
        column: [
          "Job",
          "Customer",
          "Show Title",
          "Tape Number",
          "Time Needed",
          "Time Submitted"
        ],
        display: [],
        data: []
      },
      Duplicating: {
        column: [
          "Job",
          "Customer",
          "Show Title",
          "Tape Number",
          "Time Needed",
          "Time Submitted"
        ],
        display: [],
        data: []
      }
    };

    $scope.Restores = {
      Pending: {
        column: ["Job", "Customer", "Sequence", "State", " % ", "Time Needed"],
        display: [],
        data: []
      },
      Restoring: {
        column: ["Job", "Customer", "Sequence", "State", " % ", "Time Needed"],
        display: [],
        data: []
      }
    };

    $scope.Ingests = {
      Pending: {
        column: ["Job", "Customer", "Project Title", "Time Needed"],
        display: [],
        data: []
      },
      Approved: {
        column: ["Job", "Customer", "Project Title", "Time Needed"],
        display: [],
        data: []
      },
      Processing: {
        column: ["Job", "Customer", "Project Title", "Time Needed"],
        display: [],
        data: []
      }
    };

    $scope.Archives = {
      Pending: {
        column: [
          "Job",
          "Customer",
          "Project Title",
          "ProgramID",
          "Time Submitted"
        ],
        display: [],
        data: []
      },
      Mixdown: {
        column: [
          "Job",
          "Customer",
          "Project Title",
          "Program ID",
          "Time Submitted"
        ],
        display: [],
        data: []
      },
      Archiving: {
        column: [
          "Job",
          "Customer",
          "Project Title",
          "Program ID",
          "Time Submitted"
        ],
        display: [],
        data: []
      },
      Proxy: {
        column: [
          "Job",
          "Customer",
          "Project Title",
          "Program ID",
          "Time Submitted"
        ],
        display: [],
        data: []
      }
    };

    $scope.Captions = {
      Pending: {
        column: [
          "Job",
          "File Name",
          "Log Count",
          "Time Created"
        ],
        display: [],
        data: []
      },
      Processing: {
        column: [
          "Job",
          "File Name",
          "Log Count",
          "Time Created"
        ],
        display: [],
        data: []
      },
      Complete: {
        column: [
          "Job",
          "File Name",
          "Log Count",
          "Time Created"
        ],
        display: [],
        data: []
      }
    };

    $scope.setPanel = function(type, subType) {
      $scope.bigWindowToShow = "jobsTable";
      $scope.clearJobWindow();
      $scope.selected = type;
      $scope.subTSelectedype = subType;

      if ($scope.windowWidth < 767) {
        $location.hash("scrollToData");
        $anchorScroll();
      }
    };

    $scope.showChat = function(jobId, jobTypeId) {
      if (jobTypeId === -1) {
        if ($scope.selected === "Duplications") {
          jobTypeId = 2;
        } else if ($scope.selected === "Restores") {
          jobTypeId = 1;
        } else if ($scope.selected === "Ingests") {
          jobTypeId = 3;
        } else if ($scope.selected === "Archives") {
          jobTypeId = 4;
        }
      }
      $scope.passToChat = {};
      $scope.passToChat.jobType = $scope.selected.substring(
        0,
        $scope.selected.length - 1
      );
      $scope.passToChat.jobId = jobId;
      $scope.passToChat.jobTypeId = jobTypeId;
      $scope.selectedJob = null;
      $scope.windowToShow = "chat";
    };

    $scope.showTimeCard = function() {
      $scope.bigWindowToShow = "timeCard";
      $scope.windowToShow = null;
      $scope.getMyTimeCard();
    };

    $scope.showJobTimeCard = function (jobId) {
      $scope.windowToShow = "jobTimeCard";
      $scope.passToJobTimeCard = {};
      $scope.passToJobTimeCard.id = jobId;
      $scope.passToJobTimeCard.jobType = $scope.selected;

      $scope.getMyTimeCard();
    };

    $scope.getTableHeadings = function() {
      return $scope[$scope.selected][$scope.subTSelectedype]["column"];
    };

    $scope.getTableData = function() {
      return $scope[$scope.selected][$scope.subTSelectedype]["display"];
    };

    $scope.setJobWindow = function(id) {
      $scope.selectedJob =
        $scope[$scope.selected][$scope.subTSelectedype]["data"][id];
      $scope.windowToShow = "job"; // will change the window showing
      $scope.selectedJobStatus = $scope.subTSelectedype;
      $scope.selectedJobId = id;

      if ($scope.selected === "Restores") {
        $scope.getSubRestData(id);
      }

      if ($scope.windowWidth < 767) {
        $location.hash("scrollToJob");
        $anchorScroll();
      }
    };

    $scope.scrollTo = function(id) {
      if ($scope.windowWidth < 767) {
        $anchorScroll(id);
      }
    };

    $scope.clearJobWindow = function() {
      $scope.selectedJob = null;
      $scope.windowToShow = null;
    };

    $scope.jsonToArray = function(json) {
      var temp = [];
      for (var x in json) {
        json.hasOwnProperty(x) && temp.push(json[x]);
      }
      return temp;
    };

    $scope.continuousCharacterKiller = function (input) {
      // This function will insert spaces so that strings will 
      // not push frames out of bounds. It will look for spaces
      // and if none are found in an interval of the max length
      // insert them in a good spots or just force them in
      var maxLength = 30;
      if (input.length > maxLength) {
        var originalStr = input;
        var wasChanged = false;
        var saveFirst = input.charAt(0);

        for (var i = maxLength; i < input.length; i++) {
          var c = input.charAt(i);
          if (c === " ") {
            i += maxLength;
            continue;
          } else if (c === "/") {
            input = input.slice(0, i) + " /" + input.slice(i+1, input.length);
            wasChanged = true;
            i += maxLength + 2;
            continue;
          } else if (c === "\\") {
            input = input.slice(0, i) + " \\" + input.slice(i+1, input.length);
            wasChanged = true;
            i += maxLength + 2;
            continue;
          } else if (c === "_") {
            input = input.slice(0, i) + " _" + input.slice(i+1, input.length);
            wasChanged = true;
            i += maxLength + 2;
            continue;
          } else if ((i % maxLength) === (maxLength - 1)) {
            input = input.slice(0, i) + " " + input.slice(i+1, input.length);
            wasChanged = true;
            i += maxLength + 1;
            continue;
        }
      }
        if (wasChanged) {
          return saveFirst + input.slice(1, input.length) + " *Reformatted Text ";
        } else {
          return originalStr;
        }
        
      } else {
        return input;
      }
    }

    $scope.rowBackground = function(input) {
      angular.forEach(input, function(selected) {
        var timeTillNeeded = selected.timeNeededUnix - moment().format("X");
        if (timeTillNeeded < 0) {
          selected.bgColor = "#FFA5A5";
        } else if (timeTillNeeded < 86400) {
          selected.bgColor = "#FAFFA5";
        } else {
          selected.bgColor = "";
        }
      });
    };

    $scope.updateDubCounts = function() {
      // Make dashboard pan color change
      var nextDue = $scope.getResponseCounts["duplicationsNextDueHours"];
      if (nextDue < 0) {
        $scope.dupColor = "red";
      } else if (nextDue < 24) {
        $scope.dupColor = "yellow";
      } else {
        $scope.dupColor = "green";
      }

      // Update counts one the panels
      $scope.dubStats.pending =
        $scope.getResponseCounts["duplicationsPendingCount"];
      $scope.dubStats.approved =
        $scope.getResponseCounts["duplicationsApprovedCount"];
      $scope.dubStats.processing =
        $scope.getResponseCounts["duplicationsProcessingCount"];

      // If there are dubs populate the data model and calls the data display if all not empty
      if (
        $scope.dubStats.pending != null ||
        $scope.dubStats.pending != 0 ||
        $scope.dubStats.approved != null ||
        $scope.dubStats.approved != 0 ||
        $scope.dubStats.processing != null ||
        $scope.dubStats.processing != 0
      ) {
        $scope.setDubData();
      }
    };

    $scope.updateRestCounts = function() {
      // TODO working on new coloring method.
      if ($scope.getResponseCounts["restoresPendingCount"] > 0 ) {
        $scope.restColor = "red";
      } else { 
        $scope.restColor = "green";
      } // The Yellow is taken care of in setRestData func

      // Update display panal
      $scope.restStats.pending =
        $scope.getResponseCounts["restoresPendingCount"];
      $scope.restStats.restoring =
        $scope.getResponseCounts["restoresProcessingCount"];

      // If there are restores populate the data medel by calling Set rest data function
      if (
        $scope.restStats.pending != null ||
        $scope.restStats.pending != 0 ||
        $scope.restStat.restoring != null ||
        $scope.restStats != 0
      ) {
        $scope.setRestData();
      }
    };

    $scope.updateIngCounts = function() {
      if ($scope.getResponseCounts["ingestsNextDueHours"] < 0) {
        $scope.ingColor = "red";
      } else if ($scope.getResponseCounts["ingestsNextDueHours"] < 24) {
        $scope.ingColor = "yellow";
      } else {
        $scope.ingColor = "green";
      }

      $scope.ingStats.pending = $scope.getResponseCounts["ingestsPendingCount"];
      $scope.ingStats.approved =
        $scope.getResponseCounts["ingestsApprovedCount"];
      $scope.ingStats.processing =
        $scope.getResponseCounts["ingestsProcessingCount"];

      if (
        $scope.ingStats.pending != null ||
        $scope.ingStats.pending != 0 ||
        $scope.ingStats.approved != null ||
        $scope.ingStats.approved != 0 ||
        $scope.ingStats.processing != null ||
        $scope.processing != 0
      ) {
        $scope.setIngData();
      }
    };

    $scope.updateArcCounts = function() {
      // Set the color of the archive panals based one the next job due
      if ($scope.getResponseCounts["archivesNextDueHours"] < 0) {
        $scope.arcColor = "red";
      } else if ($scope.getResponseCounts["archivesNextDueHours"] < 24) {
        $scope.arcColor = "yellow";
      } else {
        $scope.arcColor = "green";
      }

      $scope.arcStats.pending =
        $scope.getResponseCounts["archivesPendingCount"];
      $scope.arcStats.mixdown =
        $scope.getResponseCounts["archivesMixdownCount"];
      $scope.arcStats.proxy = $scope.getResponseCounts["archivesProxyCount"];
      $scope.arcStats.archiving =
        $scope.getResponseCounts["archivesArchiveCount"];

      if (
        $scope.arcStats.pending != null ||
        $scope.arcStats.pending != 0 ||
        $scope.arcStats.mixdown != null ||
        $scope.arcStats.mixdown != 0 ||
        $scope.arcStats.archiving != null ||
        $scope.arcStats.archiving != 0
      ) {
        $scope.setArcData();
      }
    };

    // Count number of caption in each State. Done diffrently than the other
    $scope.updateCaptions = function() {
      // TODO Change the color of the pannel
      
      
      $scope.capStats.pending = $scope.getResponseCapCounts["captionsPendingCount"];
      $scope.capStats.processing = $scope.getResponseCapCounts["captionsProcessingCount"];
      $scope.capStats.complete = $scope.getResponseCapCounts["captionsCompleteCount"];
      

      if (
        $scope.capStats.pending != null ||
        $scope.capStats.pending != 0 ||
        $scope.capStats.processing != null ||
        $scope.capStats.processing != 0 ||
        $scope.capStats.complete != null ||
        $scope.capStats.complete != 0
      ) {
        $scope.setCapData();
      }

    }

    $scope.setDubData = function() {
      // Set Pending Data Set
      $scope.Duplications.Pending.display = {};
      $scope.Duplications.Pending.data = {};
      if ($scope.dubStats.pending != 0) {
        angular.forEach($scope.getResponseData["duplicationsPending"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data

          selected = $scope.dubDisplayFormat(selected);
          

          // The Display array is used for the table rows
          $scope.Duplications.Pending.display[selected.id] = {
            noteStatus: selected.noteStatus,
            id: selected.id,
            ownerNameFull: selected.ownerNameFull,
            assetName: selected.assetName,
            assetCode: selected.assetCode,
            timeNeeded: selected.timeNeeded,
            timeSubmitted: selected.timeSubmitted,
            timeNeededUnix: selected.timeNeededUnix,
            hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
            anyClockRunning: selected.stopwatchDetails.swUserAnyActive
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Duplications.Pending.data[selected.id] = {
            id: selected.id,
            idDisplay: selected.idDisplay,
            status: "Pending",
            statusId: selected.statusId,
            assetName: selected.assetName,
            assetCode: selected.assetCode,
            instructions: selected.instructions,
            clientName: selected.clientName,
            ownerNameFull: selected.ownerNameFull,
            sourceMediaFormatId: selected.sourceMediaFormatId,
            destinationMedia: selected.destinationMedia,
            specialInstructions: selected.instructions,
            bug: selected.watermark,
            label: selected.label,
            reasonForUse: selected.requestNeed,
            timeSubmitted: selected.timeSubmitted,
            timeNeeded: selected.timeNeeded,
            userSuppliedStock: selected.userSuppliedStock
          };
        });
        $scope.rowBackground($scope.Duplications.Pending.display);
        $scope.getResponseData["duplicationsPending"] = null;
      }

      $scope.Duplications.Approved.display = {};
      $scope.Duplications.Approved.data = {};
      if ($scope.dubStats.approved != 0) {
        angular.forEach(
          $scope.getResponseData["duplicationsApproved"],
          function(selected) {
            // Preparing Data for insertion into the display and data

            selected = $scope.dubDisplayFormat(selected);

            // The Display array is used for the table rows
            $scope.Duplications.Approved.display[selected.id] = {
              noteStatus: selected.noteStatus,
              id: selected.id,
              ownerNameFull: selected.ownerNameFull,
              assetName: selected.assetName,
              assetCode: selected.assetCode,
              timeNeeded: selected.timeNeeded,
              timeSubmitted: selected.timeSubmitted,
              timeNeededUnix: selected.timeNeededUnix,
              hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
              anyClockRunning: selected.stopwatchDetails.swUserAnyActive
            };

            // The Data is used to store ALL data and will display it the job window
            $scope.Duplications.Approved.data[selected.id] = {
              id: selected.id,
              idDisplay: selected.idDisplay,
              status: "Approved",
              statusId: selected.statusId,
              assetName: selected.assetName,
              assetCode: selected.assetCode,
              instructions: selected.instructions,
              clientName: selected.clientName,
              ownerNameFull: selected.ownerNameFull,
              sourceMediaFormatId: selected.sourceMediaFormatId,
              destinationMedia: selected.destinationMedia,
              specialInstructions: selected.instructions,
              bug: selected.watermark,
              label: selected.label,
              reasonForUse: selected.requestNeed,
              timeSubmitted: selected.timeSubmitted,
              timeNeeded: selected.timeNeeded,
              userSuppliedStock: selected.userSuppliedStock
            };
          }
        );
      }
      $scope.rowBackground($scope.Duplications.Approved.display);
      $scope.getResponseData["duplicationsApproved"] = null;

      $scope.Duplications.Duplicating.display = {};
      $scope.Duplications.Duplicating.data = {};
      if ($scope.dubStats.processing != 0) {
        angular.forEach(
          $scope.getResponseData["duplicationsProcessing"],
          function(selected) {
            // Preparing Data for insertion into the display and data

            selected = $scope.dubDisplayFormat(selected);

            // The Display array is used for the table rows
            $scope.Duplications.Duplicating.display[selected.id] = {
              noteStatus: selected.noteStatus,
              id: selected.id,
              ownerNameFull: selected.ownerNameFull,
              assetName: selected.assetName,
              assetCode: selected.assetCode,
              timeNeeded: selected.timeNeeded,
              timeSubmitted: selected.timeSubmitted,
              timeNeededUnix: selected.timeNeededUnix,
              hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
              anyClockRunning: selected.stopwatchDetails.swUserAnyActive
            };

            // The Data is used to store ALL data and will display it the job window
            $scope.Duplications.Duplicating.data[selected.id] = {
              id: selected.id,
              idDisplay: selected.idDisplay,
              status: "Processing",
              statusId: selected.statusId,
              assetName: selected.assetName,
              assetCode: selected.assetCode,
              instructions: selected.instructions,
              clientName: selected.clientName,
              ownerNameFull: selected.ownerNameFull,
              sourceMediaFormatId: selected.sourceMediaFormatId,
              destinationMedia: selected.destinationMedia,
              specialInstructions: selected.instructions,
              bug: selected.watermark,
              label: selected.label,
              reasonForUse: selected.requestNeed,
              timeSubmitted: selected.timeSubmitted,
              timeNeeded: selected.timeNeeded,
              userSuppliedStock: selected.userSuppliedStock
            };
          }
        );
      }
      $scope.rowBackground($scope.Duplications.Duplicating.display);
      $scope.getResponseData["duplicationsProcessing"] = null;
    };

    $scope.setRestData = function() {
      // Set Pending Data Set
      $scope.Restores.Pending.display = {};
      $scope.Restores.Pending.data = {};
      if ($scope.restStats.pending != 0) {
        angular.forEach($scope.getResponseData["restoresPending"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.restDisplayFormat(selected);
          
          // The Display array is used for the table rows
          $scope.Restores.Pending.display[selected.id] = {
            noteStatus: selected["noteStatus"],
            id: selected["id"],
            ownerNameFull: selected["ownerNameFull"],
            sequenceName: selected["sequenceName"],
            statusText: selected["statusText"],
            progressPercent: selected["progressPercent"],
            timeNeeded: selected["timeNeeded"],
            timeNeededUnix: selected.timeNeededUnix,
            hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
            anyClockRunning: selected.stopwatchDetails.swUserAnyActive
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Restores.Pending.data[selected.id] = {
            id: selected["id"],
            idDisplay: selected.idDisplay,
            status: "Pending",
            duration: selected["duration"],
            noteStatus: selected["noteStatus"],
            ownerNameFull: selected["ownerNameFull"],
            progressPercent: selected["progressPercent"],
            sequenceName: selected["sequenceName"],
            statusText: selected["statusText"],
            statusId: selected["statusId"],
            timeNeeded: selected["timeNeeded"],
            timeExpires: selected["timeExpires"],
            timeSubmitted: selected["timeSubmitted"]
          };
        });
      }

      $scope.getResponseData["RestoresPending"] = null;

      // Set Restoring Data Set
      $scope.Restores.Restoring.display = {};
      $scope.Restores.Restoring.data = {};
      if ($scope.restStats.Restoring != 0) {
        angular.forEach($scope.getResponseData["restoresProcessing"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          let colorTimer;
          let curTime = moment().format("X");
          selected = $scope.restDisplayFormat(selected);

          colorTimer = curTime - selected.timeNeededUnix;

          // Display yellow if pending is less than 8 horus old
          if (colorTimer < 28800 && $scope.restColor != 'red') { 
            $scope.restColor = "yellow";
          }

          // The Display array is used for the table rows
          $scope.Restores.Restoring.display[selected.id] = {
            noteStatus: selected["noteStatus"],
            id: selected["id"],
            ownerNameFull: selected["ownerNameFull"],
            sequenceName: selected["sequenceName"],
            statusText: selected["statusText"],
            progressPercent: selected["progressPercent"],
            timeNeeded: selected["timeNeeded"],
            timeNeededUnix: selected.timeNeededUnix,
            hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
            anyClockRunning: selected.stopwatchDetails.swUserAnyActive
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Restores.Restoring.data[selected.id] = {
            id: selected["id"],
            idDisplay: selected.idDisplay,
            status: "Restoring",
            duration: selected["duration"],
            noteStatus: selected["noteStatus"],
            ownerNameFull: selected["ownerNameFull"],
            progressPercent: selected["progressPercent"],
            sequenceName: selected["sequenceName"],
            statusText: selected["statusText"],
            statusId: selected["statusId"],
            timeNeeded: selected["timeNeeded"],
            timeExpires: selected["timeExpires"],
            timeSubmitted: selected["timeSubmitted"]
          };
        });
        $scope.getResponseData["restoresProcessing"] = null;
      }
    };

    $scope.setIngData = function() {
      // Set Pending Data Set
      $scope.Ingests.Pending.display = {};
      $scope.Ingests.Pending.data = {};
      if ($scope.ingStats.pending != 0) {
        angular.forEach($scope.getResponseData["ingestsPending"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.ingDisplayFormat(selected);

          // The Display array is used for the table rows
          $scope.Ingests.Pending.display[selected.id] = {
            noteStatus: selected.noteStatus,
            id: selected.id,
            ownerNameFull: selected.ownerNameFull,
            title: selected.title,
            timeNeeded: selected.timeNeeded,
            timeNeededUnix: selected.timeNeededUnix,
            hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
            anyClockRunning: selected.stopwatchDetails.swUserAnyActive
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Ingests.Pending.data[selected.id] = {
            avidPath: selected.avidPath,
            idDisplay: selected.idDisplay,
            status: "Pending",
            id: selected.id,
            instructions: selected.instructions,
            colorSpace: selected.colorSpace,
            cameraModel: selected.cameraModel,
            lineItems: selected.lineItems,
            lineItemsCount: selected.lineItemsCount,
            noteStatus: selected.noteStatus,
            ownerNameFull: selected.ownerNameFull,
            requestNeed: selected.requestNeed,
            statusId: selected.statusId,
            timeApproved: selected.timeApproved,
            timeNeeded: selected.timeNeeded,
            timeSubmitted: selected.timeSubmitted
          };
        });
      }
      $scope.rowBackground($scope.Ingests.Pending.display);
      $scope.getResponseData["ingestsPending"] = null;

      // Set Approved Data Set
      $scope.Ingests.Approved.display = {};
      $scope.Ingests.Approved.data = {};
      if ($scope.ingStats.Approved != 0) {
        angular.forEach($scope.getResponseData["ingestsApproved"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.ingDisplayFormat(selected);

          // The Display array is used for the table rows
          $scope.Ingests.Approved.display[selected.id] = {
            noteStatus: selected.noteStatus,
            id: selected.id,
            ownerNameFull: selected.ownerNameFull,
            title: selected.title,
            timeNeeded: selected.timeNeeded,
            timeNeededUnix: selected.timeNeededUnix,
            hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
            anyClockRunning: selected.stopwatchDetails.swUserAnyActive
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Ingests.Approved.data[selected.id] = {
            avidPath: selected.avidPath,
            idDisplay: selected.idDisplay,
            status: "Approved",
            id: selected.id,
            colorSpace: selected.colorSpace,
            cameraModel: selected.cameraModel,
            instructions: selected.instructions,
            lineItems: selected.lineItems,
            lineItemsCount: selected.lineItemsCount,
            noteStatus: selected.noteStatus,
            ownerNameFull: selected.ownerNameFull,
            requestNeed: selected.requestNeed,
            statusId: selected.statusId,
            timeApproved: selected.timeApproved,
            timeNeeded: selected.timeNeeded,
            timeSubmitted: selected.timeSubmitted
          };
        });
      }
      $scope.rowBackground($scope.Ingests.Approved.display);
      $scope.getResponseData["ingestsApproved"] = null;

      // TODO - The other part
      // Set Processing Data Set
      $scope.Ingests.Processing.display = {};
      $scope.Ingests.Processing.data = {};
      if ($scope.ingStats.Processing != 0) {
        angular.forEach($scope.getResponseData["ingestsProcessing"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.ingDisplayFormat(selected);

          // The Display array is used for the table rows
          $scope.Ingests.Processing.display[selected.id] = {
            noteStatus: selected.noteStatus,
            id: selected.id,
            ownerNameFull: selected.ownerNameFull,
            title: selected.title,
            timeNeeded: selected.timeNeeded,
            timeNeededUnix: selected.timeNeededUnix,
            hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
            anyClockRunning: selected.stopwatchDetails.swUserAnyActive
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Ingests.Processing.data[selected.id] = {
            avidPath: selected.avidPath,
            idDisplay: selected.idDisplay,
            status: "Processing",
            id: selected.id,
            colorSpace: selected.colorSpace,
            cameraModel: selected.cameraModel,
            instructions: selected.instructions,
            lineItems: selected.lineItems,
            lineItemsCount: selected.lineItemsCount,
            noteStatus: selected.noteStatus,
            ownerNameFull: selected.ownerNameFull,
            requestNeed: selected.requestNeed,
            statusId: selected.statusId,
            timeApproved: selected.timeApproved,
            timeNeeded: selected.timeNeeded,
            timeSubmitted: selected.timeSubmitted
          };
        });
      }
      $scope.rowBackground($scope.Ingests.Processing.display);
      $scope.getResponseData["ingestsProcessing"] = null;
    };

    $scope.setArcData = function() {
      // Set Pending Data Set
      $scope.Archives.Pending.display = {};
      $scope.Archives.Pending.data = {};
      if ($scope.arcStats.pending != 0) {
        angular.forEach($scope.getResponseData["archivesPending"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.arcDisplayFormat(selected);

          // The Display array is used for the table rows
          $scope.Archives.Pending.display[selected.id] = {
            noteStatus: selected.noteStatus,
            id: selected.id,
            ownerNameFull: selected.ownerNameFull,
            assetCode: selected.assetCode,
            assetName: selected.assetName,
            timeSubmitted: selected.timeSubmitted,
            timeNeededUnix: selected.timeNeededUnix,
            hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
            anyClockRunning: selected.stopwatchDetails.swUserAnyActive
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Archives.Pending.data[selected.id] = {
            idDisplay: selected.idDisplay,
            status: "Pending",
            statusId: selected.statusId,
            noteStatus: selected.noteStatus,
            assetCode: selected.assetCode,
            assetName: selected.assetName,
            avidPath: selected.avidPath,
            id: selected.id,
            instructions: selected.instructions,
            ownerNameFull: selected.ownerNameFull,
            specificAssets: selected.specificAssets,
            timeApproved: selected.timeApproved,
            timeNeeded: selected.timeNeeded,
            timeSubmitted: selected.timeSubmitted,
            timeStartArchive: selected.timeStartArchive,
            timeStartMixdown: selected.timeStartMixdown,
            timeStartProxy: selected.timeStartProxy
          };
        });
      }
      $scope.rowBackground($scope.Archives.Pending.display);
      $scope.getResponseData["archivesPending"] = null;

      // Set Mixdown Data Set
      $scope.Archives.Mixdown.display = {};
      $scope.Archives.Mixdown.data = {};
      if ($scope.arcStats.mixdown != 0) {
        angular.forEach($scope.getResponseData["archivesMixdown"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.arcDisplayFormat(selected);

          // The Display array is used for the table rows
          $scope.Archives.Mixdown.display[selected.id] = {
            noteStatus: selected.noteStatus,
            id: selected.id,
            ownerNameFull: selected.ownerNameFull,
            assetCode: selected.assetCode,
            assetName: selected.assetName,
            timeSubmitted: selected.timeSubmitted,
            timeNeededUnix: selected.timeNeededUnix,
            hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
            anyClockRunning: selected.stopwatchDetails.swUserAnyActive
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Archives.Mixdown.data[selected.id] = {
            idDisplay: selected.idDisplay,
            status: "Mixdown",
            statusId: selected.statusId,
            noteStatus: selected.noteStatus,
            assetCode: selected.assetCode,
            assetName: selected.assetName,
            avidPath: selected.avidPath,
            id: selected.id,
            instructions: selected.instructions,
            ownerNameFull: selected.ownerNameFull,
            specificAssets: selected.specificAssets,
            timeApproved: selected.timeApproved,
            timeNeeded: selected.timeNeeded,
            timeSubmitted: selected.timeSubmitted,
            timeStartArchive: selected.timeStartArchive,
            timeStartMixdown: selected.timeStartMixdown,
            timeStartProxy: selected.timeStartProxy
          };
        });
      }
      $scope.rowBackground($scope.Archives.Mixdown.display);
      $scope.getResponseData["archivesMixdown"] = null;

      // Set Proxy Data Set
      $scope.Archives.Proxy.display = {};
      $scope.Archives.Proxy.data = {};
      if ($scope.arcStats.proxy != 0) {
        angular.forEach($scope.getResponseData["archivesProxy"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.arcDisplayFormat(selected);

          // The Display array is used for the table rows
          $scope.Archives.Proxy.display[selected.id] = {
            noteStatus: selected.noteStatus,
            id: selected.id,
            ownerNameFull: selected.ownerNameFull,
            assetCode: selected.assetCode,
            assetName: selected.assetName,
            timeSubmitted: selected.timeSubmitted,
            timeNeededUnix: selected.timeNeededUnix,
            hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
            anyClockRunning: selected.stopwatchDetails.swUserAnyActive
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Archives.Proxy.data[selected.id] = {
            idDisplay: selected.idDisplay,
            status: "Proxying",
            statusId: selected.statusId,
            noteStatus: selected.noteStatus,
            assetCode: selected.assetCode,
            assetName: selected.assetName,
            avidPath: selected.avidPath,
            id: selected.id,
            instructions: selected.instructions,
            ownerNameFull: selected.ownerNameFull,
            specificAssets: selected.specificAssets,
            timeApproved: selected.timeApproved,
            timeNeeded: selected.timeNeeded,
            timeSubmitted: selected.timeSubmitted,
            timeStartArchive: selected.timeStartArchive,
            timeStartMixdown: selected.timeStartMixdown,
            timeStartProxy: selected.timeStartProxy
          };
        });
      }
      $scope.rowBackground($scope.Archives.Proxy.display);
      $scope.getResponseData["archivesProxy"] = null;

      // Set Archiving Data Set
      $scope.Archives.Archiving.display = {};
      $scope.Archives.Archiving.data = {};
      if ($scope.arcStats.archiving != 0) {
        angular.forEach($scope.getResponseData["archivesArchive"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.arcDisplayFormat(selected);

          // The Display array is used for the table rows
          $scope.Archives.Archiving.display[selected.id] = {
            noteStatus: selected.noteStatus,
            id: selected.id,
            ownerNameFull: selected.ownerNameFull,
            assetCode: selected.assetCode,
            assetName: selected.assetName,
            timeSubmitted: selected.timeSubmitted,
            timeNeededUnix: selected.timeNeededUnix,
            hasClockRunning: selected.stopwatchDetails.swUserCurrentActive,
            anyClockRunning: selected.stopwatchDetails.swUserAnyActive
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Archives.Archiving.data[selected.id] = {
            idDisplay: selected.idDisplay,
            status: "Archiving",
            statusId: selected.statusId,
            noteStatus: selected.noteStatus,
            assetCode: selected.assetCode,
            assetName: selected.assetName,
            avidPath: selected.avidPath,
            id: selected.id,
            instructions: selected.instructions,
            ownerNameFull: selected.ownerNameFull,
            specificAssets: selected.specificAssets,
            timeApproved: selected.timeApproved,
            timeNeeded: selected.timeNeeded,
            timeSubmitted: selected.timeSubmitted,
            timeStartArchive: selected.timeStartArchive,
            timeStartMixdown: selected.timeStartMixdown,
            timeStartProxy: selected.timeStartProxy
          };
        });
      }
      $scope.rowBackground($scope.Archives.Archiving.display);
      $scope.getResponseData["archivesArchive"] = null;
    };

    $scope.setCapData = function () {

      $scope.Captions.Pending.display = {};
      $scope.Captions.Pending.data = {};
      if ($scope.capStats.pending != 0) {
        angular.forEach($scope.getResponseCapData["captionsPending"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.capDisplayFormat(selected);
          // console.log(selected);

          // The Display array is used for the table rows
          $scope.Captions.Pending.display[selected.id] = {
            noteStatus: -1,
            id: selected.id,
            fileName: selected.fileName,
            logItemsCount: selected.logItemsCount,
            timeCreated: selected.timeCreated,
            hasClockRunning: null,
            anyClockRunning: null
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Captions.Pending.data[selected.id] = {
            idDisplay: selected.idDisplay,
            status: "Pending",
            statusId: selected.statusId,
            noteStatus: selected.noteStatus,
            id: selected.id,
            fileName: selected.fileName,
            fileSizeBytes: selected.fileSizeBytes,
            fileSizeSeconds: selected.fileSizeSeconds,
            logItems: selected.logItems,
            logItemsCount: selected.logItemsCount,
            statusIdListJson: selected.statusIdListJson,
            timeCreated: selected.timeCreated
          };
        });
      }
      // $scope.rowBackground($scope.Captions.Pending.display);
      $scope.getResponseCapData["captionsPending"] = null;


      $scope.Captions.Processing.display = {};
      $scope.Captions.Processing.data = {};
      if ($scope.capStats.processing != 0) {
        angular.forEach($scope.getResponseCapData["captionsProcessing"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.capDisplayFormat(selected);
          // console.log(selected);

          // The Display array is used for the table rows
          $scope.Captions.Pending.display[selected.id] = {
            noteStatus: -1,
            id: selected.id,
            fileName: selected.fileName,
            logItemsCount: selected.logItemsCount,
            timeCreated: selected.timeCreated,
            hasClockRunning: null,
            anyClockRunning: null
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Captions.Pending.data[selected.id] = {
            idDisplay: selected.idDisplay,
            status: "Processing",
            statusId: selected.statusId,
            noteStatus: selected.noteStatus,
            id: selected.id,
            fileName: selected.fileName,
            fileSizeBytes: selected.fileSizeBytes,
            fileSizeSeconds: selected.fileSizeSeconds,
            logItems: selected.logItems,
            logItemsCount: selected.logItemsCount,
            statusIdListJson: selected.statusIdListJson,
            timeCreated: selected.timeCreated
          };
        });
      }
      // $scope.rowBackground($scope.Captions.Processing.display);
      $scope.getResponseCapData["captionsProcessing"] = null;




      $scope.Captions.Complete.display = {};
      $scope.Captions.Complete.data = {};
      if ($scope.capStats.pending != 0) {
        angular.forEach($scope.getResponseCapData["captionsComplete"], function(
          selected
        ) {
          // Preparing Data for insertion into the display and data
          selected = $scope.capDisplayFormat(selected);

          // The Display array is used for the table rows
          $scope.Captions.Pending.display[selected.id] = {
            noteStatus: -1,
            id: selected.id,
            fileName: selected.fileName,
            logItemsCount: selected.logItemsCount,
            timeCreated: selected.timeCreated,
            hasClockRunning: null,
            anyClockRunning: null
          };

          // The Data is used to store ALL data and will display it the job window
          $scope.Captions.Pending.data[selected.id] = {
            idDisplay: selected.idDisplay,
            status: "Complete",
            statusId: selected.statusId,
            noteStatus: selected.noteStatus,
            id: selected.id,
            fileName: selected.fileName,
            fileSizeBytes: selected.fileSizeBytes,
            fileSizeSeconds: selected.fileSizeSeconds,
            logItems: selected.logItems,
            logItemsCount: selected.logItemsCount,
            statusIdListJson: selected.statusIdListJson,
            timeCreated: selected.timeCreated
          };
        });
      }
      // $scope.rowBackground($scope.Captions.Complete.display);
      $scope.getResponseCapData["captionsComplete"] = null;


    };

    $scope.dubDisplayFormat = function(temp) {
      temp.idDisplay = "D" + temp.id;

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
      if (temp.reasonForUse == null) {
        temp.reasonForUse = "---";
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
      temp.timeNeededUnix = moment(temp.timeNeeded).format("X");
      temp.timeNeeded = moment(temp.timeNeeded).format(dateFormatString);
      temp.timeSubmitted = moment(temp.timeSubmitted).format(dateFormatString);

      if (temp.sourceMediaFormatId !== null) {
        temp.sourceMediaFormatId =
          $scope.listOfAssetSources[temp.sourceMediaFormatId];
      }

      var destinationSrt = {};
      angular.forEach(temp.destinationMedia, function(selected, key) {
        destinationSrt[$scope.listOfAssetSources[key]] = selected;
      });
      temp.destinationMedia = destinationSrt;

      return temp;
    };

    $scope.restDisplayFormat = function(temp) {
      temp.idDisplay = "R" + temp.id;

      // Converting to Minuts
      if (temp.ownerNameFull == false) {
        if (temp.orphanEmail != false || temp.orphanEmail != null) {
          temp.ownerNameFull = "Orphan - " + temp.orphanEmail;
        } else {
          temp.ownerNameFull = "Orphan - No Email";
        }
      }
      
      temp.sequenceName = $scope.continuousCharacterKiller(temp.sequenceName);

      if (temp["duration"] !== null) {
        Math.round((temp["duration"] = temp["duration"] / 60));
      } else {
        temp["duration"] = "---";
      }

      // TODO Note on Notes
      if (temp["noteStatus"] === 0) {
        // TODO - note Status stuff
      }

      // Format the progress Percent
      if (temp["progressPercent"] !== null) {
        temp["progressPercent"] = temp["progressPercent"] + "%";
      } else {
        temp["progressPercent"] = "---";
      }

      if (temp["statusText"] === null) {
        temp["statusText"] = "---";
      }

      if (temp.noteStatus == null) {
        temp.notStatus = 3;
      }

      // Formst the Times
      if (temp.timeSubmitted !== null) {
        temp.timeSubmitted = moment(temp.timeSubmitted).format(
          dateFormatString
        );
      } else {
        temp.timeSubmitted = "---";
      }

      if (temp.timeNeeded !== null) {
        temp.timeNeededUnix = moment(temp.timeNeeded).format("X");
        temp.timeNeeded = moment(temp.timeNeeded).format(dateFormatString);
      } else {
        temp.timeNeeded = "---";
      }

      if (temp.timeExpires !== null) {
        temp.timeExpires = moment(temp.timeExpires).format(dateFormatString);
      } else {
        temp.timeExpires = "---";
      }

      return temp;
    };

    $scope.ingDisplayFormat = function(temp) {
      temp.idDisplay = "I" + temp.id;

      if (temp.title === null) {
        temp.title = "---";
      }

      if (temp.avidPath === null) {
        temp.avidPath = "---";
      } else {
        temp.avidPath = $scope.continuousCharacterKiller(temp.avidPath);
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

      var holdLineItem = [];
      if (temp.lineItems !== null) {
        var i = 0;
        angular.forEach(temp.lineItems, function(selected) {
          holdLineItem[i] = [];
          holdLineItem[i][0] = $scope.continuousCharacterKiller(selected.clipTitle);
          holdLineItem[i][1] = selected.mediaType;
          holdLineItem[i][2] = selected.clipNumber;
          holdLineItem[i][3] = parseInt(selected.statusId);
          holdLineItem[i][4] = parseInt(selected.id);
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
        temp.timeNeededUnix = moment(temp.timeNeeded).format("X");
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

      return temp;
    };

    $scope.arcDisplayFormat = function(temp) {
      temp.idDisplay = "AR" + temp.id;

      // Format Asset code
      if (temp.assetCode === null) {
        temp.assetCode = "---";
      } else {
        temp.assetCode = $scope.continuousCharacterKiller(temp.assetCode);
      }

      // Formst Asset Name
      if (temp.assetName === null) {
        temp.assetName = "---";
      } else {
        temp.assetName = $scope.continuousCharacterKiller(temp.assetName);
      }

      // Format avid path
      if (temp.avidPath === null) {
        temp.avidPath = "---";
      } else {
        temp.avidPath = $scope.continuousCharacterKiller(temp.avidPath);
      }

      // Format Instructions
      if (temp.instructions === null) {
        temp.instructions = "---";
      } else {
        temp.instructions = $scope.continuousCharacterKiller(temp.instructions);
      }

      // Format Owner Name
      if (temp.ownerNameFull === null) {
        temp.ownerNameFull = "---";
      }

      // Format Spacific Assets
      if (temp.specificAssets === null) {
        temp.specificAssets = {};
        temp.specificAssets[0] = "ALL!";
      } else {
        //$scope.continuousCharacterKiller(
          angular.forEach(temp.specificAssets, function(value, key) {
            temp.specificAssets[key] = $scope.continuousCharacterKiller(value);
            console.log(temp.specificAssets[key]);
          });
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


      if (temp.timeSubmitted !== null) {
        temp.timeNeededUnix = moment(temp.timeSubmitted).add(36,'hour').format("X");
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

      return temp;
    };

    $scope.capDisplayFormat = function(temp) {
      temp.idDisplay = "C" + temp.id;

      if (temp.statusId === null) {
        temp.statusId = "---";
      }
      if (temp.fileName === null) {
        temp.fileName = "---";
      }
      if (temp.fileSizeBytes === null) {
        temp.fileSizeBytes = "---";
      }
      if (temp.fileSizeSeconds === null) {
        temp.fileSizeSeconds = "---";
      }
      if (temp.logItemsCount === null) {
        temp.logItemsCount = "---";
      }
      if (temp.statusIdListJson === null) {
        temp.statusIdListJson = "---";
      }
      if (temp.timeCreated === null) {
        temp.timeCreated = "---";
      }



      // Json formats
      if (temp.logItems === null) {
        temp.logItems = "---";
      } else {
        temp.logItems = JSON.stringify(temp.logItems, null, 2);
      }

      if (temp.statusIdListJson === null) {
        temp.statusIdListJson = "---";
      } else {
        temp.statusIdListJson = JSON.stringify(temp.statusIdListJson, null, 2);
      }

      
      return temp;
    };

    $scope.getPdf = function(id) {
      var tempType = $scope.selected
        .substring(0, $scope.selected.length - 1)
        .toLowerCase();

      $window.open(
        "https://moc.golfchannel.com/api/v1/" +
          tempType +
          "/" +
          id +
          "/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken +
          "&doctype=pdf"
      );
    };

    $scope.changeSubIngestStatus = function(currentId, nextId, subId) {
      $http({
        method: "PATCH",
        url:
          "https://moc.golfchannel.com/api/v1/ingest/" +
          $scope.selectedJob.id +
          "/lineitem/" +
          subId +
          "/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken,
        data: {
          statusId: nextId
        }
      }).then(
        function successCallback(response) {
          $scope.errorCount = 0;
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );

      return nextId;
    };

    $scope.getSubRestData = function(id) {
      // Getting the subRestore data when a jobs is clicked on. After formating
      // adds it to .lineItems for display on the dashboard

      // $scope.selectedJob.lineItems = $scope[$scope.selected][temp]['data'][id].lineItems;

      if ($scope.lastSubId != id) {
        $scope.currentSubRestExist = false;
        $scope.lastSubId = id;
        $scope.currentRestoreLine = [];
      }
      if ($scope.currentSubRestExist !== true) {
        $scope.currentRestoreLine = [];
        $scope.currentSubRestExist = false;
      }

      $http({
        method: "GET",
        url:
          "https://moc.golfchannel.com/api/v1/restore/" +
          id +
          "/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken +
          "&rand=" +
          Math.random(10)
      }).then(
        function successCallback(response) {
          if (response.data.restores.subRestoresExist) {
            $scope.currentSubRestExist = true;
            for (
              var i = 0;
              i < response.data.restores.subRestores.length;
              i++
            ) {
              $scope.currentRestoreLine[i] = [];
              if (response.data.restores.subRestores[i]["statusId"] == 1) {
                $scope.currentRestoreLine[i][0] = "Pending";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 2
              ) {
                $scope.currentRestoreLine[i][0] = "Approved";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 3
              ) {
                $scope.currentRestoreLine[i][0] = "Denied";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 4
              ) {
                $scope.currentRestoreLine[i][0] = "Processing";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 5
              ) {
                $scope.currentRestoreLine[i][0] = "Completed";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 6
              ) {
                $scope.currentRestoreLine[i][0] = "Resubmitted";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 7
              ) {
                $scope.currentRestoreLine[i][0] = "Removed";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 8
              ) {
                $scope.currentRestoreLine[i][0] = "Failed";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 9
              ) {
                $scope.currentRestoreLine[i][0] = "Mixdown";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 10
              ) {
                $scope.currentRestoreLine[i][0] = "Archive";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 11
              ) {
                $scope.currentRestoreLine[i][0] = "Proxy";
              } else if (
                response.data.restores.subRestores[i]["statusId"] == 12
              ) {
                $scope.currentRestoreLine[i][0] = "Cancled";
              }

              $scope.currentRestoreLine[i][1] =
              $scope.continuousCharacterKiller(response.data.restores.subRestores[i]["statusText"]);
              $scope.currentRestoreLine[i][2] =
                response.data.restores.subRestores[i]["progressPercent"] + "%";

            }
          } else {
            $scope.currentRestoreLine = [];
            $scope.currentSubRestExist = false;
          }
          $scope.errorCount = 0;
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    $scope.clearRestore = function(id) {
      // Trim the Key values that are used to display to the user to be API okay (no CAPS or "s")

      $scope.clearJobWindow();

      $http({
        method: "PATCH",
        url:
          "https://moc.golfchannel.com/api/v1/restore/" +
          id +
          "/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken,
        data: {
          statusId: 5
        }
      }).then(
        function successCallback(response) {
          console.log(response);
          $scope.errorCount = 0;
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    $scope.holdSubRestData = function(id) {
      return $scope.currentRestoreLine;
    };

    $scope.completeConfirm = function(id) {
      swal(
        {
          title: "Are you sure?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, Complete it",
          cancelButtonText: "No, cancel!",
          closeOnConfirm: true,
          closeOnCancel: false
        },
        function(isConfirm) {
          if (isConfirm) {
            $scope.patchDashboard(id, 5);
          } else {
            swal({
              title: "Cancelled",
              type: "error",
              timer: 1000
            });
          }
        }
      );
    };

    $scope.patchDashboard = function(id, statusChange) {
      // Trim the Key values that are used to display to the user to be API okay (no CAPS or "s")
      var tempType = $scope.selected
        .substring(0, $scope.selected.length - 1)
        .toLowerCase();
      $scope.clearJobWindow();

      $http({
        method: "PATCH",
        url:
          "https://moc.golfchannel.com/api/v1/" +
          tempType +
          "/" +
          id +
          "/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken,
        data: {
          statusId: statusChange
        }
      }).then(
        function successCallback(response) {
          if ($scope.selected === "Duplications") {
            if (statusChange == 2) {
              $scope["Duplications"]["Pending"]["display"][id]["statusId"] = 2;
              $scope["Duplications"]["Pending"]["data"][id]["statusId"] = 2;
              $scope["Duplications"]["Approved"]["display"][id] =
                $scope["Duplications"]["Pending"]["display"][id];
              delete $scope["Duplications"]["Pending"]["display"][id];
              $scope["Duplications"]["Approved"]["data"][id] =
                $scope["Duplications"]["Pending"]["data"][id];
              delete $scope["Duplications"]["Pending"]["data"][id];
              $scope.dubStats.pending--;
              $scope.dubStats.approved++;
            } else if (statusChange == 4) {
              $scope["Duplications"]["Approved"]["display"][id]["statusId"] = 4;
              $scope["Duplications"]["Approved"]["data"][id]["statusId"] = 4;
              $scope["Duplications"]["Duplicating"]["display"][id] =
                $scope["Duplications"]["Approved"]["display"][id];
              delete $scope["Duplications"]["Approved"]["display"][id];
              $scope["Duplications"]["Duplicating"]["data"][id] =
                $scope["Duplications"]["Approved"]["data"][id];
              delete $scope["Duplications"]["Approved"]["data"][id];
              $scope.dubStats.approved--;
              $scope.dubStats.processing++;
            } else if (statusChange == 5) {
              delete $scope["Duplications"]["Duplicating"]["display"][id];
              delete $scope["Duplications"]["Duplicating"]["data"][id];
              $scope.dubStats.processing--;
              if (
                $scope.dubStats.pending === 0 &&
                $scope.dubStats.approved === 0 &&
                $scope.dubStats.processing === 0
              ) {
                $scope.dupColor = "green";
              }
            }
          } else if ($scope.selected === "Ingests") {
            if (statusChange == 2) {
              $scope["Ingests"]["Pending"]["display"][id]["statusId"] = 2;
              $scope["Ingests"]["Pending"]["data"][id]["statusId"] = 2;
              $scope["Ingests"]["Approved"]["display"][id] =
                $scope["Ingests"]["Pending"]["display"][id];
              delete $scope["Ingests"]["Pending"]["display"][id];
              $scope["Ingests"]["Approved"]["data"][id] =
                $scope["Ingests"]["Pending"]["data"][id];
              delete $scope["Ingests"]["Pending"]["data"][id];
              $scope.ingStats.pending--;
              $scope.ingStats.approved++;
            } else if (statusChange == 4) {
              $scope["Ingests"]["Approved"]["display"][id]["statusId"] = 4;
              $scope["Ingests"]["Approved"]["data"][id]["statusId"] = 4;
              $scope["Ingests"]["Processing"]["display"][id] =
                $scope["Ingests"]["Approved"]["display"][id];
              delete $scope["Ingests"]["Approved"]["display"][id];
              $scope["Ingests"]["Processing"]["data"][id] =
                $scope["Ingests"]["Approved"]["data"][id];
              delete $scope["Ingests"]["Approved"]["data"][id];
              $scope.ingStats.approved--;
              $scope.ingStats.processing++;
            } else if (statusChange == 5) {
              delete $scope["Ingests"]["Processing"]["display"][id];
              delete $scope["Ingests"]["Processing"]["data"][id];
              $scope.ingStats.processing--;
              if (
                $scope.ingStats.pending === 0 &&
                $scope.ingStats.approved === 0 &&
                $scope.ingStats.processing === 0
              ) {
                $scope.ingColor = "green";
              }
            }
          } else if ($scope.selected === "Archives") {
            if (statusChange == 9) {
              $scope["Archives"]["Pending"]["display"][id]["statusId"] = 9;
              $scope["Archives"]["Pending"]["data"][id]["statusId"] = 9;
              $scope["Archives"]["Mixdown"]["display"][id] =
                $scope["Archives"]["Pending"]["display"][id];
              delete $scope["Archives"]["Pending"]["display"][id];
              $scope["Archives"]["Mixdown"]["data"][id] =
                $scope["Archives"]["Pending"]["data"][id];
              delete $scope["Archives"]["Pending"]["data"][id];
              $scope.arcStats.pending--;
              $scope.arcStats.mixdown++;
            } else if (statusChange == 10) {
              $scope["Archives"]["Mixdown"]["display"][id]["statusId"] = 10;
              $scope["Archives"]["Mixdown"]["data"][id]["statusId"] = 10;
              $scope["Archives"]["Archiving"]["display"][id] =
                $scope["Archives"]["Mixdown"]["display"][id];
              delete $scope["Archives"]["Mixdown"]["display"][id];
              $scope["Archives"]["Archiving"]["data"][id] =
                $scope["Archives"]["Mixdown"]["data"][id];
              delete $scope["Archives"]["Mixdown"]["data"][id];
              $scope.arcStats.mixdown--;
              $scope.arcStats.archiving++;
            } else if (statusChange == 11) {
              $scope["Archives"]["Archiving"]["display"][id]["statusId"] = 11;
              $scope["Archives"]["Archiving"]["data"][id]["statusId"] = 11;
              $scope["Archives"]["Proxy"]["display"][id] =
                $scope["Archives"]["Archiving"]["display"][id];
              delete $scope["Archives"]["Archiving"]["display"][id];
              $scope["Archives"]["Proxy"]["data"][id] =
                $scope["Archives"]["Archiving"]["data"][id];
              delete $scope["Archives"]["Archiving"]["data"][id];
              $scope.arcStats.archiving--;
              $scope.arcStats.proxy++;
            } else if (statusChange == 5) {
              delete $scope["Archives"]["Proxy"]["display"][id];
              delete $scope["Archives"]["Proxy"]["data"][id];
              $scope.arcStats.proxy--;
              if (
                $scope.arcStats.proxy === 0 &&
                $scope.arcStats.archiving === 0 &&
                $scope.arcStats.mixdown === 0 &&
                $scope.arcStats.pending === 0
              ) {
                $scope.arcColor = "green";
              }
            }
          }
          $scope.errorCount = 0;
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    $scope.getMediaFormats = function() {
      // Gets the media formats for the drop down select
      $http({
        method: "GET",
        url:
          "https://moc.golfchannel.com/api/v1/system/codex/media/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken
      }).then(
        function successCallback(response) {
          // Reformat the data for better latter use
          var temp = {};
          angular.forEach(response.data.mediaFormats, function(selected) {
            temp[selected["mf_id"]] = selected["mf_format_name"];
          });
          $scope.listOfAssetSources = temp;
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };
    
    $scope.getMyTimeCard = function() {
      $http({
        method: "GET",
        url:
          "https://moc.golfchannel.com/api/v1/stopwatch/user/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken
      }).then(
        function successCallback(response) {
          if (response.data.swUserCurrentActive === false) {
            $scope.timeCardCount = 0;
          } else {
            // Erase previouse data
            $scope.myTimeCardLineItems = null;

            // Format for display in a table
            angular.forEach(response.data.swUserCurrentActiveDetails, function (selected) {
              // Format Time Started
              selected.timeStart = moment(selected.timeStart).format(dateFormatString);

              // Format Duration for each Job
              var tempHours = 0;
              var tempMin = 0;
              tempHours = Math.round(selected.durationSeconds / 3600, 0);
              tempMin =  Math.round((selected.durationSeconds % 3600) / 60, 0);
              if (tempHours > 0) {
                selected.durationSeconds = tempHours + " H " + tempMin + " M";
              } else {
                selected.durationSeconds = tempMin + " M";
              }

              // Format Job Id's ot include prefix of job types
              if (selected.jobTypeId === 1) {
                selected.jobDisplayId = "R" + selected.jobId; // Restore
              } else if (selected.jobTypeId === 2) {
                selected.jobDisplayId = "D" + selected.jobId; // Duplication
              } else if (selected.jobTypeId === 3) {
                selected.jobDisplayId = "I" + selected.jobId; // Ingest
              } else if (selected.jobTypeId === 4) {
                selected.jobDisplayId = "AR" + selected.jobId; // Archive
              }

            })
            // Store data in scope for display
            $scope.myTimeCardLineItems = response.data.swUserCurrentActiveDetails;
            $scope.timeCardCount = response.data.swUserCurrentActiveCount;
          }
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    // initualizing the vars and calling the func for first load
    $scope.myTimeCardLineItems = null;
    $scope.timeCardCount = 0;
    $scope.getMyTimeCard();

    $scope.startMyTime = function(jobId) {
      if ($scope.selected == "Duplications") {
        var jobTypeId = 2;
      } else if ($scope.selected == "Restores") {
        var jobTypeId = 1;
      } else if ($scope.selected == "Ingests") {
        var jobTypeId = 3;
      } else if ($scope.selected == "Archives") {
        var jobTypeId = 4;
      }
      $http({
        method: "POST",
        url:
          "https://moc.golfchannel.com/api/v1/stopwatch/job/" +
          jobTypeId +
          "/" + 
          jobId +
          "/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken
      }).then(
        function successCallback(response) {
          $scope.getMyTimeCard();
           if ($scope[$scope.selected][$scope.subTSelectedype]["display"][jobId]["hasClockRunning"] == true) {
            $scope[$scope.selected][$scope.subTSelectedype]["display"][jobId]["hasClockRunning"] = false;
           } else {
            $scope[$scope.selected][$scope.subTSelectedype]["display"][jobId]["hasClockRunning"] = true;
           }
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
      
    };
    // A post will start a clock. This post will stop the clock.
    $scope.stopJobClock = function (jobTypeId, jobId) {
      $http({
        method: "POST",
        url:
          "https://moc.golfchannel.com/api/v1/stopwatch/job/" +
          jobTypeId +
          "/" + 
          jobId +
          "/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken
      }).then(
        function successCallback(response) {
          $scope.getMyTimeCard(); // tp update changes made
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        })

    };

    $scope.stopAllMyJobs = function () {
      $http({
        method: "DELETE",
        url:
          "https://moc.golfchannel.com/api/v1/stopwatch/user/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken
      }).then(
        function successCallback(response) {
          $scope.getMyTimeCard();
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    $scope.getDashboard = function() {
      $http({
        method: "GET",
        url:
          "https://moc.golfchannel.com/api/v1/overview/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken +
          "&scope=global&itemized=1"
      }).then(
        function successCallback(response) {
          $scope.getResponseCounts = response.data["counts"];
          $scope.getResponseData = response.data["jobDetails"];
          if (response.data["counts"] !== 0) {
            $scope.updateDubCounts();
            $scope.updateRestCounts();
            $scope.updateIngCounts();
            $scope.updateArcCounts(); 
          }
          $scope.errorCount = 0;
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
    };

    // Captioning was developed after the site was initlay created
    // when this was made it was not integrated into the dashboard API
    // that is why it is a seperate call.
    $scope.getCaptions = function() {
      /*
      $http({
        method: "GET",
        url:
          "https://moc.golfchannel.com/api/v1/air/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken +
          "&verbose=true"
      }).then(
        function successCallback(response) {

          let pendingCount = 0;
          let processingCount = 0;
          let completeCount = 0;

          let pending = [];
          let processing = [];
          let complete = [];

          angular.forEach(response.data.air, function (selected) {
            if (selected.statusId == 1) {
              pending.push(selected);
              pendingCount++;
            } else if (selected.statusId == 2) {
              processing.push(selected);
              processingCount++;
            } else if (selected.statusId == 3) {
              complete.push(selected);j
              completeCount++;
            }

          });

          // Doing this to try to mimic the dashboard enpoint to make
          // the rest of the code the same for captions
          $scope.getResponseCapCounts =  {
            captionsPendingCount : pendingCount,
            captionsProcessingCount : processingCount,
            captionsCompleteCount : completeCount
          };

          // 
          $scope.getResponseCapData = {
            captionsPending : pending,
            captionsProcessing : processing,
            captionsComplete : complete
          };

          $scope.updateCaptions();
        },
        function errorCallback(response) {
          console.log(response);
          errors.httpError(response.status, $scope.errorCount++);
        }
      );
      */
    }

    $scope.interval = $interval(function() {
      if ($localStorage.authUser != null) {
        $scope.getDashboard();
        $scope.getCaptions();
        // $scope.getMyTimeCard();
      } else {
        $interval.cancel($scope.interval);
      }

      // console.log($scope.passToJobTimeCard.updateActiveClocks);
      if ($scope.passToJobTimeCard.updateActiveClocks == true) {
        $scope.getMyTimeCard();
        $scope.passToJobTimeCard.updateActiveClocks = false;
      }
      // TODO FIX this might cause issues if the dashboard is still getting get
      if (
        $scope.selected === "Restores" &&
        $scope.windowToShow === "job" &&
        $scope.selectedJob !== null
      ) {

        if ($scope[$scope.selected][$scope.selectedJobStatus]["data"][
            $scope.selectedJobId
          ]["lineItems"] !== null) {
            $scope.getSubRestData($scope.selectedJobId);
          }
      }
    }, 10000);

    $scope.$watch("passToJobTimeCard.updateActiveClocks", function () {
        $scope.getMyTimeCard();
        $scope.passToJobTimeCard.updateActiveClocks = false;
    });

    $scope.$on("$destroy", function() {
      $interval.cancel($scope.interval);
    });
  });
