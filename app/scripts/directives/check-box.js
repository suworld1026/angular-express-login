'use strict';

angular.module('wsui')

.directive('checkBox', function () {
    return {
        restrict: 'E',
        scope: {
            onAfterCheck: '&onAfterCheck',
            opt: '='
        },
        //transclude: true,
        templateUrl: '/scripts/directives/check-box.html',
        link: function (scope, element, attrs) {

            var $container = $(element).find('.z-check-box');

            $container.find('i.fa-check-square-o').click(function () {
                if(scope.opt.bEnable)
                    scope.toggle();
            });

            $container.find('i.fa-square-o').click(function () {
                if (scope.opt.bEnable)
                    scope.toggle();
            });

            scope.toggle = function () {
                scope.opt.bCheck = !scope.opt.bCheck;
                if (scope.onAfterCheck)
                    scope.onAfterCheck({ 'bChecked': scope.opt.bCheck });

                setTimeout(function () {
                    scope.$apply();
                }, 0);
            }

            scope.$watch("opt.bEnable", function (newVal, oldVal) {
                //scope.opt.bEnable = newVal;
            });

            scope.$watch("opt.bCheck", function (newVal, oldVal) {
                if (scope.onAfterCheck)
                    scope.onAfterCheck({ 'bChecked': newVal });
            });

        }// end of link
    }
})
