// Update with your config settings.
import 'dotenv/config'
//require('dotenv').config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  migrations: {
    tableName: 'migrations',
  },
}
export const production = {
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  migrations: {
    tableName: 'migrations',
  },
}
