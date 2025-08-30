import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async seedUsers(): Promise<User[]> {
    const users = [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        age: 28,
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        age: 32,
      },
      {
        email: 'mike.wilson@example.com',
        name: 'Mike Wilson',
        age: 25,
      },
    ];

    const savedUsers = [];
    for (const userData of users) {
      const existingUser = await this.usersRepository.findOne({ 
        where: { email: userData.email } 
      });
      
      if (!existingUser) {
        const user = this.usersRepository.create(userData);
        savedUsers.push(await this.usersRepository.save(user));
      } else {
        savedUsers.push(existingUser);
      }
    }

    return savedUsers;
  }

  async seedTasks(): Promise<Task[]> {
    const tasks = [
      {
        title: 'Complete project proposal',
        description: 'Write and submit the Q1 project proposal',
        priority: 'high',
        completed: false,
        dueDate: new Date('2024-02-01'),
      },
      {
        title: 'Review team performance',
        description: 'Conduct quarterly performance reviews',
        priority: 'medium',
        completed: true,
        dueDate: new Date('2024-01-15'),
      },
      {
        title: 'Update documentation',
        description: 'Update API documentation for new endpoints',
        priority: 'low',
        completed: false,
        dueDate: new Date('2024-02-15'),
      },
      {
        title: 'Prepare presentation',
        description: 'Create slides for client meeting',
        priority: 'high',
        completed: false,
        dueDate: new Date('2024-01-20'),
      },
    ];

    const savedTasks = [];
    for (const taskData of tasks) {
      const existingTask = await this.tasksRepository.findOne({ 
        where: { title: taskData.title } 
      });
      
      if (!existingTask) {
        const task = this.tasksRepository.create(taskData);
        savedTasks.push(await this.tasksRepository.save(task));
      } else {
        savedTasks.push(existingTask);
      }
    }

    return savedTasks;
  }

  async seedAll(): Promise<{ users: User[]; tasks: Task[] }> {
    console.log('🌱 Starting database seeding...');
    
    const users = await this.seedUsers();
    console.log(`✅ Seeded ${users.length} users`);
    
    const tasks = await this.seedTasks();
    console.log(`✅ Seeded ${tasks.length} tasks`);
    
    console.log('🎉 Database seeding completed!');
    
    return { users, tasks };
  }
}