// src/hooks/transactionHook.ts

import { FastifyPluginCallback, FastifyRequest } from "fastify";
import { PoolClient } from "pg";
import pool from "../config/postgres.config";

declare module "fastify" {
  interface FastifyRequest {
    transaction: PoolClient;
  }
}

const transactionHook: FastifyPluginCallback = (fastify, _, done) => {
  fastify.addHook("preHandler", async (request: FastifyRequest) => {
    const client: PoolClient = await pool.connect();
    await client.connect();
    await client.query("BEGIN");

    request.transaction = client;

    request.raw.on("finish", () => {
      if (request.transaction) {
        request.transaction.release();
      }
    });
  });

  fastify.addHook("onError", async (request: FastifyRequest, reply, error) => {
    if (request.transaction) {
      await request.transaction.query("ROLLBACK");
      request.transaction.release();
    }
  });

  fastify.addHook("onResponse", async (request: FastifyRequest) => {
    if (request.transaction) {
      await request.transaction.query("COMMIT");
      request.transaction.release();
    }
  });

  done();
};

export default transactionHook;
