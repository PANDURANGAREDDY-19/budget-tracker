# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in the Civic Budget Transparency & Project Accountability Platform, please report it responsibly.

### How to Report

**Please DO NOT create a public GitHub/GitLab issue for security vulnerabilities.**

Instead, email us at: **security@budget-tracker.gov**

Include the following information:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

We will:
1. **Acknowledge** your report within 48 hours
2. **Assess** the vulnerability within 5 business days
3. **Develop** a fix in a private repository
4. **Test** the fix thoroughly
5. **Release** a patched version
6. **Credit** you (unless you prefer anonymity)

## Security Best Practices

### For Users
- Keep your credentials secure and never share them
- Use strong, unique passwords
- Enable two-factor authentication where available
- Keep your browser and plugins updated
- Report suspicious activity immediately

### For Contributors
- Never commit secrets, API keys, or credentials
- Use `.env.example` to document required variables
- Follow the pre-commit hook guidelines
- Run security scans before pushing: `gitleaks detect --verbose`
- Keep dependencies updated regularly
- Follow secure coding practices

## Supported Versions

| Version | Status | Security Support |
|---------|--------|------------------|
| 0.1.x   | Alpha  | Full Support     |
| < 0.1.0 | Legacy | No Support       |

## Security Measures in Place

### Code Security
- ✅ Secret scanning with Gitleaks
- ✅ Dependency vulnerability audits (pip-audit, npm audit)
- ✅ Static code analysis (Bandit, ESLint)
- ✅ Type checking (mypy)

### Runtime Security
- ✅ HTTPS/TLS support
- ✅ CORS policy enforcement
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation and sanitization
- ✅ Rate limiting

### Infrastructure Security
- ✅ Docker container isolation
- ✅ Non-root user execution
- ✅ Health checks and monitoring
- ✅ Database encryption support

## Third-Party Security Scanning

We use the following services to scan for vulnerabilities:
- **GitLab CI/CD** - Automated security checks
- **Gitleaks** - Secret detection
- **pip-audit** - Python dependency vulnerabilities
- **npm audit** - JavaScript dependency vulnerabilities
- **Bandit** - Python code security issues

## Compliance Standards

This project aims to comply with:
- OWASP Top 10 security practices
- GDPR (for user data)
- AGPL-3.0 license requirements
- Industry best practices for civic tech

## Contact

For security-related concerns:
- **Email:** security@budget-tracker.gov
- **GPG Key:** [Available upon request]
- **Response SLA:** 48 hours

Thank you for helping keep our project secure! 🔒
