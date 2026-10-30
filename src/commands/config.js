import { getConfig, setConfig } from "../core/config.js";

export function showConfig() {
  const config = getConfig();
  console.log({
    username: config.username || null,
    tokenConfigured: Boolean(config.token)
  });
}

export function updateConfig(key, value) {
  setConfig(key, value);
  console.log(key + " updated.");
}