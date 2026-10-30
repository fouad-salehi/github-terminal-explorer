import { GitHubClient } from "../api/github.js";
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
}