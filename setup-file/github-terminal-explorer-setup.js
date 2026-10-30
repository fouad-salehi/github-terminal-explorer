const fs = require("fs");
const path = require("path");

const root = "github-terminal-explorer";

const files = {
  "package.json": `{
  "name": "github-terminal-explorer-tools",
  "version": "1.0.0",
  "description": "A command-line tool to explore GitHub users, repositories, and statistics.",
  "main": "src/index.js",
  "bin": {
    "ghx": "bin/ghx.js"
  },
  "scripts": {
    "start": "node bin/ghx.js",
    "test": "node --test"
  },
  "keywords": [
    "github",
    "cli",
    "terminal",
    "octokit",
    "developer-tools"
  ],
  "author": "Fouad Salehi",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/fouad-salehi/github-terminal-explorer.git"
  },
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "@octokit/rest": "^21.1.1",
    "boxen": "^8.0.1",
    "chalk": "^5.4.1",
    "cli-table3": "^0.6.5",
    "commander": "^13.1.0",
    "conf": "^14.0.0",
    "ora": "^8.2.0"
  }
}`,
  "bin/ghx.js": `#!/usr/bin/env node
import("../src/cli.js").catch(error => {
  console.error(error.message);
  process.exit(1);
});`,
  "src/index.js": `export { GitHubClient } from "./api/github.js";
export { getConfig, setConfig } from "./core/config.js";`,
  "src/cli.js": `import { Command } from "commander";
import chalk from "chalk";
import { showUser } from "./commands/user.js";
import { showRepo } from "./commands/repo.js";
import { searchRepos } from "./commands/search.js";
import { compareUsers } from "./commands/compare.js";
import { showDashboard } from "./commands/dashboard.js";
import { showActivity } from "./commands/activity.js";
import { showTrending } from "./commands/trending.js";
import { showConfig, updateConfig } from "./commands/config.js";
import { setToken } from "./commands/auth.js";

const program = new Command();

program
  .name("ghx")
  .description("GitHub Terminal Explorer")
  .version("1.0.0");

program
  .command("user <username>")
  .description("Explore a GitHub user")
  .action(showUser);

program
  .command("repo <owner> <name>")
  .description("Explore a GitHub repository")
  .action(showRepo);

program
  .command("search <query>")
  .description("Search GitHub repositories")
  .option("-l, --language <language>")
  .option("-s, --stars <stars>")
  .option("--sort <sort>", "stars, forks, or updated", "stars")
  .action(searchRepos);

program
  .command("compare <user1> <user2>")
  .description("Compare two GitHub users")
  .action(compareUsers);

program
  .command("dashboard <username>")
  .description("Show a GitHub dashboard")
  .action(showDashboard);

program
  .command("activity <username>")
  .description("Show recent public activity")
  .option("-n, --limit <number>", "Number of events", "10")
  .action(showActivity);

program
  .command("trending")
  .description("Explore recently created repositories")
  .option("-l, --language <language>")
  .action(showTrending);

program
  .command("auth")
  .description("Manage GitHub authentication")
  .argument("[action]")
  .argument("[token]")
  .action((action, token) => {
    if (action === "set" && token) return setToken(token);
    console.log("Usage: ghx auth set <token>");
  });

program
  .command("config")
  .description("View or update configuration")
  .option("--username <username>")
  .action(options => {
    if (options.username) return updateConfig("username", options.username);
    return showConfig();
  });

program.addHelpText("after", \`
Examples:
  ghx user octocat
  ghx repo facebook react
  ghx search "machine learning" --language Python
  ghx compare octocat torvalds
  ghx dashboard octocat
  ghx activity octocat
  ghx trending --language JavaScript
\`);

program.parse();`,
  "src/core/config.js": `import Conf from "conf";

const config = new Conf({
  projectName: "github-terminal-explorer"
});

export function getConfig(key) {
  return key ? config.get(key) : config.store;
}

export function setConfig(key, value) {
  config.set(key, value);
  return value;
}`,
  "src/core/client.js": `import { Octokit } from "@octokit/rest";
import { getConfig } from "./config.js";

export function createClient() {
  const token = getConfig("token");
  return new Octokit(token ? { auth: token } : {});
}`,
  "src/api/github.js": `import { createClient } from "../core/client.js";

export class GitHubClient {
  constructor() {
    this.client = createClient();
  }

  async user(username) {
    const response = await this.client.users.getByUsername({ username });
    return response.data;
  }

  async repo(owner, repo) {
    const response = await this.client.repos.get({ owner, repo });
    return response.data;
  }

  async repositories(username) {
    const response = await this.client.repos.listForUser({
      username,
      per_page: 100,
      sort: "updated"
    });
    return response.data;
  }

  async searchRepositories(query, options = {}) {
    const response = await this.client.search.repos({
      q: query,
      sort: options.sort || "stars",
      per_page: 20
    });
    return response.data.items;
  }

  async activity(username, limit = 10) {
    const response = await this.client.activity.listPublicEventsForUser({
      username,
      per_page: limit
    });
    return response.data;
  }
}`,
  "src/utils/format.js": `import chalk from "chalk";
import Table from "cli-table3";

export function title(value) {
  console.log(chalk.bold.cyan("\\n" + value + "\\n"));
}

export function info(label, value) {
  console.log(chalk.gray(label + ": ") + chalk.white(String(value ?? "N/A")));
}

export function table(headers, rows) {
  const output = new Table({ head: headers });
  rows.forEach(row => output.push(row));
  console.log(output.toString());
}

export function number(value) {
  return Number(value || 0).toLocaleString();
}

export function date(value) {
  return value ? new Date(value).toLocaleString() : "N/A";
}`,
  "src/utils/errors.js": `export function handleError(error) {
  const message = error.response?.data?.message || error.message;
  console.error("GitHub API error:", message);
  process.exitCode = 1;
}`,
  "src/commands/user.js": `import { GitHubClient } from "../api/github.js";
import { title, info, number } from "../utils/format.js";
import { handleError } from "../utils/errors.js";

export async function showUser(username) {
  try {
    const api = new GitHubClient();
    const user = await api.user(username);
    const repos = await api.repositories(username);

    const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const popular = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];

    title(user.name || user.login);
    info("Username", user.login);
    info("Bio", user.bio);
    info("Location", user.location);
    info("Company", user.company);
    info("Followers", number(user.followers));
    info("Following", number(user.following));
    info("Public repositories", number(user.public_repos));
    info("Total stars in fetched repositories", number(stars));
    info("Popular repository", popular?.full_name || "N/A");
    info("Profile", user.html_url);
  } catch (error) {
    handleError(error);
  }
}`,
  "src/commands/repo.js": `import { GitHubClient } from "../api/github.js";
import { title, info, number, date } from "../utils/format.js";
import { handleError } from "../utils/errors.js";

export async function showRepo(owner, name) {
  try {
    const api = new GitHubClient();
    const repo = await api.repo(owner, name);
    const languages = await api.client.repos.listLanguages({ owner, repo: name });
    const branches = await api.client.repos.listBranches({ owner, repo: name, per_page: 100 });

    title(repo.full_name);
    info("Description", repo.description);
    info("Stars", number(repo.stargazers_count));
    info("Forks", number(repo.forks_count));
    info("Open issues", number(repo.open_issues_count));
    info("Watchers", number(repo.watchers_count));
    info("Default branch", repo.default_branch);
    info("License", repo.license?.spdx_id);
    info("Created", date(repo.created_at));
    info("Last updated", date(repo.updated_at));
    info("Languages", Object.keys(languages.data).join(", "));
    info("Branches", branches.data.length);
    info("URL", repo.html_url);
  } catch (error) {
    handleError(error);
  }
}`,
  "src/commands/search.js": `import { GitHubClient } from "../api/github.js";
import { title, table } from "../utils/format.js";
import { handleError } from "../utils/errors.js";

export async function searchRepos(query, options) {
  try {
    const api = new GitHubClient();
    let searchQuery = query;

    if (options.language) searchQuery += " language:" + options.language;
    if (options.stars) searchQuery += " stars:" + options.stars;

    const repos = await api.searchRepositories(searchQuery, options);

    title("GitHub Repository Search");
    table(
      ["Repository", "Stars", "Forks", "Language"],
      repos.map(repo => [
        repo.full_name,
        repo.stargazers_count,
        repo.forks_count,
        repo.language || "N/A"
      ])
    );
  } catch (error) {
    handleError(error);
  }
}`,
  "src/commands/compare.js": `import { GitHubClient } from "../api/github.js";
import { title, table } from "../utils/format.js";
import { handleError } from "../utils/errors.js";

export async function compareUsers(first, second) {
  try {
    const api = new GitHubClient();
    const [a, b] = await Promise.all([api.user(first), api.user(second)]);

    title("GitHub User Comparison");
    table(
      ["Metric", a.login, b.login],
      [
        ["Followers", a.followers, b.followers],
        ["Following", a.following, b.following],
        ["Repositories", a.public_repos, b.public_repos],
        ["Public gists", a.public_gists, b.public_gists]
      ]
    );
  } catch (error) {
    handleError(error);
  }
}`,
  "src/commands/dashboard.js": `import { GitHubClient } from "../api/github.js";
import { title, info, number } from "../utils/format.js";
import { handleError } from "../utils/errors.js";

export async function showDashboard(username) {
  try {
    const api = new GitHubClient();
    const [user, repos] = await Promise.all([
      api.user(username),
      api.repositories(username)
    ]);

    const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const forks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const languages = {};

    repos.forEach(repo => {
      if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
    });

    title("GitHub Dashboard: " + username);
    info("Followers", number(user.followers));
    info("Repositories", number(user.public_repos));
    info("Fetched repository stars", number(stars));
    info("Fetched repository forks", number(forks));
    info("Languages", Object.entries(languages).sort((a, b) => b[1] - a[1]).map(([name]) => name).join(", "));
  } catch (error) {
    handleError(error);
  }
}`,
  "src/commands/activity.js": `import { GitHubClient } from "../api/github.js";
import { title, table, date } from "../utils/format.js";
import { handleError } from "../utils/errors.js";

export async function showActivity(username, options) {
  try {
    const api = new GitHubClient();
    const events = await api.activity(username, Number(options.limit));

    title("Recent Public Activity");
    table(
      ["Type", "Repository", "Date"],
      events.map(event => [
        event.type,
        event.repo?.name || "N/A",
        date(event.created_at)
      ])
    );
  } catch (error) {
    handleError(error);
  }
}`,
  "src/commands/trending.js": `import { GitHubClient } from "../api/github.js";
import { title, table } from "../utils/format.js";
import { handleError } from "../utils/errors.js";

export async function showTrending(options) {
  try {
    const api = new GitHubClient();
    const since = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    let query = "created:>" + since;

    if (options.language) query += " language:" + options.language;

    const repos = await api.searchRepositories(query, { sort: "stars" });

    title("Recently Created Popular Repositories");
    table(
      ["Repository", "Stars", "Language"],
      repos.map(repo => [repo.full_name, repo.stargazers_count, repo.language || "N/A"])
    );
  } catch (error) {
    handleError(error);
  }
}`,
  "src/commands/auth.js": `import { setConfig } from "../core/config.js";

export function setToken(token) {
  setConfig("token", token);
  console.log("GitHub token saved.");
}`,
  "src/commands/config.js": `import { getConfig, setConfig } from "../core/config.js";

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
}`,
  "test/smoke.test.js": `import test from "node:test";
import assert from "node:assert/strict";

test("project test runner works", () => {
  assert.equal(1 + 1, 2);
});`,
  ".gitignore": `node_modules
.env
.DS_Store
coverage
`,
  "README.md": `# GitHub Terminal Explorer

A command-line tool to explore GitHub users, repositories, activity, and statistics.

## Installation

\`\`\`bash
npm install
npm link
\`\`\`

## Commands

\`\`\`bash
ghx user octocat
ghx repo facebook react
ghx search "machine learning" --language Python
ghx compare octocat torvalds
ghx dashboard octocat
ghx activity octocat
ghx trending --language JavaScript
ghx auth set YOUR_GITHUB_TOKEN
ghx config --username YOUR_USERNAME
\`\`\`

## Requirements

- Node.js 18 or newer
- GitHub account
- GitHub token is optional for public data and recommended for higher API limits

## License

MIT
`
};

for (const [file, content] of Object.entries(files)) {
  const destination = path.join(root, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, content);
}

console.log("GitHub Terminal Explorer project created.");
console.log("Next: cd github-terminal-explorer && npm install");