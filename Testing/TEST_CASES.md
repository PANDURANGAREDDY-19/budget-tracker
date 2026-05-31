# Test Cases

| Test ID | Module          | Scenario                  | Expected Result               |
| ------- | --------------- | ------------------------- | ----------------------------- |
| TC001   | Dashboard       | Open Dashboard            | Dashboard loads successfully  |
| TC002   | Dashboard       | View all projects         | Projects displayed            |
| TC003   | Search          | Search valid Project ID   | Correct project shown         |
| TC004   | Search          | Search invalid Project ID | Error message shown           |
| TC005   | Project Details | Open project details      | Project information displayed |
| TC006   | Complaints      | View complaints           | Complaint records displayed   |
| TC007   | Audit           | View audit data           | Audit records displayed       |
| TC008   | API             | Valid API request         | Status 200                    |
| TC009   | API             | Invalid API request       | Status 404                    |
| TC010   | Chatbot         | Ask project status        | Correct response returned     |
| TC011   | Chatbot         | Ask budget details        | Budget information returned   |
| TC012   | Chatbot         | Invalid query             | Friendly error response       |
| TC013   | UI              | Mobile view               | Responsive layout             |
| TC014   | UI              | Tablet view               | Responsive layout             |
| TC015   | UI              | Desktop view              | Responsive layout             |
