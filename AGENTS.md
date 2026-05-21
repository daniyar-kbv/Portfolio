Use following prefixes for commit messages:
- `feat: ` for new features
- `refactor: ` for refactoring changes
- `fix: ` for bug fixes

Before making portfolio, content, asset, or design changes, read:
- `README.md`
- `docs/portfolio-context.md`

Automatically update `docs/portfolio-context.md` when new durable knowledge appears, including:
- source-of-truth decisions
- design/product decisions
- asset/content conventions
- project/client technical summaries
- testing or workflow expectations

Do not wait for an explicit reminder to document this knowledge. Do not document secrets, credentials, private keys, tokens, or temporary access details.

Run Playwright visual and interaction suites sequentially. They both rebuild and serve `dist`, so parallel runs can race on generated output.

Update AGENTS.md file(s) if needed after each change.
