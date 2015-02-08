var app = angular.module('AuctionApp', [
    'directives',
    'ngRoute',
    'ngAnimate',
    'firebase',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
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
    .when('/auctionlist',
    {
        templateUrl: '/views/auctions-list.html',
        controller: 'MainCtrl'
    })
    .when('/auctioncard',
    {
        templateUrl: '/views/auctions-card.html',
        controller: 'MainCtrl'
    })
    .when('/auction',
    {
        templateUrl: 'views/auction.html',
        controller: 'AuctionCtrl'
    })
    .otherwise({ redirectTo: '/home' });
});

app.factory('FireBaseService', ['$firebase', 'FIREBASE_DB', function ($firebase, FIREBASE_DB) {
    var factory = {};
    factory.items = $firebase(new Firebase(FIREBASE_DB + "items"));
    factory.auctions = $firebase(new Firebase(FIREBASE_DB + "auctions/1"));
    factory.categories = $firebase(new Firebase(FIREBASE_DB + "categories"));
    factory.auctions = $firebase(new Firebase(FIREBASE_DB + "auctions/1"));

    return factory;
}]);

app.controller('MainCtrl', ['$scope', '$location', '$routeParams', 'FireBaseService', '$rootScope', function ($scope, $location, $routeParams, FireBaseService, $rootScope) {
    $scope.items = FireBaseService.items;
    $scope.categories = FireBaseService.categories;
    $scope.loading = true;

    $scope.currentPage = 1;
    $scope.pageSize = 10;

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

app.controller('AuctionCtrl', ['$scope', '$location', '$http', 'FireBaseService', '$rootScope', function ($scope, $location, $http, FireBaseService, $rootScope) {
    $scope.auction = FireBaseService.auctions;

    $scope.placeBid = function () {
        $http.get('http://127.0.0.1:8080/placebidservice/web/services/placebid/1/' + $rootScope.user.email).
            success(function () {
                alert("Bid has been placed!");
            }).error(function () {
                alert("Server not available");
            });
    }
}]);