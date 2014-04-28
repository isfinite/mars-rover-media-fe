(function() {

	var socket = io.connect('http://localhost:3000');

	mrmFE.controller('HeadController', ['$scope', function($scope) {
		$scope.socket_status = '';
		$scope.socket_status_class = 'loading';

		socket
			.on('connecting', function() {
				$scope.socket_status = 'Connecting';
				$scope.socket_status_class = 'loading';
				$scope.$digest();
			})
			.on('reconnecting', function() {
				$scope.socket_status = 'Reconnecting';
				$scope.socket_status_class = 'loading';
				$scope.total_images = '';
				$scope.$digest();
			})
			.on('stats', function(data) {
				$scope.total_images = (data.totals.media.full + data.totals.media.thumbnail + ' images indexed').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				$scope.socket_status = '';
				$scope.socket_status_class = 'checkmark';
				$scope.$digest();
			});
	}]);

})();