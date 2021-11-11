// Duplication Request Controller
// Creator: Michael Burton, michael.burton3@icloud.com
// WHAT DO I DO?
// TODOS
'use strict';
angular.module('mediaServicesApp')
	.controller('mediaRetrievalRequestCtrl', function ($scope, $http, $state, $localStorage) {
	//Var's
	
	
	//Fun's
	$scope.submitForm = function () {
		if ($scope.mediaRetrievalRequestForm.$invalid) {
			angular.forEach($scope.mediaRetrievalRequestForm.$error, function (field) {
				angular.forEach(field, function (errorField) {
					errorField.$setDirty();
				});
			});
			swal("Missing Information", "Check fields marked red", "error");
			return;
		};
		swal("As You Wish", " You've done well. And now I sense you wish to continue your search for young Skywalker. ", "success");
		$state.go('dashboard.home');
		return;
	};
});