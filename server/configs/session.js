import session from 'express-session';
import MySQLStoreModule from 'express-mysql-session';
const MySQLStore = MySQLStoreModule(session);

console.log(`MYSQL_HOST=${process.env.MYSQL_HOST}`);

const options = {
  host: process.env.MYSQL_HOST,
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};
console.log("log options: " + JSON.stringify(options));

const mysql_store = new MySQLStore(options);

const mysql_session = session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: true,
  store: mysql_store,
});

export default mysql_session;
