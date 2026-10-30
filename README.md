# github-terminal-explorer

![Version](https://img.shields.io/badge/version-1.0.0-important)
![Platform](https://img.shields.io/badge/platform-Node.js-green)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)
![Purpose](https://img.shields.io/badge/purpose-GitHub%20Explorer-blue)
![CLI](https://img.shields.io/badge/CLI-ghx-blue)
![Registry](https://img.shields.io/badge/registry-npm-CB3837?logo=npm)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/Node.js-%3E%3D18-brightgreen)

GitHub Terminal Explorer is a command-line tool built with Node.js that allows developers to explore GitHub users, repositories, activity, and trending projects directly from their terminal.

Instead of switching between multiple browser pages, GitHub Terminal Explorer provides a convenient way to retrieve and display GitHub information through simple terminal commands.

The tool uses the GitHub API to collect public information and presents it in readable, organized terminal output.

## Description

GitHub Terminal Explorer currently provides:

- GitHub user profile information
- Repository details and statistics
- Repository search with filters
- User comparison
- Developer dashboard and statistics
- Public user activity
- Trending repository discovery
- GitHub account token configuration
- CLI configuration management

## Installation

GitHub Terminal Explorer is available through npm, GitHub Packages, and its public GitHub repository.

### Option 1: Install from npm (Recommended)

The easiest way to install GitHub Terminal Explorer is through the npm registry.

```bash
npm install -g github-terminal-explorer-tools
```

After installation, the `ghx` command will be available globally.

Verify the installation:

```bash
ghx --help
```

Check the installed version:

```bash
ghx --version
```

**npm Package:** [github-terminal-explorer-tools](https://www.npmjs.com/package/github-terminal-explorer-tools)

### Option 2: Install from GitHub Packages

You can also install GitHub Terminal Explorer from GitHub Packages.

```bash
npm install -g @fouad-salehi/github-terminal-explorer
```

**GitHub Package:** [@fouad-salehi/github-terminal-explorer](https://github.com/users/fouad-salehi/packages/npm/package/github-terminal-explorer)

Depending on your npm configuration and package access settings, GitHub Packages may require additional registry authentication.

### Option 3: Install from Source

If you want to explore the source code, contribute, or modify the project, you can install it directly from GitHub.

Clone the repository:

```bash
git clone https://github.com/fouad-salehi/github-terminal-explorer.git
```

Navigate to the project directory:

```bash
cd github-terminal-explorer
```

Install dependencies:

```bash
npm install
```

Link the CLI globally:

```bash
npm link
```

Verify the installation:

```bash
ghx --help
```

### Run Without Global Installation

You can also run the project directly from its source directory:

```bash
npm start
```

Or:

```bash
node bin/ghx.js
```

### Which Installation Method Should You Choose?

| Installation Method | Recommended For |
| :--- | :--- |
| npm | Most users who want to use the CLI |
| GitHub Packages | Users who prefer GitHub's package registry |
| GitHub Source | Developers who want to explore or modify the source code |

## Requirements

- Node.js v18 or higher
- npm
- Internet connection
- A GitHub account is optional for accessing public information
- A GitHub Personal Access Token is recommended for higher API rate limits

## CLI Usage

GitHub Terminal Explorer provides several commands for exploring GitHub data.

### General Help

Display all available commands and options:

```bash
ghx --help
```

Display help for a specific command:

```bash
ghx user --help
```

## Commands

### 1. User Profile

Retrieve information about a GitHub user.

```bash
ghx user <username>
```

Example:

```bash
ghx user octocat
```

The command displays information such as:

- Display name
- Username
- Bio
- Location
- Company
- Followers
- Following
- Public repositories
- Repository stars
- Popular repository
- GitHub profile URL

### 2. Repository Information

Explore a GitHub repository and its statistics.

```bash
ghx repo <owner> <name>
```

Example:

```bash
ghx repo facebook react
```

The command displays:

- Repository description
- Stars
- Forks
- Open issues
- Watchers
- Default branch
- License
- Creation date
- Last updated date
- Programming languages
- Branch information
- Repository URL

### 3. Repository Search

Search GitHub repositories using a query and optional filters.

```bash
ghx search <query>
```

Examples:

```bash
ghx search "machine learning"
```

Search by programming language:

```bash
ghx search "machine learning" --language Python
```

Sort search results by stars:

```bash
ghx search "javascript tools" --sort stars
```

Filter repositories by minimum stars:

```bash
ghx search "web development" --stars 100
```

Available search options:

| Option | Description |
| :--- | :--- |
| `--language` | Filter by programming language |
| `--stars` | Filter by minimum star count |
| `--sort` | Sort search results |

### 4. Compare GitHub Users

Compare two GitHub users and their public statistics.

```bash
ghx compare <user1> <user2>
```

Example:

```bash
ghx compare octocat torvalds
```

This command provides a side-by-side comparison of user statistics.

### 5. Developer Dashboard

Display a summary of a GitHub user's profile and repository statistics.

```bash
ghx dashboard <username>
```

Example:

```bash
ghx dashboard octocat
```

The dashboard includes:

- Followers
- Public repositories
- Fetched repository stars
- Fetched repository forks
- Programming languages

### 6. User Activity

Retrieve recent public activity for a GitHub user.

```bash
ghx activity <username>
```

Example:

```bash
ghx activity octocat
```

Limit the number of displayed events:

```bash
ghx activity octocat --limit 10
```

This command retrieves publicly available GitHub events for the selected user.

### 7. Trending Repositories

Explore trending repositories using a programming language filter.

```bash
ghx trending
```

Example:

```bash
ghx trending --language JavaScript
```

You can also explore repositories written in other languages:

```bash
ghx trending --language Python
```

### 8. GitHub Authentication

Configure a GitHub Personal Access Token to authenticate API requests.

```bash
ghx auth set <token>
```

A configured token can help increase the available GitHub API rate limit.

Keep your token private. Avoid sharing it or committing it to your repository. Passing a token directly as a command argument may also expose it through shell history.

### 9. CLI Configuration

Display or update the CLI configuration.

Show the current configuration:

```bash
ghx config
```

Set a default GitHub username:

```bash
ghx config --username octocat
```

## Example Workflow

A typical workflow using GitHub Terminal Explorer:

```bash
ghx user octocat
ghx repo facebook react
ghx search "machine learning" --language Python
ghx compare octocat torvalds
ghx dashboard octocat
ghx activity octocat --limit 10
ghx trending --language JavaScript
```

All commands run directly from the terminal after the CLI has been installed.

## Project Architecture

GitHub Terminal Explorer is organized into separate modules to keep the application maintainable and easy to extend.

```text
github-terminal-explorer/
├── bin/
│   └── ghx.js
├── src/
│   ├── api/
│   │   └── github.js
│   ├── commands/
│   │   ├── activity.js
│   │   ├── auth.js
│   │   ├── compare.js
│   │   ├── config.js
│   │   ├── dashboard.js
│   │   ├── repo.js
│   │   ├── search.js
│   │   ├── trending.js
│   │   └── user.js
│   ├── core/
│   │   ├── client.js
│   │   └── config.js
│   ├── utils/
│   │   ├── errors.js
│   │   └── format.js
│   ├── cli.js
│   └── index.js
├── test/
│   └── smoke.test.js
├── package.json
├── package-lock.json
├── README.md
└── LICENSE
```

### Architecture Overview

**bin/**

Contains the executable entry point for the `ghx` command.

**src/api/**

Handles communication with the GitHub API.

**src/commands/**

Contains the individual CLI commands and their functionality.

**src/core/**

Manages the GitHub client and application configuration.

**src/utils/**

Provides shared utilities for formatting output and handling errors.

**test/**

Contains the project's automated tests.

## Technologies

GitHub Terminal Explorer is built with the following technologies:

| Technology | Purpose |
| :--- | :--- |
| Node.js | Runtime environment |
| JavaScript | Main programming language |
| Octokit | GitHub API integration |
| Commander.js | CLI command management |
| Chalk | Terminal text styling |
| CLI Table 3 | Formatted terminal tables |
| Ora | Terminal loading indicators |
| Conf | Configuration storage |
| Boxen | Terminal message formatting |

## Development

Run the project locally:

```bash
npm install
npm start
```

Run the test suite:

```bash
npm test
```

Check the package dependency tree:

```bash
npm ls --depth=0
```

## API Rate Limits

GitHub applies API rate limits to requests.

Unauthenticated requests have lower limits than authenticated requests.

If you frequently use GitHub Terminal Explorer, configuring a GitHub token is recommended.

Some commands may return fewer results or fail when GitHub API limits are reached.

## Notes and Tips

> [!NOTE]
> GitHub Terminal Explorer retrieves information through the GitHub API. Results depend on the information publicly available from GitHub.

> [!IMPORTANT]
> Node.js v18 or higher is required.

> [!TIP]
> Use `ghx --help` to explore available commands and options.

> [!WARNING]
> GitHub API rate limits may affect requests, especially when using the CLI without authentication.

## Contributing

Contributions, suggestions, and improvements are welcome.

If you find an issue or have an idea for improving the project, you can open an issue or submit a pull request.

Before submitting changes, make sure the project runs correctly and the tests pass.

## Philosophy

Explore GitHub. Understand projects. Stay in your terminal.

GitHub Terminal Explorer is designed to make GitHub information more accessible through a simple and efficient command-line experience.

## Author

**[Fouad Salehi](https://github.com/fouad-salehi)**

## Repository

[github-terminal-explorer](https://github.com/fouad-salehi/github-terminal-explorer)

## Package Registries

- [npm Registry](https://www.npmjs.com/package/github-terminal-explorer-tools)
- [GitHub Packages](https://github.com/users/fouad-salehi/packages/npm/package/github-terminal-explorer)

## License

This project is licensed under the MIT License.

See the [LICENSE](./LICENSE) file for details.

## Copyright

Copyright © 2026 Fouad Salehi. All rights reserved.
