const schema: string = `${process.env.DATABASE_SCHEMA}`;

export const INSERT_USER = `
  INSERT INTO ${schema}.users (email, username)
  VALUES ($1, $2)
  RETURNING *
`;

export const FIND_USER_BY_ID = `
  SELECT
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
  WHERE u.id = $1;
`;

export const INSERT_TEAM = `
  INSERT INTO ${schema}.teams (email, teamname)
  values ($1, $2)
  RETURNING *
`;

export const FIND_TEAM_BY_ID = `
  SELECT
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
  GROUP BY t.id;
`;
