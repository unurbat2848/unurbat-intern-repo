import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Controller('encryption-test')
export class EncryptionTestController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Post('create-user')
  async createUserWithEncryptedData(@Body() userData: {
    email: string;
    name: string;
    age?: number;
    phoneNumber?: string;
    socialSecurityNumber?: string;
  }) {
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    
    return {
      message: 'User created with encrypted sensitive data',
      user: savedUser,
      note: 'phoneNumber and socialSecurityNumber are encrypted in the database'
    };
  }

  @Get('users')
  async getAllUsers() {
    const users = await this.userRepository.find();
    return {
      message: 'Retrieved users with decrypted sensitive data',
      users,
      note: 'TypeORM automatically decrypts the fields when reading from database'
    };
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return { message: 'User not found' };
    }
    
    return {
      message: 'User retrieved with decrypted data',
      user,
      encryption: {
        phoneNumber: user.phoneNumber ? 'Decrypted successfully' : 'No phone number',
        socialSecurityNumber: user.socialSecurityNumber ? 'Decrypted successfully' : 'No SSN'
      }
    };
  }

  @Get('encryption-info')
  getEncryptionInfo() {
    return {
      message: 'TypeORM Encryption Information',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      encryptedFields: ['phoneNumber', 'socialSecurityNumber'],
      howItWorks: {
        storage: 'Data is encrypted before saving to database',
        retrieval: 'Data is decrypted automatically when reading from database',
        security: 'Even if database is compromised, encrypted fields remain protected'
      },
      keyManagement: 'Encryption key is stored in environment variables'
    };
  }
}