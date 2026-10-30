import { Command } from "commander";
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

program.addHelpText("after", `
Examples:
  ghx user octocat
  ghx repo facebook react
  ghx search "machine learning" --language Python
  ghx compare octocat torvalds
  ghx dashboard octocat
  ghx activity octocat
  ghx trending --language JavaScript
`);

program.parse();