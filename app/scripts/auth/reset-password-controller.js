'use strict';

var RESTFUL_URL = 'api';

var loginModule = angular.module('login')

loginModule.controller('ResetPasswordController',
		['$routeParams', '$scope', '$http', '$location', 'LoginService',
				function($routeParams, $scope, $http, $location, LoginService) {
					
					//----------------------------------------------------------------------------------
					// Initialize
					//----------------------------------------------------------------------------------	
					
					$scope.password = '';
					$scope.passwordConfirm = '';
					
					$scope.$watch("password", function(newVal, oldVal){
						if(newVal){
							$scope.passwordMsg = "";
						}
					});
					
					$scope.$watch("passwordConfirm", function(newVal, oldVal){
						if(newVal){
							$scope.passwordConfirmMsg = "";
						}
					});
					
					//----------------------------------------------------------------------------------
					// Events
					//----------------------------------------------------------------------------------
					
					
					//----------------------------------------------------------------------------------
					// Public methods
					//----------------------------------------------------------------------------------
					$scope.cancel = function(){
						$location.path('forgetPassword');
					}
					

					//----------------------------------------------------------------------------------
					// Submit to update new password and redirect to login page
					//----------------------------------------------------------------------------------
					$scope.submit = function() {
						
						if($scope.password != $scope.passwordConfirm){
							$scope.passwordMsg = "*The password does not match.";
						}else{
							if(isPasswordTooSimple($scope.password)){
								$scope.passwordMsg = "*At least 4 characters or numbers";//, include uppercase, lowercase and numbers.";
							//	$location("/resetPassword?token=" + $routeParams);
							}else{
								var query = {token: $routeParams.token, password: $scope.password};
								$location.search( 'token', null );
								
								$http.post(RESTFUL_URL + '/resetPass', query).success(
										function(data, status, headers, config) {
											$location.path('passwordStatus');
											
										}).error(
										function(data, status, headers, config) {
											$location.path('forgetPassword');
										});
							}
						}
						
						//if($routeParams.token){
					
						//cleanErrorMessage();
						
					} // end of function submit()
					
					//----------------------------------------------------------------------------------
					// Private methods
					//----------------------------------------------------------------------------------			
					function isPasswordTooSimple(value){
						//var re = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}/;
						//return !re.test(value);
						return !(value.length > 3 && value.length < 32);
					}
					
					function cleanErrorMessage(){
						$scope.passwordMsg = "";
						$scope.passwordConfirmMsg = "";
					}
					
					function setErrorMessage(errorCodes, Error){
					
						if(errorCodes.indexOf(Error.EMAIL_EMPTY) != -1){
							$scope.signup.emailMsg = "*Please enter your email.";
						}else{
							if(errorCodes.indexOf(Error.INVALID_EMAIL) != -1){
								$scope.signup.emailMsg = "*Email format is invalid.";
							}else{
								if(errorCodes.indexOf(Error.EMAIL_NOT_EXISTS) != -1){
									$scope.signup.emailMsg = "*Email not exists, please try another.";
								}else{
									$scope.signup.emailMsg = "";
								}
							}
						}
					}
				} ]);


loginModule.controller('PasswordStatusController',
		['$scope', '$http', '$location', 'LoginService',
				function( $scope, $http, $location, LoginService) {
			
			$scope.openLoginPage = function(){
				$location.path('signin');
			}
		}]);