CREATE SCHEMA IF NOT EXISTS user_management_schema;

CREATE TABLE if not exists user_management_schema.teams (
    id SERIAL PRIMARY KEY,
    teamname varchar(50) NOT NULL,
    email varchar(100) unique not null,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE if not exists user_management_schema.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  team_id INTEGER,
  FOREIGN KEY (team_id) references user_management_schema.teams(id)
);