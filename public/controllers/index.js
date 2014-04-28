(function() {
	mrmFE.controller('IndexController', ['$scope', '$http', function($scope, $http) {

	}]);

	mrmFE.controller('LatestController', ['$scope', '$http', function($scope, $http) {
		$scope.latestImages = [];
		$http.jsonp('http://mars-rover-media-api.nodejitsu.com/v1/latest?callback=JSON_CALLBACK')
			.success(function(data) {
				$scope.featuredImage;
				for (var k in data) {
					var item = data[k];

					item.properties.filesize = Math.round(item.properties.filesize / 1024)

					if (!$scope.featuredImage && item.type === 'full' && item.properties.width > 500) $scope.featuredImage = item;
					
					// If Hazcam image exists use that for featured image
					if ($scope.featuredImage && $scope.featuredImage.camera.clean.indexOf('Hazcam') === -1 && item.camera.clean.indexOf('Hazcam') !== -1 && item.properties.width > 500) $scope.featuredImage = item;

					if (item.url.web && item.properties.width > 500) $scope.latestImages.push(data[k]);
				}
				$scope.changeFeaturedImage = function(camera) {
					for (var k in data) if (data[k].camera.clean === camera) $scope.featuredImage = data[k];
				}
			});

	}]);

	var pad = function(num) {
		var s = num + ''
			, origLength = s.length;
	    while (s.length < ((4 + origLength) - origLength)) s = '0' + s;
	    return s;
	}

	var getReq = function(scope) {
		var req = 'http://mars-rover-media-api.nodejitsu.com/v1/';
		if (!scope.selectedRequest) return;
		if (scope.selectedRequest.name === 'sols/') {
			req += scope.selectedRequest.name + '?gte=' + pad(scope.sols.solsLow) + '&lte=' + pad(scope.sols.solsHigh);
			if (scope.selectedCamera) {
				req += '&camera=' + scope.selectedCamera;
			}
		} else {
			req += scope.selectedRequest.name;
		}
		return req;
	}

	mrmFE
		.controller('ExploreController', ['$scope', '$http', function($scope, $http) {

			$scope.requestTypes = [
				{ name: 'sols/' }
				, { name: 'stats/' }
				, { name: 'latest/' }
			];

			$scope.cameraTypes = [];
			$scope.selectedRequest;
			$scope.selectedCamera;

			$http.jsonp('http://mars-rover-media-api.nodejitsu.com/v1/stats?callback=JSON_CALLBACK')
				.success(function(data) {
					for (var k in data.totals.cameras) $scope.cameraTypes.push(k);
				});

			$scope.$watch('selectedRequest', function(newVal) {
				if (newVal && newVal.name === 'sols/') {
					$scope.sols = {
						solsLow: 0
						, solsHigh: 615
						, minTemp: 0
						, maxTemp: 0
						, pressure: 0
					}
				}
				$scope.apiReq = getReq($scope);
			});

			$scope.$watch('selectedCamera', function(newVal) {
				$scope.apiReq = getReq($scope);
			});

			$scope.$watch('sols.solsLow', function() {
				if ($scope.selectedRequest && $scope.selectedRequest.name === 'sols/') $scope.apiReq = getReq($scope);
			});

			$scope.$watch('sols.solsHigh', function() {
				if ($scope.selectedRequest && $scope.selectedRequest.name === 'sols/') $scope.apiReq = getReq($scope);
			});

			$scope.$watch('props.width', function() {
				if ($scope.selectedRequest && $scope.selectedRequest.name === 'sols/') $scope.apiReq = getReq($scope);
			});

			$scope.apiReq = '';
			$scope.apiRes = '';

			$scope.runAPIRequest = function() {
				var req = getReq($scope);

				if (req.indexOf('?') === -1) req += '?';
				
				$http.jsonp(req + '&callback=JSON_CALLBACK')
					.success(function(data) {
						$scope.apiRes = JSON.stringify(data, undefined, 2);
					});
			}
		}]);

	mrmFE.controller('ChartController', ['$scope', '$http', function($scope, $http) {
		$http.jsonp('http://mars-rover-media-api.nodejitsu.com/v1/stats?callback=JSON_CALLBACK')
			.success(function(data) {

					var cols = [];

					for (var k in data.totals.cameras) cols.push([k, data.totals.cameras[k]]);

					c3.generate({
						data: {
							columns: cols
							, type: 'bar'
						}
						, bar: {
							width: {
								ratio: 0.5
							}
						}
					});

			});
	}]);

})();