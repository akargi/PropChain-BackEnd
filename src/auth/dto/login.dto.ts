import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    description: 'Wallet address for Web3 authentication',
  })
  @IsString()
  @IsOptional()
  walletAddress?: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'User password (required if using email)',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'signature_from_wallet',
    description: 'Signature from wallet for Web3 authentication',
  })
  @IsString()
  @IsOptional()
  signature?: string;
}