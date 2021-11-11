"use strict";
angular
  .module("mediaServicesApp")
  .controller("archiveRequestCtrl", function (
    $scope,
    $state,
    $localStorage,
    valueTrans,
    $http,
    errors
  ) {
    $scope.errorCount = 0;
    $scope.date = new Date();
    $scope.usersName = $localStorage.authUser;
    $scope.programTitle = null;
    $scope.programId = null;
    $scope.additionalNotes = null;
    $scope.currentISIS = "GCBN://";
    $scope.programPath = null;
    $scope.allAssetsFlag = null;
    $scope.specificAsset = [];
    $scope.specificAssetFlag = null;
    $scope.specificAssetPostStr = null;

    // Function for adding new rows to the asset duplication destination table
    $scope.addNew = function () {
      if ($scope.specificAsset == null) {
        $scope.specificAsset = [];
      }
      $scope.specificAsset.push({
        asset: ""
      });
    };

    // Function for removing rows on the asset duplication destination table
    $scope.remove = function () {
      var newDataList = [];
      angular.forEach($scope.specificAsset, function (selected) {
        if (!selected.selected) {
          newDataList.push(selected);
        }
      });
      $scope.specificAsset = newDataList;
    };

    // Clears Assets array when All assets in folder is selected
    $scope.clearAssets = function () {
      $scope.specificAsset = null;
    };

    // Form Validation , if Passed then calls formatSubmit
    $scope.submitForm = function () {
      if ($scope.archiveRequestForm.$invalid) {
        angular.forEach($scope.archiveRequestForm.$error, function (field) {
          angular.forEach(field, function (errorField) {
            errorField.$setDirty();
          });
        });
        swal("Missing Information", "Check fields marked red", "error");
        var exitFlag = true;
      }
      if ($scope.specificAsset != null) {
        angular.forEach($scope.specificAsset, function (selected) {
          if (typeof selected.asset == "undefined") {
            swal("Oops!", "Please enter an asset for each asset box", "error");
            $scope.specificAssetFlag = true;
          } else if (selected.asset == null || selected.asset == "") {
            swal("Oops!", "Please enter an asset for each asset box", "error");
            $scope.specificAssetFlag = true;
          } else {
            $scope.specificAssetFlag = false;
          }
        });

        if ($scope.specificAssetFlag == true || exitFlag == true) {
          return;
        }
      }
      $scope.formatSubmit();
    };

    // Format the JSON
    $scope.formatSubmit = function () {
      if ($scope.specificAsset != null) {
        $scope.specificAssetPostString = [];
        angular.forEach($scope.specificAsset, function (selected) {
          $scope.specificAssetPostString.push(selected.asset);
        });
      } else {
        $scope.specificAssetPostString = -1;
      }
      $scope.submitJSON = {
        assetCode: $scope.programId,
        assetName: $scope.programTitle,
        instructions: $scope.additionalNotes,
        avidPath: $scope.currentISIS + $scope.programPath,
        specificAssets: $scope.specificAssetPostString,
        digitalSignature: $localStorage.authUser,
        projectId: null,
        customProjectNote: null,
        timeNeeded: null
      };

      swal({
          title: "Are you sure?",
          text: "By checking this box, I --" +
            $localStorage.authUser +
            "-- have verified all selected content and locations are in the desired final state to be archived as of \n\n" +
            $scope.date,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, archive it",
          cancelButtonText: "No, cancel!",
          closeOnConfirm: false,
          closeOnCancel: false
        },
        function (isConfirm) {
          if (isConfirm) {
            $scope.arcSubmit();
          } else {
            swal(
              "Cancelled",
              "Thank you for double checking before submitting",
              "error"
            );
          }
        }
      );
    };

    // Will do the http Post to the back end
    $scope.arcSubmit = function () {
      $http
        .post(
          "https://moc.golfchannel.com/api/v1/archive/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken,
          $scope.submitJSON
        )
        .then(
          function successCallback(response) {
            $scope.success = response.success;
            $scope.action = response.action;
            swal(
              "Your Request Was Added to the Our Queue!",
              "Please allow for a minimum of 24 hours for job completion.",
              "success"
            );
            $state.go(valueTrans.myDashboard);
            $scope.errorCount = 0;
          },
          function errorCallback(response) {
            console.log(response);
            errors.httpError(response.status, $scope.errorCount++);
          }
        );
    };
  });