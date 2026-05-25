import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsOptional()
  @IsString()
  department?: string | null;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsNumber()
  @Min(0)
  salary: number;

  @IsDateString()
  joiningDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
