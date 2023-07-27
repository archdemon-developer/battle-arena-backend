export const TeamSchema = {
  type: "object",
  properties: {
    teamname: { type: "string" },
    email: { type: "string", format: "email" },
  },
  required: ["teamname", "email"],
};
