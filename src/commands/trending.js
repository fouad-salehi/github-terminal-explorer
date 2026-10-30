import { GitHubClient } from "../api/github.js";
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
}