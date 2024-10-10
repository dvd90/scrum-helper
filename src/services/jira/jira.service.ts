import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PRDJiraConfig } from 'src/interfaces/prd-task.interface';

@Injectable()
export class JiraService {
  private getAuthHeaders(config: PRDJiraConfig) {
    const { jiraEmail, jiraApiKey } = config;

    return {
      Authorization: `Basic ${Buffer.from(
        `${jiraEmail}:${jiraApiKey}`,
      ).toString('base64')}`,
      'Content-Type': 'application/json',
    };
  }

  private convertToADF(content: string): any {
    return {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: content,
            },
          ],
        },
      ],
    };
  }

  private makeJiraApiUrl(domain: string) {
    return `https://${domain}.atlassian.net/rest/api/3`;
  }

  async createEpic(
    config: PRDJiraConfig,
    projectKey: string,
    summary: string,
    description: string,
  ): Promise<string> {
    const { jiraDomain } = config;
    const jiraApiUrl = this.makeJiraApiUrl(jiraDomain);

    const response = await axios.post(
      `${jiraApiUrl}/issue`,
      {
        fields: {
          project: { key: projectKey },
          summary,
          description: this.convertToADF(description),
          issuetype: { name: 'Epic' },
        },
      },
      { headers: this.getAuthHeaders(config) },
    );
    return response.data.key;
  }

  async createTask(
    config: PRDJiraConfig,
    projectKey: string,
    summary: string,
    description: string,
    epicKey: string,
  ): Promise<string> {
    const { jiraDomain } = config;
    const jiraApiUrl = this.makeJiraApiUrl(jiraDomain);

    const response = await axios.post(
      `${jiraApiUrl}/issue`,
      {
        fields: {
          project: { key: projectKey },
          summary,
          description: this.convertToADF(description),
          issuetype: { name: 'Task' },
          parent: { key: epicKey },
        },
      },
      { headers: this.getAuthHeaders(config) },
    );
    return response.data.key;
  }
}
