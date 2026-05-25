import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';

describe('EmployeeService', () => {
  let service: EmployeeService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
  };

  const employee: Employee = {
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    country: 'India',
    currency: 'INR',
    salary: 500_000,
    joiningDate: new Date('2020-01-01'),
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2020-01-01'),
  };

  const createDto: CreateEmployeeDto = {
    fullName: 'John Doe',
    email: 'john@example.com',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    country: 'India',
    salary: 500_000,
    joiningDate: '2020-01-01',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: EmployeeRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates and returns a new employee', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(employee);
      mockRepository.save.mockResolvedValue(employee);

      await expect(service.create(createDto)).resolves.toEqual(employee);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(createDto.email);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        currency: 'INR',
        isActive: true,
        joiningDate: new Date(createDto.joiningDate),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(employee);
    });

    it('throws ConflictException when email already exists', async () => {
      mockRepository.findByEmail.mockResolvedValue(employee);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns paginated employees', async () => {
      mockRepository.findAll.mockResolvedValue({
        data: [employee],
        total: 25,
      });

      await expect(service.findAll(2, 10)).resolves.toEqual({
        data: [employee],
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
      });

      expect(mockRepository.findAll).toHaveBeenCalledWith(2, 10);
    });
  });
});
