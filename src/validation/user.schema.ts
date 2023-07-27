export const UserSchema = {
  type: "object",
  properties: {
    username: { type: "string" },
    email: { type: "string", format: "email" },
  },
  required: ["username", "email"],
};
