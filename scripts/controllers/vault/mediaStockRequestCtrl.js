// Duplication Request Controller
// Creator: Michael Burton, michael.burton3@icloud.com
// WHAT DO I DO?
// TODOS
'use strict';
angular.module('mediaServicesApp')
	.controller('mediaStockRequestCtrl', function ($scope, $http, $state, $localStorage, errors) {
	// Var's
	$scope.currentPath = "super/duper/secret.txt";
	$scope.listOfAssetSources;
	
	
	$scope.companies = [
		{
			'assetDestination': "",
			'quantity': ""
		}
	];
	
	// Fun's

	$scope.addNew = function (companies) {
		$scope.companies.push({
			'assetDestination': "",
			'quantity': ""
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
	
	$scope.submitForm = function () {
		var flagAss = 0;
		var flagQuant = 0;
		if ($scope.createStockRequestForm.$invalid) {
			angular.forEach($scope.createStockRequestForm.$error, function (field) {
				angular.forEach(field, function (errorField) {
					errorField.$setDirty();
				});
			});
			swal("Missing Information", "Check fields marked red", "error");
			return;
		};
		angular.forEach($scope.companies, function (selected) {
			if (selected.assetDestination == "") {
				flagAss = 1;
			};
			if (selected.quantity == "") {
				flagQuant = 1;
			};
			if (flagAss == 1) {
				swal("Missing Information", "Please Make Sure all Media Types Are Selected", "error");
				return;
			};
			if (flagQuant == 1) {
				swal("Missing Information", "Please Make Sure all Quantity's Are Specified", "error");
				return;
			};
			swal("Requested!", "I see you have constructed a new request. Your skills are complete. Indeed you are powerful as the Emperor has foreseen.", "success");
			$state.go('dashboard.home');
		});
	};
	
	
	
	
	$http({
		method: 'GET',
		url: 'https://moc.golfchannel.com/api/v1/system/codex/media/?authuser=' + $localStorage.authUser + '&authtoken=' + $localStorage.authToken,
	}).success(function (response) {
		$scope.listOfAssetSources = response.mediaFormats;
	}).error(function (response) {
    console.log(response);
    errors.httpError(response.status, $scope.errorCount++);
	});
	
})