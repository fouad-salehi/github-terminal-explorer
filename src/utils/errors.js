export function handleError(error) {
  const message = error.response?.data?.message || error.message;
  console.error("GitHub API error:", message);
  process.exitCode = 1;
}