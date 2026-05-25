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
      mockRepository.create.mockReturnValue(employee);
      mockRepository.save.mockResolvedValue(employee);

      await expect(service.create(createDto)).resolves.toEqual(employee);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        currency: 'INR',
        isActive: true,
        joiningDate: new Date(createDto.joiningDate),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(employee);
    });
  });
});
