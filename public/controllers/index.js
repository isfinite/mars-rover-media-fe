'use strict';

angular
	.module('mrmFE', [])
	.controller('IndexController', ['$scope', '$http', function($scope, $http) {
		$http.jsonp('http://localhost:3000/api/stats?callback=JSON_CALLBACK')
			.success(function(data) {
				$scope.totalImages = data.totalImages;
			});

		$scope.greet = 'test';
	}]);