import { IsEmail, IsNotEmpty, IsString, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({ example: 'uuid-of-tenant' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}
