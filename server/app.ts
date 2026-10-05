import { existsSync } from "node:fs";
import path from "node:path";
import express, { type Express } from "express";
import { engine } from "express-handlebars";
import { securityHeaders } from "./security-headers.ts";

const root = path.resolve(import.meta.dirname, "..");
const viewsDir = path.join(import.meta.dirname, "views");
const examplesDir = path.join(root, "examples");

const EXAMPLE_ID = /^[a-z0-9-]+$/;
const VARIANTS = new Set(["bad", "good"]);

export function createApp(): Express {
  const app = express();

  app.engine(".hbs", engine({ extname: ".hbs", defaultLayout: "main" }));
  app.set("view engine", ".hbs");
  app.set("views", viewsDir);

  app.use(securityHeaders);

  app.get("/", (_req, res) => {
    res.render("index");
  });

  app.get("/examples/:id/:variant", (req, res, next) => {
    const { id, variant } = req.params;
    if (!EXAMPLE_ID.test(id) || !VARIANTS.has(variant)) {
      next();
      return;
    }
    const view = path.join(examplesDir, id, `${variant}.hbs`);
    if (!existsSync(view)) {
      next();
      return;
    }
    res.render(view);
  });

  return app;
}
