/*
    Author - Conor Hayes
*/

/* Create a new Angular Module */
var app = angular.module('directives', []);

/*
    Directive to tell the controller that the data has been loaded - used for loading spinner
    http://stackoverflow.com/questions/15207788/calling-a-function-when-ng-repeat-has-finished
*/
app.directive('itemsLoaded', function () {
    return function (scope, element, attrs) {
        if (scope.$last) {
            scope.$emit('repeatFinished');
        }
    };
});

/*
    Directive to show the average star rating of a given seller based on a cumulation of all their ratings
    http://g00glen00b.be/introduction-angularjs-directives/
*/
app.directive('sellerAvgRating', function () {
    return {
        restrict: 'E',
        scope: {
            reviews: '=reviews',
            max: '=max'
        },
        templateUrl: 'templates/seller-avg-rating.html',
        link: function (scope, elements, attr) {
            scope.totalRating = 0;
            scope.totalReviews = scope.reviews.length;
            scope.average = 0;
            scope.stars = [];
            angular.forEach(scope.reviews, function (value, key) {
                scope.totalRating += value.rating;
            });

            scope.average = Math.ceil(scope.totalRating / scope.totalReviews);

            scope.updateStars = function () {
                var i = 0;
                scope.stars = [];
                for (i = 0; i < scope.max; i += 1) {
                    scope.stars.push({
                        full: scope.average > i
                    });
                }
            };

            scope.starClass = function (star, i) {
                var starClass = 'glyphicon-star-empty';
                if (star.full || i <= scope.hoverIdx) {
                    starClass = 'glyphicon-star';
                }
                return starClass;
            };

            scope.$watch('reviews', function (newValue, oldValue) {
                if (newValue !== null && newValue !== undefined) {
                    scope.updateStars();
                }
            });
        }
    };
});

/*
    Directive to show the star rating of a given seller based on individual reviews
    http://g00glen00b.be/introduction-angularjs-directives/
*/
app.directive('sellerRating', function () {
    return {
        restrict: 'E',
        scope: {
            score: '=score',
            max: '=max'
        },
        templateUrl: 'templates/seller-rating.html',
        link: function (scope, elements, attr) {
            scope.updateStars = function () {
                var i = 0;
                scope.stars = [];
                for (i = 0; i < scope.max; i += 1) {
                    scope.stars.push({
                        full: scope.score > i
                    });
                }
            };

            scope.starClass = function (star, i) {
                var starClass = 'glyphicon-star-empty';
                if (star.full || i <= scope.hoverIdx) {
                    starClass = 'glyphicon-star';
                }
                return starClass;
            };

            scope.$watch('score', function (newValue, oldValue) {
                if (newValue !== null && newValue !== undefined) {
                    scope.updateStars();
                }
            });
        }
    };
});

/*
    A filter to set the first letter of the given input to uppercase
    Used in the specifications of an item as Firebase stores them as lowercase
*/
app.filter('capitalize', function () {
    return function (input, scope) {
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});

/* Directive for the extra navigation controls required for the auctions, search filter etc. */
app.directive('itemsNav', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/items-nav.html',
        controller: 'MainCtrl'
    };
});

/* Directive for the pagination controls uses on the auctions view */
app.directive('paginationControls', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/pagination-controls.html',
        controller: 'MainCtrl'
    };
});