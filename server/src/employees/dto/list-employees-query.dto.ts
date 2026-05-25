import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

export class ListEmployeesQueryDto extends PaginationQueryDto {
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
