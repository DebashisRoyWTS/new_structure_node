// index..js
module.exports = {
    app: {
		port: process.env.PORT || 1575,
		appName: process.env.APP_NAME || 'dashboard',
		env: process.env.NODE_ENV || 'development',
        isProd:(process.env.NODE_ENV === 'prod'),
        getAdminFolderName: process.env.ADMIN_FOLDER_NAME || 'admin',
        getApiFolderName: process.env.API_FOLDER_NAME || 'api'
	},
	db: {
		port: process.env.DB_PORT || 27117,
		database: process.env.DB_DATABASE || 'adreeDb',
		password: process.env.DB_PASSWORD || '7fyk6NyMf7yiDhLA',
		username: process.env.DB_USERNAME || 'adree',
		host: process.env.DB_HOST || '104.211.217.29',
		dialect: 'mongodb'
	},
	
	
};
