--INSERTS SOME DUMMY DATA. DO FEEL FREE TO DELETE IF YOU WANT 

INSERT INTO user_management_schema.users(
	id, username, email, created_at, team_id)
	VALUES (1, 'user1', 'user1@user1.com', NOW(), 1),
    (2, 'user2', 'user2@user2.com', NOW(), 1),
    (3, 'user3', 'user3@user3.com', NOW(), NULL)
    ON CONFLICT DO NOTHING;

INSERT INTO user_management_schema.teams(
	id, teamname, email, created_at)
	VALUES (1, 'team1', 'team1@team1.com', NOW()),
    (2, 'team2', 'team2@team2.com', NOW())
    ON CONFLICT DO NOTHING;