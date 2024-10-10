import { Injectable } from '@nestjs/common';
import { OpenAiService } from '../openai/openai.service';
import { JiraService } from '../jira/jira.service';
import { PRDJiraConfig, PRDResponse } from 'src/interfaces/prd-task.interface';
import { ProductDocumentDocument } from 'src/product-documents/schemas/product-document.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from 'src/product-documents/schemas/task.schema';
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
  ): Promise<any> {
    try {
      // Generate tasks from PRD using OpenAI
      const generatedTasks: PRDResponse =
        await this.openAiService.generateTasksFromPRD(config, prd.content);

      console.log(generatedTasks);

      // Create Jira tickets
      const createdTickets = [];
      const epicMap = new Map<string, string>(); // Map to store Epic summaries and their Jira keys

      for (const prdTask of generatedTasks.tasks) {
        if (prdTask.type === 'Epic') {
          const jiraEpicKey = await this.jiraService.createEpic(
            config,
            prd.projectKey,
            prdTask.summary,
            prdTask.description,
          );
          const epic = new this.taskModel({
            type: 'Epic',
            userId: prd.userId,
            productDocumentId: prd._id,
            key: jiraEpicKey,
            projectKey: prd.projectKey,
            summary: prdTask.summary,
            description: prdTask.description,
          });
          await epic.save();
          epicMap.set(prdTask.summary, jiraEpicKey);
          createdTickets.push({
            type: 'Epic',
            key: jiraEpicKey,
            summary: prdTask.summary,
            dbId: epic._id,
          });
        } else if (
          (prdTask.type === 'Task' || prdTask.type === 'Story') &&
          prdTask.parentEpic
        ) {
          const epicKey = epicMap.get(prdTask.parentEpic);
          if (epicKey) {
            const jiraTaskKey = await this.jiraService.createTask(
              config,
              prd.projectKey,
              prdTask.summary,
              prdTask.description,
              epicKey,
            );
            const task = new this.taskModel({
              type: prdTask.type,
              userId: prd.userId,
              productDocumentId: prd._id,
              key: jiraTaskKey,
              projectKey: prd.projectKey,
              summary: prdTask.summary,
              description: prdTask.description,
              epicKey: epicKey,
            });
            await task.save();
            createdTickets.push({
              type: prdTask.type,
              key: jiraTaskKey,
              summary: prdTask.summary,
              epicKey,
              dbId: task._id,
            });
          } else {
            console.warn(
              `Parent Epic "${prdTask.parentEpic}" not found for ${prdTask.type} "${prdTask.summary}"`,
            );
          }
        }
      }

      // for (const task of generatedTasks.tasks) {
      //   if (task.type === 'Epic') {
      //     const epicKey = await this.jiraService.createEpic(
      //       config,
      //       prd.projectKey,
      //       task.summary,
      //       task.description,
      //     );
      //     epicMap.set(task.summary, epicKey);
      //     createdTickets.push({
      //       type: 'Epic',
      //       key: epicKey,
      //       summary: task.summary,
      //     });
      //   } else if (task.type === 'Task' && task.parentEpic) {
      //     const epicKey = epicMap.get(task.parentEpic);
      //     if (epicKey) {
      //       const taskKey = await this.jiraService.createTask(
      //         config,
      //         prd.projectKey,
      //         task.summary,
      //         task.description,
      //         epicKey,
      //       );
      //       createdTickets.push({
      //         type: 'Task',
      //         key: taskKey,
      //         summary: task.summary,
      //         epicKey,
      //       });
      //     } else {
      //       console.warn(
      //         `Parent Epic "${task.parentEpic}" not found for task "${task.summary}"`,
      //       );
      //     }
      //   }
      // }

      return createdTickets;
    } catch (error) {
      console.error('Error processing PRD and creating tickets:', error);
      throw new Error('Failed to process PRD and create tickets');
    }
  }
}
