import { ConflictException, NotFoundException } from '@nestjs/common';
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
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

      expect(mockRepository.findAll).toHaveBeenCalledWith(2, 10, {});
    });

    it('passes optional filters to the repository', async () => {
      mockRepository.findAll.mockResolvedValue({
        data: [employee],
        total: 1,
      });

      const filters = {
        country: 'India',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
      };

      await service.findAll(1, 10, filters);

      expect(mockRepository.findAll).toHaveBeenCalledWith(1, 10, filters);
    });
  });

  describe('findById', () => {
    it('returns an employee when found', async () => {
      mockRepository.findById.mockResolvedValue(employee);

      await expect(service.findById(1)).resolves.toEqual(employee);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when employee does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = { fullName: 'Jane Doe' };

    it('updates and returns the employee when found', async () => {
      const updatedEmployee = { ...employee, fullName: 'Jane Doe' };
      mockRepository.findById.mockResolvedValue(employee);
      mockRepository.update.mockResolvedValue(updatedEmployee);

      await expect(service.update(1, updateDto)).resolves.toEqual(
        updatedEmployee,
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('throws NotFoundException when employee does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(99, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('throws ConflictException when email is taken by another employee', async () => {
      const otherEmployee = { ...employee, id: 2, email: 'jane@example.com' };
      mockRepository.findById.mockResolvedValue(employee);
      mockRepository.findByEmail.mockResolvedValue(otherEmployee);

      await expect(
        service.update(1, { email: 'jane@example.com' }),
      ).rejects.toThrow(ConflictException);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes the employee when found', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await expect(service.delete(1)).resolves.toBeUndefined();

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when employee does not exist', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.delete(99)).rejects.toThrow(NotFoundException);
    });
  });
});
