import { FastifyReply, FastifyRequest } from "fastify";

const createTeamHandler = (request: FastifyRequest, reply: FastifyReply) => {
  reply.code(201).send({ message: "team created" });
};

const getTeamHandler = (request: FastifyRequest, reply: FastifyReply) => {
  reply.code(200).send({ message: "team found" });
};

export { createTeamHandler, getTeamHandler };
