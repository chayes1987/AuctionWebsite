var app = angular.module('AuctionApp', [
    'ngRoute',
    'ngAnimate',
    'firebase',
    'ui.bootstrap',
]);

app.config(function ($routeProvider) {
    $routeProvider
    .when('/home',
    {
        templateUrl: '/views/home.html',
        controller: 'MainCtrl'
    })
    .otherwise({ redirectTo: '/home' });
});

app.controller('MainCtrl', ['$scope', '$location', '$routeParams', function ($scope, $location, $routeParams) {
    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) >= 0;
    };
}]);