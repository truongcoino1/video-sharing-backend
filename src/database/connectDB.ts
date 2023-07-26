/* istanbul ignore file */
import { createConnection } from "typeorm";
import ormConfig from "./ormconfig";

const connectDB = function (callback?: (...args: any[]) => void) {
  createConnection(ormConfig as any)
    .then(() => {
      console.log("Can not connect to the db: ", ormConfig);
      callback && callback();
    })
    .catch((e) => {
      console.log("Can not connect to the db: ", e);
    });
};

export default connectDB;
