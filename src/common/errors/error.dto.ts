import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Invalid input data',
    description: 'Human-readable error message',
  })
  message: string;

  @ApiProperty({
    example: 'VALIDATION_ERROR',
    description: 'Machine-readable error code',
  })
  code: string;

  @ApiProperty({
    example: '2026-01-22T14:46:55Z',
    description: 'Timestamp when the error occurred',
  })
  timestamp: string;

  @ApiProperty({
    example: '/api/v1/resource',
    description: 'The API path that triggered the error',
  })
  path: string;

  @ApiProperty({
    example: { field: 'email', reason: 'must be a valid email' },
    description: 'Additional error details (optional)',
    required: false,
  })
  details?: any;

  @ApiProperty({
    example: 'Stack trace',
    description: 'Error stack trace (only in development environment)',
    required: false,
  })
  stack?: string;
}
