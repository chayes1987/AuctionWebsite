var app = angular.module('AuctionApp', [
    'directives',
    'ngRoute',
    'ngAnimate',
    'firebase',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
]);

app.constant('FIREBASE_DB', 'https://auctionapp.firebaseio.com/');
app.constant('WEB_SERVICE_URL', 'http://54.171.120.118:8080/placebidservice/bidder/services/placebid/');

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
    .when('/itemslist',
    {
        templateUrl: '/views/items-list.html',
        controller: 'MainCtrl'
    })
    .when('/itemscard',
    {
        templateUrl: '/views/items-card.html',
        controller: 'MainCtrl'
    })
    .when('/auctions',
    {
        templateUrl: '/views/auctions.html',
        controller: 'AuctionCtrl'
    })
    .when('/auction/:auctionid',
    {
        templateUrl: '/views/auction.html',
        controller: 'AuctionCtrl'
    })
    .when('/dashboard',
    {
        templateUrl: '/views/dashboard.html',
        controller: 'AuctionCtrl'
    })
    .when('/log/:auctionid',
    {
        templateUrl: '/views/log.html',
        controller: 'AuctionCtrl'
    })
    .otherwise({ redirectTo: '/home' });
});

app.factory('FireBaseService', ['$firebase', 'FIREBASE_DB', function ($firebase, FIREBASE_DB) {
    var factory = {};
    factory.items = $firebase(new Firebase(FIREBASE_DB + "items"));
    factory.auctions = $firebase(new Firebase(FIREBASE_DB + "auctions"));
    factory.categories = $firebase(new Firebase(FIREBASE_DB + "categories"));

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

            if ($rootScope.user.email == 'admin@auctions.ie') {
                window.location.href = '#dashboard';
            } else {
                window.location.href = '#auctions';
            }
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

app.controller('AuctionCtrl', ['$scope', '$routeParams', '$http', 'FireBaseService', 'FIREBASE_DB', '$firebase', 'WEB_SERVICE_URL', '$rootScope', function ($scope, $routeParams, $http, FireBaseService, FIREBASE_DB, $firebase, WEB_SERVICE_URL, $rootScope) {
    $scope.auctions = FireBaseService.auctions;

    $scope.placeBid = function () {
        $http.get(WEB_SERVICE_URL + $scope.auction._id + '/' + $rootScope.user.email).
            success(function () {
                alert("Bid has been placed!");
            }).error(function () {
                alert("Server not available");
            });
    }

    if ($routeParams.auctionid != null) {
        $scope.auction = $firebase(new Firebase(FIREBASE_DB + "auctions/" + $routeParams.auctionid));
    };
}]);