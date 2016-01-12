'use strict';

angular.module('wsui')

.directive('passwordInput', function () {

    var DEFAULT_DISPLAYED_PASSWORD = '00000000';
    return {
        restrict: 'E',
        scope: {
            opt: '=',
            onChange:'&'
        },
        //transclude: true,
        templateUrl: '/Scripts/ila/directives/password-input.html',
        link: function (scope, element, attrs) {

            var $input = $(element).find('.z-password');

            scope.onFocus = function (e) {
                if (scope.opt.text == DEFAULT_DISPLAYED_PASSWORD) {
                    scope.opt.text = '';
                }
            }

            scope.onBlur = function (e) {
                if (scope.opt.text == '') {
                    scope.opt.text = DEFAULT_DISPLAYED_PASSWORD;
                }
            }

            scope.$watch("opt.text", function (newVal, oldVal) {

            });

            scope.$watch("opt.type", function (newVal, oldVal) {
                //scope.opt.bEnable = newVal;
            });

            //scope.onChange = function () {
            //    $input.val
            //}
        }// end of link
    }
})
