import express from "express";
import http from "http";
import dotenv from "dotenv";
import routes from "./routes";
import bodyParser from "body-parser";
import authMiddleware from "./middlewares/auth";
import asyncMiddleware from "./middlewares/async";
import cors from "cors";
import connectDB from "./database/connectDB";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(asyncMiddleware(authMiddleware));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.DOMAIN_ORIGIN,
  },
});
global.io = io;

io.on("connection", () => {
  console.log("a user connected");
});

/* routes */
routes(app).then(() => {
  server.listen(PORT, () => {
    console.log(`⚡️[]: Server is running at http://localhost:${PORT}`);
  });
});

declare global {
  namespace NodeJS {
    interface Global {
      io: any;
    }
  }
}
