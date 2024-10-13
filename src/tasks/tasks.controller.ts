import { Controller, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // @Post()
  // create(@Body() createTaskDto: CreateTaskDto) {
  //   return this.tasksService.create(createTaskDto);
  // }

  @Get()
  findAll(@User() userReq: any) {
    return this.tasksService.findAll(userReq.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.tasksService.update(+id, updateTaskDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tasksService.remove(+id);
  // }
}
