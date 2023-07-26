import path from "path";
import { loadEnvConfig } from "../configs/env";

loadEnvConfig();

export default {
  name: "default",
  type: process.env.DB_TYPE || "postgres",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [path.join(__dirname, "..", "entities", "**", "*.*"), path.join(__dirname, "..", "entities", "*.*")],
  cli: {
    entitiesDir: "src/entities",
  },
  ssl: process.env.SSL === "true",
};
