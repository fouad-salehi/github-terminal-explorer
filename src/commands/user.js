import { GitHubClient } from "../api/github.js";
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
}