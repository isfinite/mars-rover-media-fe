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
						, minTempLow: 0
						, minTempHigh: 100
						, maxTempLow: 0
						, maxTempHigh: 100
						, pressureLow: 0
						, pressureHigh: 100
					}
				}
			});

			$scope.apiReq = 'http://localhost:3000/v1/';
			$scope.apiRes = '';

			$scope.runAPIRequest = function() {
				$http.jsonp($scope.apiReq + $scope.selectedRequest.name + '?callback=JSON_CALLBACK')
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

	/*
	mrmFE.controller('ChartController', ['$scope', '$http', function($scope, $http) {
		$http.jsonp('http://localhost:3000/api/sols?callback=JSON_CALLBACK')
			.success(function(data) {
				var cData = []
					, results = data.slice(0)
					, _xs = {}
					, obj = {};





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
			});
	}]);
	*/
})();