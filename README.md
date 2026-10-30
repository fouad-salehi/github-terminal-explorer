# GitHub Terminal Explorer

A command-line tool to explore GitHub users, repositories, activity, and statistics.

## Installation

```bash
npm install
npm link
```

## Commands

```bash
ghx user octocat
ghx repo facebook react
ghx search "machine learning" --language Python
ghx compare octocat torvalds
ghx dashboard octocat
ghx activity octocat
ghx trending --language JavaScript
ghx auth set YOUR_GITHUB_TOKEN
ghx config --username YOUR_USERNAME
```

## Requirements

- Node.js 18 or newer
- GitHub account
- GitHub token is optional for public data and recommended for higher API limits

## License

MIT
