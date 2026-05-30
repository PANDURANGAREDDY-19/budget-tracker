# Contributing to Civic Budget Transparency & Project Accountability Platform

Thank you for your interest in contributing to the Civic Budget Transparency & Project Accountability Platform. This project is designed for civic engagement, transparency, and public accountability. We welcome contributions from developers, designers, analysts, and civic technologists.

## Contribution Workflow

1. Fork the repository.
2. Create a feature branch from `main`.
3. Implement changes with clear scope and incremental commits.
4. Run tests and validate documentation.
5. Submit a pull request targeting `main`.

## Branch Naming Standards

Use clear, descriptive branch names that reflect the work being done:

- `feature/<short-description>` for new features
- `fix/<short-description>` for bug fixes
- `docs/<short-description>` for documentation changes
- `refactor/<short-description>` for architecture or code cleanup
- `test/<short-description>` for test coverage additions

Examples:

- `feature/budget-visualization-panel`
- `fix/project-status-api`
- `docs/chatbot-usage-guide`

## Commit Message Guidelines

Follow a readable and consistent commit history:

- Use the imperative mood: `Add`, `Fix`, `Update`, `Remove`
- Keep the subject line under 72 characters
- Include a short body when additional explanation is needed

Example:

```
Add department expense filter to dashboard

- support filtering by department
- update chart labels for clarity
- add unit tests for API filter behavior
```

## Pull Request Process

1. Ensure your branch is up to date with `main`.
2. Provide a clear PR title and descriptive summary.
3. Link relevant issue or task IDs when available.
4. Describe test coverage and validation steps.
5. Request review from at least one maintainer.

## Coding Standards

- Write modular, reusable code.
- Prefer readability over cleverness.
- Keep functions and components focused on one responsibility.
- Use consistent naming conventions and file organization.
- Comment complex logic and architectural decisions.
- Enforce linting and formatting tools when available.

### Frontend

- Use React component composition.
- Keep UI logic separate from presentation.
- Use Tailwind CSS for consistent styling.
- Validate chart data before rendering.

### Backend

- Keep endpoints RESTful and intuitive.
- Validate request payloads and responses.
- Use SQLAlchemy models and typed schemas.
- Handle errors with clear API messages.

## Documentation Standards

- Document new features and endpoints.
- Keep documentation concise and user-focused.
- Use Markdown formatting and headings.
- Add diagrams when they clarify architecture.
- Update `README.md`, `USER_MANUAL.md`, or `POC.md` for major changes.

## Issue Reporting Process

When reporting an issue, include:

- A clear summary of the problem
- Steps to reproduce
- Expected versus actual behavior
- Environment details (browser, OS, backend version)
- Screenshots or logs if available

## Review Guidelines

Reviewers should verify:

- Code quality and architecture fit
- Correctness of implementation
- Documentation coverage
- Test coverage and reproducibility
- Accessibility and usability considerations

## License and Code of Conduct

All contributions should comply with the project license and the community's values of transparency, inclusion, and civic responsibility.
