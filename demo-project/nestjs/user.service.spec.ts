import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', () => {
      const users = service.getAllUsers();
      expect(users).toBeInstanceOf(Array);
      expect(users).toHaveLength(3);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('email');
    });
  });

  describe('findUserById', () => {
    it('should return user when found', () => {
      const user = service.findUserById(1);
      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
      expect(user?.name).toBe('Alice');
      expect(user?.email).toBe('alice@example.com');
    });

    it('should return undefined when user not found', () => {
      const user = service.findUserById(999);
      expect(user).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', () => {
      const initialCount = service.getAllUsers().length;
      const newUser = service.createUser('Dave', 'dave@example.com');
      
      expect(newUser).toBeDefined();
      expect(newUser.id).toBe(initialCount + 1);
      expect(newUser.name).toBe('Dave');
      expect(newUser.email).toBe('dave@example.com');
      
      const allUsers = service.getAllUsers();
      expect(allUsers).toHaveLength(initialCount + 1);
      expect(allUsers).toContainEqual(newUser);
    });
  });
});