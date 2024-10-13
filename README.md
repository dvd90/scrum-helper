# SCRUM Helper

SCRUM Helper is an innovative tool designed to streamline the process of creating Jira tickets from Product Requirement Documents (PRDs) using AI technology. By automating the breakdown of PRDs into Epics, Stories, and Tasks, SCRUM Helper saves time and ensures consistency in your agile workflow.

## Features

- AI-powered analysis of PRDs
- Automatic generation of Jira tickets (Epics, Stories, Tasks)
- Direct integration with Jira API
- User-friendly interface for uploading PRDs and reviewing generated tickets
- Customizable ticket templates to match your team's style

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/scrum-helper.git
   ```

2. Navigate to the project directory:

   ```
   cd scrum-helper
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   OPENAI_API_KEY=your_openai_api_key
   JIRA_API_URL=https://your-domain.atlassian.net/rest/api/3
   JIRA_EMAIL=your_jira_email@example.com
   JIRA_API_TOKEN=your_jira_api_token
   JIRA_PROJECT_KEY=YOUR_PROJECT_KEY
   MONGODB_URI=your_mongodb_connection_string
   ```

5. Start the application:
   ```
   npm run start
   ```

## Usage

1. Navigate to `http://localhost:3000` in your web browser.
2. Log in with your credentials.
3. Upload your PRD document or paste its content into the provided text area.
4. Click "Generate Tickets" to start the AI analysis.
5. Review the generated tickets and make any necessary adjustments.
6. Click "Push to Jira" to create the tickets in your Jira project.

## API Endpoints

- `POST /api/product-documents`: Create a new product document
- `GET /api/product-documents`: Retrieve all product documents
- `GET /api/product-documents/:id`: Retrieve a specific product document
- `PATCH /api/product-documents/:id`: Update a product document
- `DELETE /api/product-documents/:id`: Delete a product document
- `POST /api/product-documents/:id/process`: Process a product document and generate Jira tickets

## Contributing

We welcome contributions to SCRUM Helper! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

## Roadmap

- Implement machine learning to improve ticket generation based on user feedback
- Add support for multiple project management tools beyond Jira
- Develop a plugin for direct integration with popular text editors

## Acknowledgements

- OpenAI for providing the GPT model used in this project
- Atlassian for the Jira API
- All contributors who have helped to build and improve SCRUM Helper

---

SCRUM Helper - Transforming PRDs into actionable tickets with the power of AI.
