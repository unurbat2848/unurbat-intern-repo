import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  // Mock the TypeORM Repository
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          // Mock the TypeORM Repository using getRepositoryToken
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'John Doe',
        age: 25
      };

      const mockUser = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the repository methods
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User One',
          age: 30,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User Two',
          age: 25,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Mock the repository to return the users
      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
        age: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the repository to return the user
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      // Mock the repository to return null
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
        age: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the repository to return the user
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Jane Smith',
        age: 28
      };

      const mockUpdatedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Jane Smith',
        age: 28,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the repository methods
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(mockUpdatedUser);

      const result = await service.update(1, updateUserDto);

      expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      // Mock the repository delete method
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});