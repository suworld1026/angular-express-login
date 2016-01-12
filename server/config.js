//------------------------------------------------------
// Author: zlkca
// Date: Oct 8 2015
// License: MIT
//------------------------------------------------------

'use strict'

module.exports = {
	port:5003,
	dbHost: 'localhost',
	dbName: 'westudents',
	dbPort: '27017',
	apiUrl: '/api',
	sessionPrefix: 'westudents',
	sendgrid:{
		username:'myusername',
		password:'mypassword'
	},
	passResetEmail: 'MyPasswordService@MyDomain.com',
	jwt:{
		secret: 'myusername_hmacsha256',
		algorithm: 'HS256',
		expiresInSeconds: 180
	}
}
