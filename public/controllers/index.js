(function() {
	mrmFE.controller('IndexController', ['$scope', '$http', function($scope, $http) {

	}]);

	mrmFE.controller('LatestController', ['$scope', '$http', function($scope, $http) {
		$scope.latestImages = [];
		$http.jsonp('http://localhost:3000/v1/latest?callback=JSON_CALLBACK')
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
		var req = 'http://localhost:3000/v1/';
		if (!scope.selectedRequest) return;
		if (scope.selectedRequest.name === 'sols/') {
			req += scope.selectedRequest.name + '?gte=' + pad(scope.sols.solsLow) + '&lte=' + pad(scope.sols.solsHigh);
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

			$scope.selectedRequest;

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

			$scope.$watch('sols.solsLow', function() {
				if ($scope.selectedRequest && $scope.selectedRequest.name === 'sols/') $scope.apiReq = getReq($scope);
			});

			$scope.$watch('sols.solsHigh', function() {
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
		}])
		.directive('selectRequest', function() {
			return {
				link: function(scope, element, attrs) {
					element.bind('change', function () {
						//
					});
				}
			}
		});

	mrmFE.controller('ChartController', ['$scope', '$http', function($scope, $http) {
		$http.jsonp('http://localhost:3000/v1/stats?callback=JSON_CALLBACK')
			.success(function(data) {

					var cols = [];

					for (var k in data.totals.cameras) {
						cols.push([k, data.totals.cameras[k]]);
					}

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


					console.log(data);

					/*

				do {
					var item = results.shift()
						, res = [item.sol];

					for (var k in item.results.cameras) {
						if (!_xs[k]) _xs[k] = k + '_x';
						if (!obj[k]) obj[k] = [k];
						obj[k].push(item.results.cameras[k]);
					}
				} while (results.length > 0);

				console.log(obj);

				c3.generate({
					data: {
						xs: _xs
						, columns: [
							['cam1', 0, 1, 3, 10, 5, 2]
							, ['cam2', 4, 3, 2, 11, 2, 3]
							, ['cam3', 3, 6, 3, 6, 7, 0]
						]
						, type: 'scatter'
					}
				});
*/
			});
	}]);

})();