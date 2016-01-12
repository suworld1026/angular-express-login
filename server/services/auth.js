//------------------------------------------------------
// Author: zlkca
// Date: Oct 8 2015
// License: MIT
//------------------------------------------------------

'use strict'


var nodemailer = require("../../node_modules/nodemailer");
var sgTransport = require('../../node_modules/nodemailer-sendgrid-transport');
var crypto = require("crypto");

var cfg = require('../config');
var TokenMgr = require('./token');
var tm = TokenMgr();
var DB = require('../db.js');

module.exports = function(){
	
	var _name = 'users';
	var _db = new DB();
	var _collection = _db.getCollection(_name);
	
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
	}
	
	
	function sendResetPasswordMail(host, email, token, callback){
		var sg = cfg.sendgrid;
		
		var options = { auth: {
			api_user: sg.username,
			api_key: sg.password
		}};
		
		var transporter = nodemailer.createTransport( sgTransport(options));
		transporter.sendMail({
		    from: cfg.passResetEmail,
		    to: email,
		    subject: 'Your password was reset',
		    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	          'http://' + host + '/api/resetPassword?token=' + token + '\n\n' +
	          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	      }, function(err){
				var doc = null;
				if(callback){
					callback(err, doc);
				}
	    });
	}
	
	// cb --- function( errors, doc );
	function validateLoginAccount(user, cb){
		var errors = [];
		var account = null;
		
		if (user.account.indexOf("@") != -1){
			account = {'email':user.account };
		}else{
			account = {'username':user.account};
		}
		
		if(user.account == ''){
			errors.push(Error.ACCOUNT_EMPTY);
			if(cb){
				cb(errors, null);
			}
		}else{
			_collection.findOne(account, function(err, doc){
				if( doc == null){
					errors.push(Error.ACCOUNT_NOT_EXIST);
				}
				if(cb){
					cb(errors, doc);
				}
			});
		}
	}
	
	// cb --- function(errors)
	function validateLoginPassword( user, hashedPassword, cb ){
		var errors = [];
		if( user.password ){
			tm.checkHash(user.password, hashedPassword, function(err, bMatch){
				if(!bMatch){
					errors.push(Error.PASSWORD_MISMATCH);
				}
				if(cb){
					cb(errors);
				}
			});
		}else{
			if(cb){
				cb(errors);
			}
		}
	}
	
	function isInvalidEmail(errors){
		return (errors.indexOf(Error.EMAIL_EMPTY)!==-1 || errors.indexOf(Error.INVALID_EMAIL)!==-1
				|| errors.indexOf(Error.EMAIL_EXISTS)!==-1);
	}
	
	function isInvalidUsername(errors){
		return errors.indexOf(Error.USERNAME_EMPTY)!=-1;
	}
	
	function validateSignup(user, cb){
		var errors = [];
		
		if(user.username == ''){
			errors.push(Error.USERNAME_EMPTY);
		}
		
		if(user.password == ''){
			errors.push(Error.PASSWORD_EMPTY);
		}else{
			if(v.passwordTooSimple(user.password)){
				errors.push(Error.PASSWORD_TOO_SIMPLE);
			}
		}
	
		if(user.email == ''){
			errors.push(Error.EMAIL_EMPTY);
		}else{
			if(!v.isEmail(user.email)){
				errors.push(Error.INVALID_EMAIL);
			}
		}
		
		// Check email and user name duplication
		if(isInvalidEmail(errors) && isInvalidUsername(errors)){
			if(cb)
				cb(errors);
		}else{
			_collection.findOne({$or: [{username:user.username}, {email:user.email}]}, function(err, doc){
				if(doc != null){
					if(user.username != '' && user.username == doc.username){
						errors.push(Error.USERNAME_EXISTS);
					}
					
					if(!isInvalidEmail(errors) && (user.email == doc.email)){
						errors.push(Error.EMAIL_EXISTS);
					}	
				}
				
				if(cb)
					cb(errors);
			});
		}
	}
	
	// Save user with hashed password
	function saveUser(user, errors, rsp){
		if(errors && errors.length > 0){
			rsp.json({'errors': errors, token: ''});
		}else{
			tm.hash(user.password, function(err, hash){
				if(hash){
					user.password = hash;
					_collection.save(user, function(err, doc){
						if(err){
							rsp.json({'errors': errors, 'token':''});
						}else{
							tm.signToken({'id': doc._id,'username': user.username, 'email':user.email}, function(token){
								rsp.json({'errors':errors, 'token': token});
							});
						}
					});
				}else{
					errors.push(Error.ENCRYPT_PASSWORD_EXCEPTION);
					rsp.json({'errors': errors, 'token': ''});
				}
			});
		}
	}
	
	return {
		//-------------------------------------------------------------------------
		// Arguments:
		// req --- http request object
		// rsp --- http response object
		//-------------------------------------------------------------------------
		renewToken: function(req, rsp){
			tm.renewToken(req, rsp, function(account, token){
				return rsp.json({success:true, 'token': token});
			});
		},
		
		getAccount: function( req, rsp ){
			tm.renewToken(req, rsp, function(account, token){
				return rsp.json({success:true, id:account.id, username: account.username, email: account.email, 'token': token});
			});
		},
		
		signup: function(req, rsp){
			var user = req.body;
			var dt = new Date();
			user['created'] = dt.toISOString();
			
			if(user.hasOwnProperty('_id')){ // For update
				_collection.findOne({_id: user._id}, function(err, doc){
					if(doc != null){
						validateSignup(user, function(errors){
							saveUser(user, errors, rsp);
						});
					}else{
						rsp.json({'errors': [Error.UPDATE_USER_EXCEPTION], 'token':''});
					}
				});
			}else{
				validateSignup(user, function(errors){
					saveUser(user, errors, rsp);
				});
			}
		},
		
		login: function(req, rsp){
			var credential = {account: req.body.account, password: req.body.password};
			validateLoginAccount(credential, function(accountErrors, doc){
				if(accountErrors && accountErrors.length > 0){
					return rsp.json({'errors':accountErrors, 'token':'', 'decoded':''});
				}else{
					validateLoginPassword(credential, doc.password, function(passwordErrors){
						var errors = accountErrors.concat(passwordErrors);
						if(errors && errors.length > 0){
							return rsp.json({'errors':errors, 'token': '', 'decoded':''});
						}else{
							var user = { id: doc._id, username: doc.username, email: doc.email };
							tm.signToken(user, function(token){
								return rsp.json({'errors': errors, 'token': token, 'decoded': user});
							});
						}
					});	
				}
			});
		},
		
		logout: function(req, res){
			if(req.session!=undefined){
				req.session['logged in'] = false;
			}
			res.json({success:true});
		},

		
		save: function(req, res){
			var data = req.body;
			var item = {username:data.username, password:data.password, email:data.email};
			userModel.save(item, 
					function(err, doc){
						if(err != undefined){
							console.log(err);
						}
						console.log('user:'+ doc.username +' saved to database.');
						res.json({'_id':doc._id.toString()});
					},
					function(doc){
						res.json({'_id':doc._id.toString()});
					});
		},

		getSessionID : function(req, res){
			res.json(req.sessionID);
		},

		getSession : function(req, res){
			if(req.session==undefined){
				res.json({active:false});
			}else{
				res.json({active:req.session['logged in']});				
			}
		},
		
		//-------------------------------------------------------------------------
		// forgetPassword
		// Arguments:
		// 	host 	 --- server address, use req.head.host
		// 	username --- username for sign up
		// 	email 	 --- email address for sign up
		// callback  --- func(errors, Error, doc)
		//-------------------------------------------------------------------------
		forgetPassword: function(host, username, email, callback){
			crypto.randomBytes(20, function(err, buf) {
		          var token = buf.toString('hex');
		          
		          userModel.findOne({'username':username, 'email': email}, function(err, doc){
		        	  if(!doc){
		        		  if(callback){
		        			  //Logger.log('forget password, username and email does not match.');
		        			  callback('The email does not match', null);
		        		  }
		        	  }else{
				          userModel.updateOne({'email': email}, {'$set':{'token': token}}, function(error, item){
				        	  if(error){
				        		  if(callback){
				        			  callback(error, item);
				        		  }
				        	  }else{		        	  
				        		  sendResetPasswordMail(host, email, token, function(error, err){
					        		  if(callback){
					        			  callback(error, item);
					        		  }
						          }); 
				        	  }
				          });
		        	  }
		          });
		      });
		},
		
		//-------------------------------------------------------------------------
		// verifyToken
		// Arguments:
		// host --- server address, use req.head.host
		// callback --- func(errors, Error, doc)
		//-------------------------------------------------------------------------
		verifyToken: function(token, callback){
			userModel.findOne({'token': token}, callback);
			//User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {});
		},
		
		//-------------------------------------------------------------------------
		// resetPassword
		// Arguments:
		// token --- 
		// password ---
		// callback --- func(error, doc)
		//-------------------------------------------------------------------------
		resetPassword: function(token, password, callback){
			userModel.encryptPassword(password, function(err, hash){
				if(err){
					if(callback){
						callback(err);
					}
				}else{
					userModel.updateOne({'token': token}, {'$set':{'password': hash}}, callback);
				}
			});
		}
	}
}

