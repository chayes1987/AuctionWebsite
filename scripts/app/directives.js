// Ratings -> http://g00glen00b.be/introduction-angularjs-directives/

var app = angular.module('directives', []);

app.directive('itemsLoaded', function () {
    return function (scope, element, attrs) {
        if (scope.$last) {
            scope.$emit('repeatFinished');
        }
    };
});

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

app.filter('capitalize', function () {
    return function (input, scope) {
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});

app.directive('itemsNav', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/items-nav.html',
        controller: 'MainCtrl'
    };
});

app.directive('paginationControls', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/pagination-controls.html',
        controller: 'MainCtrl'
    };
});