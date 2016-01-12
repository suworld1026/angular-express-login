
module.exports = function(){
	
	return {
		isEmpty: function( value ){
			if(value==null){
				return true;
			}else if(typeof(value)=="string"){
				return value.trim().length <= 0;	
			}else{
				return false;
			}
		},
		isNumber: function( value ) {
			return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
		},
		hasInvalidChar: function (value) {
	        var pattern = /[\/\\:\*\?\"<>\|]/g;
	        return pattern.test(value);
	    },
		isEmail: function( value ) {
			// From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
			return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
		},
		passwordTooSimple: function(value){
			// Min 6 chars to 32 chars, with number, lowercase and uppercase
			// var re = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}/;
			// return !re.test(value);
			return !(value.length > 3 && value.length < 32);
		}
	}
}