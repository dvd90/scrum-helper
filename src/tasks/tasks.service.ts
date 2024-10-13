import { Injectable } from '@nestjs/common';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  findOne(id: string): Promise<Task> {
    return this.taskModel.findById(id).exec();
  }

  findAll(userId: string) {
    return this.taskModel.find({ userId }).exec();
  }

  // create(createTaskDto: CreateTaskDto) {
  //   return 'This action adds a new task';
  // }

  // update(id: number, updateTaskDto: UpdateTaskDto) {
  //   return `This action updates a #${id} task`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }
}
