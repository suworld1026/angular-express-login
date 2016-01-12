'use strict';

angular.module('wsui')

.directive('signup', function () {
    return {
        restrict: 'E',
        scope: {
//            opt: '=',
//            data: '='
        },
        transclude:true,
        templateUrl: '/scripts/directives/signup.html',
        link: function (scope, element, attrs) {
        	
        	scope.opt = {title:'Sign Up'};
        	scope.error = {username:'', password:'', email:''};
        	scope.data = {username:'', password:'', email:'',agree:''};
        	scope.$on('OnShowSignup', function(e, args){
	            var $modal = $(element).find('.w-popup');
	            var $content = $modal.find('.modal-content');
	            
	            $content.width(640).height(480);
	
	            //$modal.find('.modal-title').text('Sign Up');
	  
	
	            //$modal.find('.modal-body p').text(opt.body);
	            $modal.find('.modal-body p').text('Hi');
	            $modal.modal({
	                backdrop: true,
	                keyboard: true
	            });
	            
	            $modal.css('margin-left', $(window).width()/2 - $modal.find('.modal-content').width()/2 + 'px');
	            $modal.css('margin-top', $(window).height()/2 - $modal.find('.modal-content').height()/2 + 'px');
	            
	            $modal.find('.btn-yes').hide();
	            $modal.find('.btn-no').hide();
	            $modal.find('.btn-ok').hide();
        	});
        }// end of link
    }//end of return
});