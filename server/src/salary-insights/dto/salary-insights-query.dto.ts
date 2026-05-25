import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SalaryInsightsQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  department?: string;
}
