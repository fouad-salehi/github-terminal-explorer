import { GitHubClient } from "../api/github.js";
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
}