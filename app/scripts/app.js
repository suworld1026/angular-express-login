'use strict';
                      
/* create root module */
angular.module('myApp', ['ngResource', 'ngRoute', 'ngCookies', 'ngSanitize', 'ngTouch', 'ngAnimate',
                                 'pascalprecht.translate','mainModule', 'auth'//,'wsui'
                           ])
//-------------------------------------------------------------------------------
// Get executed during the provider registrations and configuration phase. 
// Only providers and constants can be injected into configuration blocks.
//-------------------------------------------------------------------------------
.config(['$routeProvider', '$translateProvider',  function($routeProvider, $translateProvider){

    $routeProvider
	   .when('/', {
	      templateUrl: '/views/home.html',
	      controller: 'HomeController'
	   })
	   .when('/signup',{
		 templateUrl: '/views/signup.html'
	   })
	   .when('/login',{
			 templateUrl: '/views/login.html'	
	   })
	  // .when('/forgetPassword',{
			// templateUrl: '/views/forget-password.html',
			// controller: 'ForgetPasswordController'		
	  // })
	  // .when('/resetPassword',{
			// templateUrl: '/views/reset-password.html',
			// controller: 'ResetPasswordController'		
	  // })
	  // .when('/passwordStatus',{
			// templateUrl: '/views/reset-password-status.html',
			// controller: 'PasswordStatusController'		
	  // })
      .otherwise({
    	  	redirectTo: '/login'
       });
    // Translation
    //$translateProvider.translations('en_US', en_US );  
    //$translateProvider.translations('zh_CN', zh_CN );
    
    //$translateProvider.preferredLanguage('en_US');
}]);

