import mysql2, { PoolOptions } from "mysql2";
import { PoolConnection } from "mysql2/typings/mysql/lib/PoolConnection";

const access: PoolOptions = {
	connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	multipleStatements: true,
	queueLimit: 0,
	waitForConnections: true,
	connectTimeout: Number(process.env.DB_CONNECTION_TIMEOUT),
};

let pool = mysql2.createPool(access);

pool.getConnection((err, connection: PoolConnection) => {
	if (err) {
		return console.error("error: " + err.message);
	}

	if (connection) {
		console.log("Successfully Connected to Database");
		connection.release(); //reuse of connection every after access
	}
});

pool.on("release", (connection) => {
	console.log("Connection %d released", connection.threadId);
});

export default pool;
