import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import { ErrorCode } from './error.codes';
import { ErrorResponseDto } from './error.dto';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let code: string;
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        code = this.mapHttpStatusToErrorCode(status);
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        code = (exceptionResponse as any).code || this.mapHttpStatusToErrorCode(status);
        details = (exceptionResponse as any).errors || (exceptionResponse as any).details;
        
        // Handle validation errors from ValidationPipe
        if (status === HttpStatus.BAD_REQUEST && Array.isArray((exceptionResponse as any).message)) {
          message = 'Validation failed';
          details = (exceptionResponse as any).message;
          code = ErrorCode.VALIDATION_ERROR;
        }
      } else {
        message = exception.message;
        code = this.mapHttpStatusToErrorCode(status);
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      code = ErrorCode.INTERNAL_SERVER_ERROR;
      
      // Log unhandled exceptions
      const error = exception instanceof Error ? exception : new Error(String(exception));
      this.loggerService.logError(error, AppExceptionFilter.name, (request as any).user?.id);
    }

    const errorResponse: ErrorResponseDto = {
      statusCode: status,
      message,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
      details,
      ...(this.configService.get('NODE_ENV') === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // Log the error using the existing security event logger
    this.logSecurityEvent(exception, request, status, code);

    response.status(status).json(errorResponse);
  }

  private mapHttpStatusToErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return ErrorCode.UNPROCESSABLE_ENTITY;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return ErrorCode.INTERNAL_SERVER_ERROR;
      default:
        return 'UNKNOWN_ERROR';
    }
  }

  private logSecurityEvent(exception: unknown, request: Request, status: number, code: string): void {
    const userId = (request as any).user?.id;
    const ip = request.ip || request.connection.remoteAddress;

    if (status >= 400 && status < 500) {
      this.loggerService.logSecurityEvent(
        'api_error',
        {
          message: exception instanceof Error ? exception.message : String(exception),
          status,
          code,
          url: request.url,
          method: request.method,
        },
        userId,
        ip,
      );
    }
  }
}
