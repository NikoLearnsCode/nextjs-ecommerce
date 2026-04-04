import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';
import * as schema from './db/schema';

const pool = new Pool({
  connectionString: process.env.DB_URL!,
  ssl: process.env.DB_SSL === 'true',
});

export const db = drizzle(pool, {schema});
export {schema};
