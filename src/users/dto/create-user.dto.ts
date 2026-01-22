import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'User password',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    description: 'Wallet address (optional)',
  })
  @IsOptional()
  @IsString()
  walletAddress?: string;
}