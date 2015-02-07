var app = angular.module('AuctionApp', [
    'ngRoute',
    'ngAnimate',
    'firebase',
    'ui.bootstrap',
]);

app.controller('MainCtrl', ['$scope', '$location', '$routeParams', 'FireBaseService', '$rootScope', function ($scope, $location, $routeParams, FireBaseService, $rootScope) {
    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) >= 0;
    };
}]);