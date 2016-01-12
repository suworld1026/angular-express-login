'use strict';

//---------------------------------------------------------------------------------------------------------------
// Home controller
//---------------------------------------------------------------------------------------------------------------
angular.module('mainModule')

.controller('HomeController', [ '$scope', '$rootScope', '$http', '$location', 'MainService',
		  function( $scope, $rootScope, $http, $location, $ms) {
	
			//----------------------------------------------------------------------------------
			// Public methods
			//----------------------------------------------------------------------------------
			$scope.redirectTo = function(a){
				$location.path(a);
			}
			
			
			//--------------------------------------------------------------------
			// When navigate to the home page, init() will be called to 
			// 1. load filter from the cookie
			// 2. send http request to get the item list and save
			//--------------------------------------------------------------------
			function init(){
	            $scope.user = $ms.getSessionItem('user');
			}
			
			init();
			
		} ])
