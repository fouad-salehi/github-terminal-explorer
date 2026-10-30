#!/usr/bin/env node
import("../src/cli.js").catch(error => {
  console.error(error.message);
  process.exit(1);
});