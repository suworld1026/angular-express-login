'use strict;'

/* create login module */
angular.module('login', [])

.factory('LoginService', ['$rootScope', '$http', function($rootScope, $http){
	
	var username = '';
	
	return{
		isLoggedIn: function(){
			var val =  sessionStorage.getItem(sessionPrefix + '.user');
			var user = JSON.parse(val);
			if(user)
				return user.loggedIn;
			else
				return false;
		},
		setUsername:function(val){
			sessionStorage.setItem('feizailin.username', val);
		},
		getUsername:function(){
			return sessionStorage.getItem('feizailin.username');
		},
		setId:function(val){
			sessionStorage.setItem('feizailin.userId', val);
		},
		getId:function(){
			return sessionStorage.getItem('feizailin.userId');
		},
		getUser: function(){
			var val =  sessionStorage.getItem(sessionPrefix + '.user');
			return JSON.parse(val);
		},
		setUser: function(user){
			var val = JSON.stringify(user);
			sessionStorage.setItem(sessionPrefix + '.user', val);
		},
		isAdminLogin: function(){
			var val =  sessionStorage.getItem(sessionPrefix + '.user');
			var user = JSON.parse(val);
			if(user==null){
				return false;
			}else{
				return user.username == 'sa' && loggedIn;
			}
		}
		/*,
		getSession:function(){
			$http.get(RESTFUL_URL + '/sessions?_id=' + _id).success(
					function(data, status, headers, config) {
					
					})
					.error(
					function(data, status, headers, config) {
							console.log('get item failed');
					});
		}*/

	};
}]);
