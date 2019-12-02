var db = {
	/*
	 * Host for the database
	 */
	'host' : process.env.DB_HOST || '127.0.0.1',

	/*
	 * Name of the database that app will use
	 */
	'database' : process.env.DB_NAME || 'perheneuvo',

	'user' : process.env.DB_USER,

	'pass' : process.env.DB_PASS
};

exports.getDbUrl = function(){
	return `mongodb://${db.user}:${db.pass}@${db.host}/${db.database}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`;
};