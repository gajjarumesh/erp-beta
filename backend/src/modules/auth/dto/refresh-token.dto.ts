import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh-token-string' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
