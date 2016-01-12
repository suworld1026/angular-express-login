//------------------------------------------------------
// Author: zlkca
// Date: Oct 8 2015
// License: MIT
//------------------------------------------------------

'use strict'

var Mongojs = require('mongojs')
var Config = require('./config')
	
module.exports = function(serverName, port, dbName){
	
	if(serverName==null){
		serverName = Config.dbHost;
	}
	
	if(port==null){
		port = Config.dbPort; 
	}
	
	if(dbName==null){
		dbName = Config.dbName;
	}
	
	var db = Mongojs('mongodb://'+ serverName + ':' + port + '/' + dbName);
	
	return {
		getDatabase: function(){
			return db;
		},
		getCollection: function(name){
			return db.collection(name);
		},
		genObjectId: function(){
			return new Mongojs.ObjectId();
		},
		toObjectId: function(sid){
			return new Mongojs.ObjectId(sid);
		}
	};
}


