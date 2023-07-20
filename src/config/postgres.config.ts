// db.ts
import { Pool } from "pg";

const postgresConnectionString: string = `postgres://${
  process.env.DATABASE_USERNAME
}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${parseInt(
  process.env.DATABASE_PORT || "5432"
)}/${process.env.DATABASE_NAME}?schema=${process.env.DATABASE_SCHEMA}`;

const pool: Pool = new Pool({
  connectionString: postgresConnectionString,
});

export default pool;
