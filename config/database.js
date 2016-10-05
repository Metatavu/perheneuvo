var db = {
	/*
	 * Host for the database
	 */
	'host' : 'localhost',
	
	/*
	 * Name of the database that app will use
	 */
	'database' : 'perheneuvo'
};

exports.getDbUrl = function(){
	return 'mongodb://'+db.host+'/'+db.database;
};