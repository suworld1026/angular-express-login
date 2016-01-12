'use strict';

//var eSignUpError = {
//		NONE:0,
//		USERNAME_EXISTS:1,
//		EMAIL_EXISTS:2,
//		USERNAME_EMPTY:3,
//		PASSWORD_EMPTY:4,
//		EMAIL_EMPTY:5,
//		PASSWORD_TOO_SHORT:6,
//		PASSWORD_TOO_SIMPLE:7,
//		INVALID_EMAIL:8,
//		SAVE_FAILED:9
//}



angular.module('mainModule').controller('SignUpController', [ '$scope', '$rootScope','$http', '$location', 'MainService',
                      				function( $scope, $rootScope, $http, $location, $ms) {

	var Error = {
			NONE:0,
			ACCOUNT_NOT_EXIST:1,
			PASSWORD_MISMATCH:2,
			ACCOUNT_EMPTY:3,
			EMAIL_EMPTY:4,
			INVALID_EMAIL:5,
			EMAIL_EXISTS:6,
			USERNAME_EMPTY:7,
			PASSWORD_EMPTY:8,
			PASSWORD_TOO_SIMPLE:9,
			ENCRYPT_PASSWORD_EXCEPTION:10,
			UPDATE_USER_EXCEPTION:11
	};
		
	//------------------------------------------------------------------------
	// Initialize
	//------------------------------------------------------------------------

	$scope.signup = {username:'',password:'',email:'', role:'1'};
	$scope.error = {username:"", password:"", email:"", agreement:""};
	//$ms.resize();
	
	for( var key in $scope.error){		
		$scope.$watch("error." + key, function(newVal, oldVal){
			if(newVal){
				$scope.error[key] = "";
			}
		});
	}
			
	//-------------------------------------
	// Public methods
	//-------------------------------------
	$scope.openTermsPage = function(){
		$location.path('legal-terms');
	}
	
	$scope.openPrivacyPage = function(){
		$location.path('privacy-policy');
	}
			
	$scope.signUp = function() {
		
		cleanErrorMessage();
		
		if(!$scope.signup.agree){
			$scope.error.agreement = "*In order to use our services, you must agree our Terms and privacy policy.";
		}else{
			$scope.error.agreement = "";
		}
		var user = {username: $scope.signup.username,
					password:$scope.signup.password,
					email:$scope.signup.email,
					role:1};
				
		$http.post(cfg.apiUrl + '/signup', user).success(
			function(data, status, headers, config) {
					if (data.errors && data.errors.length > 0) {
						setErrorMessage(data.errors);
					}else{
						$rootScope.$broadcast("onUpdateHeader");
						$location.path('dashboard');
						if(data.token){
							$ms.setSessionItem('token', data.token);
							$ms.setSessionItem('user', data.decoded);
						}
					}
			}).error(
				function(data, status, headers, config) {
					cleanErrorMessage();
			});
	} // end of function signUp()
			
	//----------------------------------
	// Private methods
	//----------------------------------					
	function cleanErrorMessage(){
		for( var key in $scope.error){
			$scope.error[key] = "";
		}
	}
			
	function setErrorMessage(errors){
		if(errors.indexOf(Error.USERNAME_EMPTY) != -1){
			$scope.error.username = "*Please enter a username.";
		}else{
			if(errors.indexOf(Error.USERNAME_EXISTS) != -1){
				$scope.error.username = "Username exists, please use another.";
			}else{
				$scope.error.username = "";
			}
		}
		if(errors.indexOf(Error.PASSWORD_EMPTY) != -1){
			$scope.error.password = "*Please enter a password.";
		}else{
			if(errors.indexOf(Error.PASSWORD_TOO_SIMPLE) != -1){
				$scope.error.password = "At least 4 characters or numbers";//"*At least 6 characters, include uppercase, lowercase and numbers";
			}else{
				$scope.error.password = "";
			}
		}
		if(errors.indexOf(Error.EMAIL_EMPTY) != -1){
			$scope.error.email = "*Please enter your email.";
		}else{
			if(errors.indexOf(Error.INVALID_EMAIL) != -1){
				$scope.error.email = "*Email format is invalid.";
			}else{
				if(errors.indexOf(Error.EMAIL_EXISTS) != -1){
					$scope.error.email = "*Email exists, please use another.";
				}else{
					$scope.error.email = "";
				}
			}
		}
	}
			
	//----------------------------------
	// Events
	//----------------------------------
}])
