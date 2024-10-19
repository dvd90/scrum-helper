import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../openai/openai.service';
import { JiraService } from '../jira/jira.service';
import { PRDJiraConfig, PRDResponse } from 'src/interfaces/prd-task.interface';
import { ProductDocumentDocument } from 'src/product-documents/schemas/product-document.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../../tasks/schemas/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class PrdProcessingService {
  constructor(
    private openAiService: OpenAiService,
    private jiraService: JiraService,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async processPrdAndCreateTickets(
    config: PRDJiraConfig,
    prd: ProductDocumentDocument,
    toSync = true,
  ): Promise<any> {
    try {
      // Generate tasks from PRD using OpenAI
      const generatedTasks: PRDResponse =
        await this.openAiService.generateTasksFromPRD(config, prd.content);

      console.log(generatedTasks);

      // Create Jira tickets
      const createdTickets = [];
      const epicMap = new Map<string, string>(); // Map to store Epic summaries and their Jira keys
      const storyMap = new Map<string, string>();

      for (const prdTask of generatedTasks.tasks) {
        if (prdTask.type === 'Epic') {
          let jiraEpicKey;
          if (toSync) {
            jiraEpicKey = await this.jiraService.createEpic(
              config,
              prd.projectKey,
              prdTask.summary,
              prdTask.description,
            );
          }

          const epic = new this.taskModel({
            type: 'Epic',
            userId: prd.userId,
            productDocumentId: prd._id,
            key: jiraEpicKey,
            projectKey: prd.projectKey,
            summary: prdTask.summary,
            description: prdTask.description,
            jiraSynced: toSync,
          });
          await epic.save();
          epicMap.set(prdTask.summary, jiraEpicKey);
          createdTickets.push({
            type: 'Epic',
            key: jiraEpicKey,
            summary: prdTask.summary,
            dbId: epic._id,
          });
        } else if (prdTask.type === 'Story') {
          let jiraStoryKey;
          const epicKey = epicMap.get(prdTask.parentEpic);
          if (toSync) {
            jiraStoryKey = await this.jiraService.createStory(
              config,
              prd.projectKey,
              prdTask.summary,
              prdTask.description,
              epicKey,
            );
          }
          const task = new this.taskModel({
            type: prdTask.type,
            userId: prd.userId,
            productDocumentId: prd._id,
            key: jiraStoryKey,
            projectKey: prd.projectKey,
            summary: prdTask.summary,
            description: prdTask.description,
            epicKey: epicKey,
            jiraSynced: true,
          });
          await task.save();
          storyMap.set(prdTask.summary, jiraStoryKey);
          createdTickets.push({
            type: prdTask.type,
            key: jiraStoryKey,
            summary: prdTask.summary,
            epicKey,
            dbId: task._id,
          });
        } else if (prdTask.type === 'Task') {
          let jiraTaskKey;
          const storyKey = storyMap.get(prdTask.parentEpic);
          if (toSync) {
            jiraTaskKey = await this.jiraService.createTask(
              config,
              prd.projectKey,
              prdTask.summary,
              prdTask.description,
              storyKey,
            );
          }
          const task = new this.taskModel({
            type: prdTask.type,
            userId: prd.userId,
            productDocumentId: prd._id,
            key: jiraTaskKey,
            projectKey: prd.projectKey,
            summary: prdTask.summary,
            description: prdTask.description,
            epicKey: storyKey,
            jiraSynced: true,
          });
          await task.save();
          createdTickets.push({
            type: prdTask.type,
            key: jiraTaskKey,
            summary: prdTask.summary,
            epicKey: storyKey,
            dbId: task._id,
          });
        } else {
          console.warn(
            `Parent Epic "${prdTask.parentEpic}" not found for ${prdTask.type} "${prdTask.summary}"`,
          );
        }
      }
      return createdTickets;
    } catch (error) {
      console.error('Error processing PRD and creating tickets:', error);
      throw new Error('Failed to process PRD and create tickets');
    }
  }
}
