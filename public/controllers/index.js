(function() {
	mrmFE.controller('IndexController', ['$scope', '$http', function($scope, $http) {

	}]);

	mrmFE.controller('LatestController', ['$scope', '$http', function($scope, $http) {
		$scope.latestImages = [];
		$http.jsonp('http://localhost:3000/api/latest?callback=JSON_CALLBACK')
			.success(function(data) {
				for (var k in data) $scope.latestImages.push(data[k]);
				//$scope.digest();
			});
	}]);

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
})();