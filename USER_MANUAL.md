# User Manual

## Introduction

Welcome to the Civic Budget Transparency & Project Accountability Platform. This manual explains how citizens, community advocates, and civic administrators can use the platform to monitor budget allocations, evaluate project progress, and contribute verification evidence.

## System Requirements

- Modern web browser: Chrome, Firefox, Edge, Safari
- Internet access for chatbot and API connectivity
- Recommended display: 1280×768 or higher

## Installation Guide

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/civic-budget-transparency.git
   cd civic-budget-transparency
   ```
2. Follow the local setup instructions in `README.md`.
3. Launch the frontend and backend services.

## User Registration

1. Open the application in your browser.
2. Click `Sign Up` or `Register`.
3. Enter your name, email, and a secure password.
4. Verify your email if the deployment supports email verification.
5. Log in using your credentials.

## Dashboard Usage

The dashboard is the central hub for tracking civic spending and project status.

### Overview Panel

- See total allocated budget and total project spend.
- Review active projects and completion metrics.
- Inspect department-level budget distribution.

### Navigation

- Budget Allocation: Explore how funds are distributed across departments.
- Project Status: Track execution progress and project phases.
- Verification Reports: Submit and review citizen-sourced evidence.
- Chatbot: Ask questions about budget data and project performance.

## Budget Tracking Features

### View Budget Allocations

- Use allocation charts to compare department budgets.
- Filter by fiscal year, department, or project type.
- Inspect individual budget items and approved funding amounts.

### Analyze Department-Wise Expenditures

- Review expenditure percentages versus allocations.
- Compare planned versus actual spend.
- Identify departments with slow progress or budget variances.

### Budget Explanation

- Use the chatbot to receive simplified explanations of budget categories.
- Ask questions like `What is the education budget this year?` or `How much was spent on road maintenance?`

## Project Monitoring Features

### Track Execution Status

- View individual projects with status labels: `Planned`, `In Progress`, `Delayed`, `Completed`.
- Inspect timeline progress and completion percentage.

### Completion Metrics

- See total projects completed and average delivery rate.
- Review variance between expected completion and actual delivery.
- Drill into project milestones and evidence.

## Citizen Reporting Process

### Submit Verification Reports

1. Open the `Report` or `Verification` section.
2. Select the project or budget item you want to verify.
3. Add a description of on-ground observations.
4. Attach evidence images or documents.
5. Submit the report.

### Upload Project Progress Evidence

- Upload photos, receipts, or progress documentation.
- Use clear captions and location details.
- Review submitted evidence in the verification dashboard.

## Chatbot Usage

The Gemini-powered chatbot helps interpret budget information and answer questions.

### Common Use Cases

- `Show me the current status of water infrastructure projects.`
- `Explain why transport spending increased this quarter.`
- `What verification reports are available for the education department?`

### Best Practices

- Ask clear, specific questions.
- Reference project names or departments when possible.
- Use the chatbot for both analytics and accountability queries.

## Troubleshooting Guide

### Login Issues

- Confirm your email and password are correct.
- Clear browser cache or try a private window.
- If account verification is required, verify your email first.

### Data Loading Problems

- Refresh the page and allow network requests to complete.
- Confirm backend services are running.
- Check for browser console errors if data fails to render.

### Chatbot Response Errors

- Ensure your internet and API access are working.
- If the Gemini API is unavailable, retry after a short delay.
- Report persistent issues to the development team.

## FAQs

### Q: How do I know if a project is authentic?
A: Look for verification reports, project evidence, and completion milestones in the project detail view.

### Q: Can I submit multiple verification reports?
A: Yes, citizens can submit multiple reports for different projects or follow-up evidence.

### Q: Is my data private?
A: This platform is designed for public transparency. Personal data is not exposed in public reports.

### Q: How can I contribute improvements?
A: See `CONTRIBUTING.md` for the contribution workflow and collaboration guidelines.
