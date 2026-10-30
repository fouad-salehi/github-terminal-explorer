import { GitHubClient } from "../api/github.js";
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
}