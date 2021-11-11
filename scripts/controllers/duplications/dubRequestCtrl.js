"use strict";
angular
  .module("mediaServicesApp")
  .controller("dubRequestCtrl", function (
    $scope,
    $http,
    errors,
    $state,
    $localStorage,
    valueTrans,
    uibDateParser
  ) {
    // VAR's
    $scope.errorCount = 0;
    $scope.programID = null;
    $scope.assetName = null;
    $scope.dubTime = null;
    $scope.dubDate = null;
    $scope.specialInstructions = null;
    $scope.lableRequests = null;
    $scope.assestSource = null;
    $scope.listOfAssetSources = [];
    $scope.listOfDepartments = [];
    $scope.whoCharge = null;
    $scope.needForDub = null;
    $scope.noBug = false;
    $scope.noBugWhy = null;
    $scope.noBugWhyFlag = null;
    $scope.userSuppliedStock = false;
    $scope.assetSourceMFID = null;
    $scope.assetQuantityFlag = null;
    $scope.assetTimeFlag = null;
    $scope.assetDestination = [{
      assetSourceName: "",
      sourceID: "",
      quantity: ""
    }];
    $scope.assetDestinationPostStr = null;

    // Functions

    // Function for adding new rows to the asset duplication destination table
    $scope.addNew = function () {
      $scope.assetDestination.push({
        assetSourceName: "",
        sourceID: "",
        quantity: ""
      });
    };

    // Function for removing rows on the asset duplication destination table
    $scope.remove = function () {
      var newDataList = [];
      angular.forEach($scope.assetDestination, function (selected) {
        if (!selected.selected) {
          newDataList.push(selected);
        }
      });
      $scope.assetDestination = newDataList;
    };

    // The http post function called after the form is validated, it will post then send the user back
    // to their dashboard if it was a success.
    $scope.dubSubmit = function () {
      $http
        .post(
          "https://moc.golfchannel.com/api/v1/duplication/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken, {
            assetCode: $scope.programID,
            assetName: $scope.assetName,
            instructions: $scope.specialInstructions,
            label: $scope.lableRequests,
            watermark: !$scope.noBug,
            watermarkNote: $scope.noBugWhy,
            sourceMediaFormatId: $scope.assetSourceMFID["mf_id"],
            destinationMedia: $scope.assetDestinationPostStr,
            userSuppliedStock: $scope.userSuppliedStock,
            clientName: $localStorage.authUser,
            requestNeed: $scope.needForDub,
            timeNeeded: valueTrans.dubDate + " " + valueTrans.dubTime
          }
        )
        .then(
          function successCallback(response) {
            $scope.success = response.success;
            $scope.action = response.action;
            swal("Your Request Was Added to the Our Queue!",
              "Please allow for a minimum of 24 hours for job completion.",
              "success");
            $state.go(valueTrans.myDashboard);
            $scope.errorCount = 0;
          },
          function errorCallback(response) {
            console.log(response);
            errors.httpError(response.status, $scope.errorCount++);
          }
        );
    };

    // The on click function used for form validation of the duplication request
    $scope.submitForm = function () {

      // Make sure the text entered in teh quantity fields are diget numbers
      angular.forEach($scope.assetDestination, function (selected) {

        if (isNaN(parseInt(selected.quantity))) {
          swal(
            "Oops!",
            "Please enter an integer digit number for each quality box",
            "error"
          );
          $scope.assetQuantityFlag = true;
        } else {
          $scope.assetQuantityFlag = false;
        }
      });
      // used to break out of the function because the one above is not able to
      if ($scope.assetQuantityFlag) {
        return;
      }


      // Basic form validation check.
      if ($scope.createDubRequest.$invalid) {
        angular.forEach($scope.createDubRequest.$error, function (field) {
          angular.forEach(field, function (errorField) {
            errorField.$setDirty();
          });
        });
        swal(
          "Oops!",
          "Please fill out all required fields before submitting",
          "error"
        );
        return;
      }

      if ($scope.noBug == true) {
        if ($scope.noBugWhy == null || $scope.noBugWhy == "") {
          $scope.noBugWhyFlag = true;
          swal(
            "Oops",
            "Please provide a reason for not using content protection.",
            "error"
          );
          return;
        } else {
          $scope.noBugWhyFlag = false;
        }
      }



      // Making sure the time needed is not in the past.
      var now = new Date();
      var hour = valueTrans.dubTimeObj.getHours();
      var min = valueTrans.dubTimeObj.getMinutes();
      if (hour < 0 || hour > 24) {
        swal("Oops!", "Please enter a valid time needed", "error");
        $scope.assetTimeFlag = true;
        return;
      } else if (min < 0 || min > 59) {
        swal("Oops!", "Please enter a valid time needed", "error");
        $scope.assetTimeFlag = true;
        return;
      } else if (moment().format("YYYY-MM-DD") == moment(valueTrans.dubDate).format("YYYY-MM-DD") &&
      moment().unix() > moment(valueTrans.dubTimeObj).unix()) {
        swal("Oops!", "Please enter a time not in the past", "error");
        $scope.assetTimeFlag = true;
        return;
      } else {
        $scope.assetTimeFlag = false;
      }

      // Populating the asset destination JSON needed for the http post.
      $scope.assetDestinationPostStr = {};
      angular.forEach($scope.assetDestination, function (selected) {
        $scope.assetDestinationPostStr[selected.assetDestination["mf_id"]] =
          selected.quantity;
      });

      // Time to post
      $scope.dubSubmit();
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
        /** @namespace response.data.mediaFormats */
        $scope.listOfAssetSources = response.data.mediaFormats;
      },
      function errorCallback(response) {
        console.log(response);
        errors.httpError(response.status, $scope.errorCount++);
      }
    );
  });