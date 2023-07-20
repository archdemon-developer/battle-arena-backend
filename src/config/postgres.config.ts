import dotenv from "dotenv";
import pgPromise, { IDatabase, IMain } from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import { executeStartupScripts } from "../utils/startup";

dotenv.config();

const postgresConnectionString: string = `postgres://${
  process.env.DATABASE_USERNAME
}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${parseInt(
  process.env.DATABASE_PORT || "5432"
)}/${process.env.DATABASE_NAME}?schema=${process.env.DATABASE_SCHEMA}`;

const pgp: IMain<{}, pg.IClient> = pgPromise();

export const db: IDatabase<{}, pg.IClient> = pgp(postgresConnectionString);

executeStartupScripts();
