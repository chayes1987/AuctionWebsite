/*
    Author - Conor Hayes
*/

/* Create a new Angular Module and inject required dependencies */
var app = angular.module('AuctionApp', [
    'directives',
    'ngRoute',
    'ngAnimate',
    'firebase',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
]);

/* Contants for Firebase root URL and RESTful Web Service address */
app.constant('FIREBASE_DB', 'https://auctionapp.firebaseio.com/');
app.constant('WEB_SERVICE_URL', 'http://54.171.120.118:8080/placebidservice/bidder/services/placebid/');

/* RouteProvider - used to route the views */
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

/* Factory - used to retrieve the data from Firebase */
app.factory('FireBaseService', ['$firebase', 'FIREBASE_DB', function ($firebase, FIREBASE_DB) {
    var factory = {};
    factory.items = $firebase(new Firebase(FIREBASE_DB + "items"));
    factory.auctions = $firebase(new Firebase(FIREBASE_DB + "auctions"));
    factory.categories = $firebase(new Firebase(FIREBASE_DB + "categories"));
    factory.dashboard = $firebase(new Firebase(FIREBASE_DB + "dashboard"));

    return factory;
}]);

/* Main Controller - handles functionality with this controllers scope */
app.controller('MainCtrl', ['$scope', '$location', '$routeParams', 'FireBaseService', '$rootScope', function ($scope, $location, $routeParams, FireBaseService, $rootScope) {
    /* Get the data from the factory */
    $scope.items = FireBaseService.items;
    $scope.categories = FireBaseService.categories;
    /* Initialize variables for spinner and pagination */
    $scope.loading = true;
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    /* Hides the spinner once the data has been loaded */
    $scope.$on('repeatFinished', function (ngRepeatFinishedEvent) {
        $scope.loading = false;
    });

    /* Checks to see which view is active */
    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) >= 0;
    };

    /* Sets the current auction item based on ID */
    if ($routeParams.itemId != null) {
        $scope.item = {};
        angular.forEach($scope.items, function (value, index) {
            if (value.$id == $routeParams.itemId) {
                $scope.item = value;
            }
        });
    };
}]);

/* Login Controller - handles login functionality, used Firebase SimpleLogin */
app.controller('LoginCtrl', ['$scope', '$firebaseSimpleLogin', 'FIREBASE_DB', '$rootScope', function ($scope, $firebaseSimpleLogin, FIREBASE_DB, $rootScope) {
    $scope.errors = [];
    /* Login function */
    $scope.login = function () {
        $scope.errors = [];
        /* Inout validation */
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

        /* Perform login to Firebase */
        $firebaseSimpleLogin(new Firebase(FIREBASE_DB)).$login('password', {
            /* Get field values */
            email: $scope.userEmail,
            password: $scope.userPassword,
            rememberMe: $scope.rememberMe
        }).then(function (user) {
            /* Success */
            $rootScope.user = user;
            /* Check whether admin or user and set view accordingly */
            if ($rootScope.user.email == 'admin@auctions.ie') {
                window.location.href = '#dashboard';
            } else {
                window.location.href = '#auctions';
            }
        }, function (error) {
            /* Failed - Check error code and supply message accordingly */
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

/* Logout Controller - handles logout functionality, uses Firebase SimpleLogin */
app.controller('LogoutCtrl', ['$firebaseSimpleLogin', 'FIREBASE_DB', '$rootScope', function ($firebaseSimpleLogin, FIREBASE_DB, $rootScope) {
    $firebaseSimpleLogin(new Firebase(FIREBASE_DB)).$logout();
    /* Clear user variable and reset the view to home */
    $rootScope.user = undefined;
    window.location.href = '#home';
}]);

/* Auction Controller - handles auction functionality */
app.controller('AuctionCtrl', ['$scope', '$routeParams', '$http', 'FireBaseService', 'FIREBASE_DB', '$firebase', 'WEB_SERVICE_URL', '$rootScope', function ($scope, $routeParams, $http, FireBaseService, FIREBASE_DB, $firebase, WEB_SERVICE_URL, $rootScope) {
    /* Get the data from the factory */
    $scope.auctions = FireBaseService.auctions;
    $scope.dashboard = FireBaseService.dashboard;

    /* Place Bid Function - called to place a bid */
    $scope.placeBid = function () {
        /* Send HTTP GET to the RESTful Web Service and show the response in a message */
        $http.get(WEB_SERVICE_URL + $scope.auction._id + '/' + $rootScope.user.email).
            success(function () {
                alert("Your bid has been placed!");
            }).error(function () {
                alert("Unable to connect to Server...");
            });
    }
    /* Set the current auction based on the ID */
    if ($routeParams.auctionid != null) {
        $scope.auction = $firebase(new Firebase(FIREBASE_DB + "auctions/" + $routeParams.auctionid));
    };
}]);