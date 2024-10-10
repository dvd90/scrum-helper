import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';
import { PRDJiraConfig, PRDResponse } from 'src/interfaces/prd-task.interface';

@Injectable()
export class OpenAiService {
  async generateTasksFromPRD(
    config: PRDJiraConfig,
    prdContent: string,
  ): Promise<PRDResponse> {
    const openai = new OpenAI({
      apiKey: config.openAIKey,
    });

    const prompt = `Given the following Product Requirements Document (PRD), generate a list of Epics and Tasks suitable for creation in Jira. Format the output as a JSON array where each item has a 'type' (either 'Epic' or 'Task'), a 'summary' (a brief title), and a 'description'. Tasks should be associated with their parent Epic.\nPRD Content: ${prdContent}\nPlease provide a structured output that can be easily parsed and sent to the Jira API.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You extract epics and tasks from a PRD into structured JSON data.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'prd_tasks_schema',
            schema: {
              type: 'object',
              properties: {
                tasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: {
                        description:
                          'Type of the work item, either Epic or Task',
                        type: 'string',
                        enum: ['Epic', 'Task'],
                      },
                      summary: {
                        description: 'Brief title of the work item',
                        type: 'string',
                      },
                      description: {
                        description: 'Detailed description of the work item',
                        type: 'string',
                      },
                      parentEpic: {
                        description:
                          'For tasks, this references the associated epic',
                        type: 'string',
                        nullable: true,
                      },
                    },
                    required: ['type', 'summary', 'description'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['tasks'],
              additionalProperties: false,
            },
          },
        },
      });

      return JSON.parse(response.choices[0].message.content) as PRDResponse;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to generate tasks from PRD');
    }
  }
}
