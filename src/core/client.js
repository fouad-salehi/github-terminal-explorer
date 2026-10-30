import { Octokit } from "@octokit/rest";
import { getConfig } from "./config.js";

export function createClient() {
  const token = getConfig("token");
  return new Octokit(token ? { auth: token } : {});
}