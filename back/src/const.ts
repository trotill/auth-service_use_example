import * as process from "process";

export const { AUTH_SERVICE = "http://localhost:7777", LISTEN_PORT = "3200" } =
  process.env;
