export interface PRDTask {
  type: 'Epic' | 'Task';
  summary: string;
  description: string;
  parentEpic?: string; // Optional for Epics
}

export interface PRDResponse {
  tasks: PRDTask[];
}

export interface OpenAIConfig {
  openAIKey: string;
}

export interface PRDJiraConfig extends OpenAIConfig {
  jiraDomain: string;
  jiraEmail: string;
  jiraApiKey: string;
}
