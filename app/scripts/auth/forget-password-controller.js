'use strict';

var RESTFUL_URL = 'api';

var loginModule = angular.module('login')

loginModule.controller('ForgetPasswordController',
		['_','$scope', '$http', '$location', 'LoginService',
				function(_,$scope, $http, $location, LoginService) {
					
					//-------------------------------------
					// Initialize
					//-------------------------------------					
					$scope.email='';
					$scope.success = false;
					$scope.fail = false;
					
					$scope.$watch("email", function(newVal, oldVal){
						if(newVal){
							$scope.emailMsg = "";
						}
					});
					
					//-------------------------------------
					// Public methods
					//-------------------------------------
					$scope.cancel = function(){
						$location.path('signin');
					}
					
					$scope.submit = function() {
						
						$scope.emailMsg = "";
						
						if($scope.email!=''){
							$http.post(RESTFUL_URL + '/forgetPassword', {username: $scope.username, email:$scope.email}).success(
									function(data, status, headers, config) {
										if(_.isEmpty(data.error)){	
											$scope.success = true;
										}else{
											$scope.emailMsg = "The email does not exist, please try another.";
										}
									}).error(
									function(data, status, headers, config) {
										$scope.fail = true;
									});
						}else{
							$scope.emailMsg = "Please enter your email to receive the password reset link.";
						}
						
					} // end of function submit()
					
					//----------------------------------
					// Private methods
					//----------------------------------					
					function cleanErrorMessage(){
						$scope.emailMsg = "";
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
					
					//----------------------------------
					// Events
					//----------------------------------
					
					
				} ]);
