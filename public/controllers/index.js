'use strict';

var socket = io.connect('http://localhost:3000');

angular
	.module('mrmFE', [])
	.controller('IndexController', ['$scope', '$http', function($scope, $http) {
		$http.jsonp('http://localhost:3000/api/stats?callback=JSON_CALLBACK')
			.success(function(data) {
				$scope.totalImages = data.totals.media.full + data.totals.media.thumbnail;
			});

		socket.on('stats', function(data) {
			$scope.totalImages = data.totals.media.full + data.totals.media.thumbnail;
			$scope.$digest();
		});
	}]);