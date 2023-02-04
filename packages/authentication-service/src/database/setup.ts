import { Pool, types } from 'pg';

import {
  AUTH_SERVICE_DATABASE,
  AUTH_SERVICE_DATABASE_HOST,
  AUTH_SERVICE_DATABASE_PORT,
  AUTH_SERVICE_DATABASE_USERNAME,
  AUTH_SERVICE_DATABASE_PASSWORD,
} from '../constants';

// this value is defined in the 'pg-types' in the 'TypeId' enum
// but we cannot import it and use it here, because somehow TypeId.NUMERIC throws a NullPointerException
const NUMERIC_OID = 1700;

// connects to a PostgreSQL database
const pool = new Pool({
  user: AUTH_SERVICE_DATABASE_USERNAME,
  host: AUTH_SERVICE_DATABASE_HOST,
  database: AUTH_SERVICE_DATABASE,
  password: AUTH_SERVICE_DATABASE_PASSWORD,
  port: Number(AUTH_SERVICE_DATABASE_PORT),
});

// numeric values are returned from the database as strings, so setTypeParser converts them into numbers
types.setTypeParser(NUMERIC_OID, (value) => parseFloat(value));

const database = {
  query: (queryText: string, values?: any[]) => pool.query(queryText, values),
};

export default database;
