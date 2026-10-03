import { randomBytes } from "node:crypto";
import type { RequestHandler } from "express";
import { policy, toHeaders } from "@repo/policy";

export const securityHeaders: RequestHandler = (_req, res, next) => {
  const nonce = randomBytes(16).toString("base64");
  res.locals.cspNonce = nonce;
  res.set(toHeaders(policy, nonce));
  next();
};
