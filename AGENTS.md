# Agent Collaboration Guide

This document describes the roles, responsibilities, and workflows for AI and human agents contributing to the Civic Budget Transparency & Project Accountability Platform.

## AI Agent Responsibilities

AI agents support the project with structured collaboration, automation, and consistency.

### Primary Objectives

- Facilitate documentation and onboarding
- Support design and architecture reasoning
- Accelerate data validation and testing scenarios
- Provide prompt standards for chatbot use

## Backend Agent

Responsibilities:

- Design API endpoints and backend contracts
- Model budget and project data in PostgreSQL
- Implement FastAPI services and authentication
- Orchestrate data ingestion pipelines with Pandas
- Integrate Gemini API for conversational analysis

## Frontend Agent

Responsibilities:

- Build React UI components and dashboard screens
- Create responsive Tailwind CSS layouts
- Visualize budgets and project analytics with Recharts
- Implement the chatbot interaction experience
- Maintain accessibility and mobile usability

## Documentation Agent

Responsibilities:

- Produce user-friendly project documentation
- Author README, CONTRIBUTING, USER_MANUAL, and POC artifacts
- Capture architecture rationale and technical decisions
- Maintain contribution and collaboration standards

## Testing Agent

Responsibilities:

- Define test cases for backend APIs and UI flows
- Prepare datasets and validation checks
- Perform user acceptance and regression testing
- Log bugs and verify fixes through QA cycles

## Deployment Agent

Responsibilities:

- Containerize services with Docker
- Configure Nginx reverse proxy and routing
- Manage local and production deployment scripts
- Ensure environment consistency and observability

## Collaboration Workflow

1. Define the scope and deliverables for each sprint.
2. Assign tasks to agents aligned with expertise.
3. Share architecture diagrams, wireframes, and API contracts.
4. Review implementation iteratively.
5. Validate the MVP against civic transparency goals.

## Prompting Standards

- Use precise objectives and context.
- Prefer structured requests over open-ended prompts.
- Include system goals, audience, and expected output.
- Example: `Generate an API contract for budget allocation and project status endpoints in FastAPI.`

## Development Best Practices

- Keep communication transparent and documented.
- Align on public impact, data integrity, and accountability.
- Use small, testable increments for features.
- Review code and documentation early and often.
- Prioritize user trust and community engagement.
