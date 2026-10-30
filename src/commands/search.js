import { GitHubClient } from "../api/github.js";
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
}