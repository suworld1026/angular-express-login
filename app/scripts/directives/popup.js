'use strict';

angular.module('wsui',[])

.directive('popup', function () {
    return {
        restrict: 'E',
        scope: {
            opt: '=',
//            data: '='
        },
        transclude:true,
        templateUrl: '/scripts/directives/popup.html',
        link: function (scope, element, attrs) {
        	
        	var opt = null;
        	
        	scope.$on('OnShowModal', function(e, args){
	            var $modal = $(element).find('.w-popup');
	
	            if (opt && opt.title != null) {
	                $modal.find('.modal-title').text(opt.title);
	            }
	
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
	            $modal.find('.btn-ok').show();
        	});
        }// end of link
    }//end of return
});
