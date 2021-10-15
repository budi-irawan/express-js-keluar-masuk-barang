require( "dotenv" ).config();

const creds = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIAL,
		logging: false
	},
	test: {
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIAL
	},
	production: {
		username: "utisvvxxmmqerh",
		password: "b17c11e298eeb028f1bed0f5e0c667e68b7676255f39ece8dfa71023ed03c5ba",
		database: "dbj701jj92vfsa",
		host: "ec2-54-209-187-69.compute-1.amazonaws.com",
		dialect: "postgres",
		ssl: true,
		dialectOptions: {
			ssl: {
				require: true, // This will help you. But you will see nwe error
				rejectUnauthorized: false // This line will fix new error
			}
		}
	}
}

module.exports = creds;