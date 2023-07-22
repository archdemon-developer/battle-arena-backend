import { QueryMap } from "../models/general.model";
import dotenv from "dotenv";

dotenv.config();

const schema: string = `${process.env.DATABASE_SCHEMA}`;

export const queries: QueryMap = {
  insertUser: {
    query: `INSERT INTO ${schema}.users (email, username)
    VALUES ($1, $2)
    RETURNING *`,
    parameters: ["email", "username"],
  },

  findUserById: {
    query: `    SELECT
    u.id as user_id,
    u.username,
    u.email as user_email,
    u.created_at as user_created_at,
    CASE WHEN t.id IS NOT NULL THEN 
      json_build_object(
        'id', t.id,
        'teamname', t.teamname,
        'email', t.email,
        'createdAt', t.created_at
      )
    ELSE 
      NULL
    END as team
    FROM ${schema}.users u
    LEFT JOIN ${schema}.teams t ON t.id = u.team_id
    WHERE u.id = $1;`,
    parameters: ["id"],
  },

  insertTeam: {
    query: `
    INSERT INTO ${schema}.teams (email, teamname)
    values ($1, $2)
    RETURNING *
  `,
    parameters: ["email", "teamname"],
  },
  findTeamById: {
    query: `    SELECT
    t.id as team_id,
    t.teamname,
    t.email as team_email,
    t.created_at as team_created_at,
    CASE WHEN COUNT(u.id) > 0 THEN
      json_agg(json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email,
        'createdAt', u.created_at
      ))
    ELSE
      NULL
    END as users
  FROM ${schema}.teams t
  LEFT JOIN ${schema}.users u ON t.id = u.team_id
  WHERE t.id = $1
  GROUP BY t.id;`,
    parameters: ["id"],
  },
  startupTableCreation: {
    query: ` CREATE SCHEMA IF NOT EXISTS ${schema};
  
    CREATE TABLE if not exists ${schema}.teams (
      id SERIAL PRIMARY KEY,
      teamname varchar(50) NOT NULL,
      email varchar(100) unique not null,
      created_at TIMESTAMP DEFAULT NOW()
    );
  
    CREATE TABLE if not exists ${schema}.users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      team_id INTEGER,
      FOREIGN KEY (team_id) references ${schema}.teams(id)
    );`,
  },

  startupDataInsertion: {
    query: `--INSERTS SOME DUMMY DATA. DO FEEL FREE TO DELETE IF YOU WANT

    INSERT INTO ${schema}.users(
    id, username, email, created_at, team_id)
    VALUES (1, 'user1', 'user1@user1.com', NOW(), 1),
      (2, 'user2', 'user2@user2.com', NOW(), 1),
      (3, 'user3', 'user3@user3.com', NOW(), NULL)
      ON CONFLICT DO NOTHING;

    INSERT INTO ${schema}.teams(
    id, teamname, email, created_at)
    VALUES (1, 'team1', 'team1@team1.com', NOW()),
      (2, 'team2', 'team2@team2.com', NOW())
      ON CONFLICT DO NOTHING;`,
  },
};
