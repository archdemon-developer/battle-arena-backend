export const INSERT_USER = `
  INSERT INTO users (email, username)
  VALUES ($1, $2)
  RETURNING *
`;

export const FIND_USER_BY_ID = `
    SELECT * from users where id = $1
`;
