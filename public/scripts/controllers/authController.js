'use strict';

angular.module('sampleApp').controller('authController', function ($scope, $http, $location){
	$scope.alertz = "Press me";

	$scope.login = function() {
		$http.post('/api/login', $scope.form)
		.success(function (res) {
			$scope.user = res.data;
		})
	}
});

