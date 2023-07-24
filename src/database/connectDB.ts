import { createConnection } from "typeorm";
import ormConfig from "./ormconfig";

const connectDB = function (callback?: (...args: any[]) => void) {
  console.log("ormConfig", ormConfig);
  
  createConnection(ormConfig as any)
    .then(() => {
      console.log("Connected to the database!");
      callback && callback();
    })
    .catch((e) => {
      console.log("Can not connect to the db: ", e);
    });
};

export default connectDB;
