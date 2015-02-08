﻿var app = angular.module('AuctionApp', [
    'directives',
    'ngRoute',
    'ngAnimate',
    'firebase',
    'ui.bootstrap',
]);

app.constant('FIREBASE_DB', 'https://auctionapp.firebaseio.com/');

app.config(function ($routeProvider) {
    $routeProvider
    .when('/home',
    {
        templateUrl: '/views/home.html',
        controller: 'MainCtrl'
    })
    .when('/item/:itemId',
    {
        templateUrl: '/views/item.html',
        controller: 'MainCtrl'
    })
    .when('/login',
    {
        templateUrl: '/views/login.html',
        controller: 'LoginCtrl'
    })
    .when('/logout',
    {
        template: '<h2>Logging Off...</h2>',
        controller: 'LogoutCtrl'
    })
    .otherwise({ redirectTo: '/home' });
});

app.factory('FireBaseService', ['$firebase', 'FIREBASE_DB', function ($firebase, FIREBASE_DB) {
    var factory = {};
    factory.items = $firebase(new Firebase(FIREBASE_DB + "items"));
    factory.auctions = $firebase(new Firebase(FIREBASE_DB + "auctions/1"));
    return factory;
}]);

app.controller('MainCtrl', ['$scope', '$location', '$routeParams', 'FireBaseService', '$rootScope', function ($scope, $location, $routeParams, FireBaseService, $rootScope) {
    $scope.items = FireBaseService.items;
    $scope.loading = true;

    $scope.$on('repeatFinished', function (ngRepeatFinishedEvent) {
        $scope.loading = false;
    });

    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) >= 0;
    };

    if ($routeParams.itemId != null) {
        $scope.item = {};
        angular.forEach($scope.items, function (value, index) {
            if (value.$id == $routeParams.itemId) {
                $scope.item = value;
            }
        });
    };
}]);

app.controller('LoginCtrl', ['$scope', '$firebaseSimpleLogin', 'FIREBASE_DB', '$rootScope', function ($scope, $firebaseSimpleLogin, FIREBASE_DB, $rootScope) {
    $scope.errors = [];
    // Login
    $scope.login = function () {
        $scope.errors = [];

        if ($scope.userEmail === undefined) {
            $scope.errors.push('Enter Your Email');
            return;
        };

        if ($scope.userPassword === undefined) {
            $scope.errors.push('Enter Your Password');
            return;
        };

        if ($scope.errors.length > 0) {
            return;
        };

        // Login
        $firebaseSimpleLogin(new Firebase(FIREBASE_DB)).$login('password', {
            email: $scope.userEmail,
            password: $scope.userPassword,
            rememberMe: $scope.rememberMe
        }).then(function (user) {
            // Success
            $rootScope.user = user;
            window.location.href = '#home';
        }, function (error) {
            // Check Error Code
            if (error.code === 'INVALID_USER') {
                $scope.errors.push('The Email is invalid');
                return;
            };
            if (error.code === 'INVALID_PASSWORD') {
                $scope.errors.push('The Password is invalid');
                return;
            };
        });
    };
}]);

app.controller('LogoutCtrl', ['$firebaseSimpleLogin', 'FIREBASE_DB', '$rootScope', function ($firebaseSimpleLogin, FIREBASE_DB, $rootScope) {
    $firebaseSimpleLogin(new Firebase(FIREBASE_DB)).$logout();
    $rootScope.user = undefined;
    window.location.href = '#home';
}]);