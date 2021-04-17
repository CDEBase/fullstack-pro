
Reference:
https://github.com/barakbd/docker_typescript_debug_vscode/blob/8454ab4bdd9713da373e898e7c606193bfbfc5e2/src/config/mongoose_connection.ts

```
/ https://codingsans.com/blog/mongoose-models-using-typescript-classes
import * as mongoose from "mongoose";
var connectionOptions: mongoose.ConnectionOptions | undefined;

const uri: string = `mongodb://${process.env.MONGODB_HOST_AND_PORT_LIST}/${
  process.env.MONGODB_DATABASE_NAME
}`;

console.log("uri", uri);
const mongooseConnectionOptions: mongoose.ConnectionOptions = {
  autoReconnect: true,
  reconnectTries: 3,
  keepAlive: 120,
  user: process.env.MONGODB_DB_USERNAME,
  pass: process.env.MONGODB_DB_PASSWORD,
  authSource: process.env.MONGODB_AUTH_SOURCE,
  replicaSet: process.env.MONGODB_REPLICASET
};

process.env.NODE_ENV === "local"
  ? (connectionOptions = undefined)
  : (connectionOptions = mongooseConnectionOptions);

console.log("mongoose connectionOptions - ", connectionOptions);

mongoose
  .connect(uri, connectionOptions)
  .then(() => {
    console.info("mogoose connect - success");
    // console.info(`uri - ${uri}`);
    // console.info(`connectionOptions - ${connectionOptions}`);
  })
  .catch((err: mongoose.Error) => {
    console.error("mogoose connect - error - ", err);
    // throw err;
    process.kill(process.pid);
  });
const mongooseConnection: mongoose.Connection = mongoose.connection;
export { mongooseConnection };
```