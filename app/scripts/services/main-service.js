//--------------------------------------------------------------------------------------------------
//	Author: Like Zhang 2015-03-07
//	2014-2015 Copyright reserved
//--------------------------------------------------------------------------------------------------

angular.module('mainModule',[])

.factory('MainService', ['$translate',
	'$http', function($translate, 
	$http){
	
	function getOrientation(){
		return window.screen.width > window.screen.height? 'landscape' : 'portrait';
	}
	
	function inMobile(){
		return window.screen.width < 768 || window.screen.height < 768;
	}
	
	//--------------------------------------------------------------------------------------
	// setLocalItem
	//	name --- name of session item
	// 	obj --- object that can be convert to json string  
	//--------------------------------------------------------------------------------------
	function _setLocalItem( name, obj ){
		if( typeof obj == 'undefined'){
			localStorage.setItem( cfg.sessionPrefix + name, null );
		}else if(typeof obj == 'string'){
			localStorage.setItem( cfg.sessionPrefix + name, obj);
		}else{
			if(obj)
				localStorage.setItem( cfg.sessionPrefix + name, JSON.stringify(obj));
			else
				localStorage.setItem( cfg.sessionPrefix + name, obj);
		}
	}
	
	return{
		changeLanguage: function(lang){
			// if(lang=='en'){
				// $translate.use('en_US');
			// }else if(lang=='zh_CN'){
				// $translate.use('zh_CN');
			// }else{
				// $translate.use('zh_CN');
			// }
		},
		
		inMobile: function(){
			return inMobile();
		},
		
		renewToken: function(token, successCb){
			$http.get(cfg.apiUrl + '/renewToken')
				.success(function(data, status, headers, config) {
					if(data.success){
						if(successCb)
							successCb(data.token);
					}
				})
				.error(function(data, status, headers, config) {
					console.log('Failed to get token');
				});
		},
		
		getObjectId:function(successCb, failCb){
			$http.get(RESTFUL_URL + '/object_id').success(
					function(data, status, headers, config) {
						if(successCb){
							successCb(data._id);
						}
					}).error(
					function(data, status, headers, config) {
						console.log('[failed] -- Get object id');
						if(failCb){
							failCb(null);
						}
					});
		},
		
		
		resize: function(){
			var orientation = getOrientation();
			if(inMobile()){
				if(orientation == 'portrait'){
					if(window.innerWidth < 768){
						$('.page-content').height(window.innerHeight - $('.footer').height() - $('.nav-menus').height()- 40);						
					}else{
						$('.page-content').height(window.innerHeight - $('.footer').height() - $('.nav-menus').height()- 70);										
					}
				}	
			}else{
				$('.page-content').height(window.innerHeight - $('.footer').height() - $('.nav-menus').height() - 70);						
			}
		},
		
		//--------------------------------------------------------------------------------------
		// getSessionItem
		//	name --- name of session item 
		//--------------------------------------------------------------------------------------
		getSessionItem : function( name ){	
			var s = sessionStorage.getItem( cfg.sessionPrefix + name);
			if (s=='null')
				return null;
			try {
				if(s){
					return JSON.parse(s);
				}else{
					return s;
				}
		    } catch (e) {
		        return s;
		    }
		},
		
		//--------------------------------------------------------------------------------------
		// setSessionItem
		//	name --- name of session item
		// 	obj --- object that can be convert to json string  
		//--------------------------------------------------------------------------------------
		setSessionItem : function( name, obj ){
			if( typeof obj == 'undefined'){
				sessionStorage.setItem( cfg.sessionPrefix + name, null );
			}else if(typeof obj == 'string'){
				sessionStorage.setItem( cfg.sessionPrefix + name, obj);
			}else{
				if(obj)
					sessionStorage.setItem( cfg.sessionPrefix + name, JSON.stringify(obj));
				else
					sessionStorage.setItem( cfg.sessionPrefix + name, obj);
			}
		},
	
		//--------------------------------------------------------------------------------------
		// getLocalItem
		//	name --- name of session item 
		//--------------------------------------------------------------------------------------
		getLocalItem : function( name ){	
			var s = localStorage.getItem( cfg.sessionPrefix + name);
			if (s=='null')
				return null;
			try {
				if(s){
					return JSON.parse(s);
				}else{
					return s;
				}
		    } catch (e) {
		        return s;
		    }
		},
		
		//--------------------------------------------------------------------------------------
		// setLocalItem
		//	name --- name of session item
		// 	obj --- object that can be convert to json string  
		//--------------------------------------------------------------------------------------
		setLocalItem : function( name, obj ){
			if( typeof obj == 'undefined'){
				localStorage.setItem( cfg.sessionPrefix + name, null );
			}else if(typeof obj == 'string'){
				localStorage.setItem( cfg.sessionPrefix + name, obj);
			}else{
				if(obj)
					localStorage.setItem( cfg.sessionPrefix + name, JSON.stringify(obj));
				else
					localStorage.setItem( cfg.sessionPrefix + name, obj);
			}
		},
		
		//------------------------------------------------------------------------------------------
		// 	Convert the query object to string.
		//	Arguments: 
		//		query --- query object of mongodb format. eg. { item_id: itemId }
		//	Return:
		//		string of the query, eg. firstname=a&lastname=b
		//------------------------------------------------------------------------------------------
		toQueryStr: function(query){
			var list = [];
			if( !_.isEmpty(query) ){
				_.each(query, function(val, key){
					list.push(key + '=' + val);
				});
				return list.join('&');
			}
			return '';
		},

		
		securePost: function(url, options, successCb, errorCb){
			var token = this.getSessionItem('token');
			if(token){
				$http.post(cfg.apiUrl + url, $.extend({'token':token}, options) )
				.success(function(data, status, headers, config) {
					if(data.token){
						this.setSessionItem('token', data.token);
					}
					
					if(!data.success){
						// if(window.location.hash=='#/propertyList'){
							// $location.path('/signin');
						// }
					}

					if(successCb){
						successCb(data, status, headers, config);
					}
				})
				.error(errorCb);
			}else{
				if(errorCb){
					errorCb(null, null, null, null);
				}
			}
		},
		
		
		getDateTimeString : function(dt){
			if(dt){
				var s = dt.split('GMT-');
				return s[0].trim();
			}else{
				return '5 minutes ago';
			}
		}
		
	}
}])

