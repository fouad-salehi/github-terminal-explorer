import { setConfig } from "../core/config.js";

export function setToken(token) {
  setConfig("token", token);
  console.log("GitHub token saved.");
}