//------------------------------------------------------
// Author: zlkca
// Date: Oct 8 2015
// License: MIT
//------------------------------------------------------

var jwt = require('../../node_modules/jsonwebtoken');
var bcrypt = require('../../node_modules/bcrypt-nodejs');

var cfg = require('../config');

module.exports = function(){
	
	function _signToken(obj, callback){
		var token = jwt.sign(obj, cfg.jwt.secret,
				{
					algorithm: cfg.jwt.algorithm,
					expiresInSeconds: cfg.jwt.expiresInSeconds
				});
		
		if(callback)
			callback(token);
	}
	
	return{
		// val --- string to be hash
		// cb( err, hash )
		hash: function(val, cb){
			var saltFactor = 5;
			bcrypt.genSalt(saltFactor, function(err, salt){
				if(err){
					if(cb){
						cb(err, null);
					}
				}else{
					bcrypt.hash(val, salt, null, cb );
				}
			})
		},
		
		// Compare if encrypted hash matches val
		checkHash: function(val, hash, cb){		
			  bcrypt.compare(val, hash, function(err, isMatch) {
			    if (err){
			    	return cb(err);
			    }
			    
			    if(cb){
			    	cb(null, isMatch);
			    }
			  });
		},
		

		
		signToken: function(obj, callback){
			_signToken(obj, callback);
		},
		
		checkToken: function(req, rsp, callback){
			var token = req.body.token || req.query.token || req.headers['x-access-token'];

			if (token) {
				jwt.verify(token, cfg.jwt.secret, 
					{
						algorithms:['HS256'],
						ignoreExpiration: false
					},
					function(err, decoded) {      
						if (err && err.name == 'TokenExpiredError') {
							return rsp.json({ success: false, message: 'Token Expired.' });   
						}else if(err){
							return rsp.json({ success: false, message: 'Failed to authenticate token.' });    
						} else {
							if(callback)
								callback(decoded);
						}
					});
			} else {
			    return rsp.status(403).send({ 
			        success: false, 
			        message: 'No token provided.' 
			    });
			}
		},// end of checkToken
		
		
		// Generate a new token base on the old token
		// If success, will return object in the token and new token.
		renewToken: function(req, rsp, callback){
			this.checkToken(req, rsp, function(a){
				var obj = {id:a.id, username:a.username, email:a.email};
				_signToken(obj, function(token){
					if(callback)
						callback(obj, token);
				});
			})
		},
		
		// q -- object, eg: req.query
		parseQuery: function(q){
			if( Object.keys(q).length != 0 ){
				var query = {};
				for( k in q){
					if(k=='_id'){
						query['_id'] = db.toObjectId(q._id);
					}else{
						query[k] = q[k];
					}
				}
				return query;
			}else{
				return {};
			}
		}
		
	}
}
