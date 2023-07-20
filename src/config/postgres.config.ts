// db.ts
import { Pool } from "pg";
import { runStartupScripts } from "../utils/startup";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const postgresConnectionString: string = `postgres://${
  process.env.DATABASE_USERNAME
}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${parseInt(
  process.env.DATABASE_PORT || "5432"
)}/${process.env.DATABASE_NAME}?schema=${process.env.DATABASE_SCHEMA}`;

const pool: Pool = new Pool({
  connectionString: postgresConnectionString,
});

const scriptPaths = [
  path.join(__dirname, "..", "scripts", "schema.sql"),
  //comment below line if you dont want dummy data
  path.join(__dirname, "..", "scripts", "data.sql"),
];

runStartupScripts(scriptPaths, pool)
  .then((value) => {
    console.log("startup scripts executed successfully!");
  })
  .catch((error) => {
    console.error("Error running startup scripts : ", error);
    process.exit(1);
  });

export default pool;
