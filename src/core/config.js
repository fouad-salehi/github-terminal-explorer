import Conf from "conf";

const config = new Conf({
  projectName: "github-terminal-explorer"
});

export function getConfig(key) {
  return key ? config.get(key) : config.store;
}

export function setConfig(key, value) {
  config.set(key, value);
  return value;
}