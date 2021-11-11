// Duplication Request Controller
// Creator: Michael Burton, michael.burton3@icloud.com
// WHAT DO I DO?
// TODOS
"use strict";
angular
  .module("mediaServicesApp")
  .controller("ingestRequestCtrl", function (
    $scope,
    $http,
    errors,
    $state,
    $localStorage,
    valueTrans
  ) {
    // vAry's
    $scope.errorCount = 0;
    // Basic Info
    $scope.ingestTitle = null;
    $scope.avidPath = null;
    $scope.date = null;
    $scope.special = null;
    // Financial Reporting
    $scope.listOfDepartments = [];
    $scope.whoCharge = null;
    $scope.reasonForIngest = null;
    // Type and Quantity
    $scope.assestSource = null;
    $scope.listOfAssetSources = [];
    $scope.assetSource = null;
    // Content Protection
    $scope.noBug = null;
    $scope.noBugWhy = null;
    $scope.lineItemJSON = null;
    $scope.companies = [{
      mediaType: "",
      assetName: "",
      tcIn: "",
      tcOut: "",
      clipNum: "",
      log: ""
    }];
    // Functions
    $scope.addNew = function (companies) {
      var kitten = "";
      angular.forEach($scope.companies, function (selected) {
        if (kitten == "" && selected.mediaType != "") {
          kitten = selected.mediaType;
        }
      });
      $scope.companies.push({
        mediaType: "",
        assetName: "",
        tcIn: "",
        tcOut: "",
        clipNum: "",
        log: ""
      });
    };
    $scope.remove = function () {
      var newDataList = [];
      angular.forEach($scope.companies, function (selected) {
        if (!selected.selected) {
          newDataList.push(selected);
        }
      });
      $scope.companies = newDataList;
    };

    $scope.ingSubmit = function () {
      $http
        .post(
          "https://moc.golfchannel.com/api/v1/ingest/?authuser=" +
          $localStorage.authUser +
          "&authtoken=" +
          $localStorage.authToken, {
            title: $scope.ingestTitle,
            avidPath: $scope.avidPath,
            instructions: $scope.special,
            cameraModel: $scope.camType,
            colorSpace: $scope.lutType,
            clientName: $localStorage.authUser,
            requestNeed: $scope.reason4Ingest,
            timeNeeded: valueTrans.dubDate + " " + valueTrans.dubTime,
            lineItems: $scope.lineItemJSON
          }
        )
        .then(
          function successCallback(response) {
            $scope.success = response.success;
            $scope.action = response.action;
            swal("Your Request Was Added to the Our Queue!",
              "Please allow for a minimum of 24 hours for job completion. Any XDCAMs will be recycled two weeks after completion of the ingest.",
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

    $scope.makeJSON = function () {
      $scope.lineItemJSON = [];

      angular.forEach($scope.companies, function (selected) {
        var temp = {};
        temp["mediaType"] = selected.mediaType;
        temp["clipTitle"] = selected.assetName;
        temp["clipNumber"] = selected.clipNum;

        $scope.lineItemJSON.push(temp);
      });
      $scope.ingSubmit();
    };

    $scope.checkForm = function () {
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
      } else if (moment().format("YYYY-MM-DD") == moment(valueTrans.dubDate).format("YYYY-MM-DD") && moment().unix() > moment(valueTrans.dubTimeObj).unix()) {
        swal("Oops!", "Please enter a time not in the past", "error");
          $scope.assetTimeFlag = true;
          return;
      } else {
        $scope.assetTimeFlag = false;
      }

      $scope.flagType = false;
      $scope.flagName = false;
      $scope.flagNum = false;
      angular.forEach($scope.companies, function (selected) {
        if (selected.mediaType == "") {
          $scope.flagType = true;
          swal("Please Fill in all Media Types");
          return;
        }
        if (selected.assetName == "") {
          $scope.flagName = true;
          swal("Please Fill in all Asset Names");
          return;
        }

        if (isNaN(parseInt(selected.clipNum))) {
          $scope.flagNum = true;
          swal("Oops!", "Please enter an integer digit number for each clip number", "error");
          return;
        }
      });

      if ($scope.flagType || $scope.flagName || $scope.flagNum) {
        return;
      }

      if ($scope.ingestRequestForm.$invalid) {
        angular.forEach($scope.ingestRequestForm.$error, function (field) {
          angular.forEach(field, function (errorField) {
            errorField.$setDirty();
          });
        });
        return;
      }

      $scope.makeJSON();
    };

    $scope.submitForm = function () {
      $scope.checkForm();
    };
  });