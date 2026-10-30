import { createClient } from "../core/client.js";

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
}