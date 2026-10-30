import { GitHubClient } from "../api/github.js";
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
}