import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Handle all exceptions with a unified approach
    this.handleHttpException(exception, response, status, exceptionResponse);
  }

  private handleHttpException(
    exception: HttpException, 
    response: Response, 
    status: number, 
    exceptionResponse: string | object
  ) {
    let message: string;
    let details: Record<string, string[]> = {};

    // Handle validation errors (BadRequestException with validation errors)
    if (exception instanceof HttpException && status === 400) {
      // Check if it's a validation error with detailed structure
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const errors = (exceptionResponse as any).message;
        
        // If it's an array of validation errors
        if (Array.isArray(errors)) {
          // Check if these are ValidationError objects or plain strings
          const isValidationErrors = errors.some(error => 
            typeof error === 'object' && error !== null && ('property' in error || 'constraints' in error)
          );
          
          if (isValidationErrors) {
            // Handle detailed validation errors
            details = this.formatValidationErrors(errors);
            message = 'Validation failed';
            response
              .status(status)
              .json({
                statusCode: status,
                error: 'Bad Request',
                message,
                details,
              });
            return;
          } else {
            // Handle simple string errors (like the ones we saw)
            details = this.parseStringErrors(errors);
            message = 'Validation failed';
            response
              .status(status)
              .json({
                statusCode: status,
                error: 'Bad Request',
                message,
                details,
              });
            return;
          }
        }
      }
    }

    // Handle all exceptions (including those with explicit details) uniformly
    if (typeof exceptionResponse === 'string') {
      // Simple string message - no details
      message = exceptionResponse;
      details = {};
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      // Object with message and possibly details
      message = (exceptionResponse as any).message || exception.message;
      
      // Check if there are explicit details provided
      if ((exceptionResponse as any).details && typeof (exceptionResponse as any).details === 'object') {
        // Use the provided details object directly
        const providedDetails = (exceptionResponse as any).details;
        Object.keys(providedDetails).forEach(key => {
          const value = providedDetails[key];
          if (Array.isArray(value)) {
            details[key] = value.map(item => String(item));
          } else {
            details[key] = [String(value)];
          }
        });
      } else {
        // No explicit details - empty details object
        details = {};
      }
    } else {
      // Fallback to exception message
      message = exception.message;
      details = {};
    }

    // Standardize error type names
    let errorType = 'Error';
    switch (status) {
      case 400:
        errorType = 'Bad Request';
        break;
      case 401:
        errorType = 'Unauthorized';
        break;
      case 403:
        errorType = 'Forbidden';
        break;
      case 404:
        errorType = 'Not Found';
        break;
      case 409:
        errorType = 'Conflict';
        break;
      default:
        errorType = 'Error';
    }

    response
      .status(status)
      .json({
        statusCode: status,
        error: errorType,
        message: Array.isArray(message) ? message[0] : message,
        details
      });
  }

  private formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    
    errors.forEach(error => {
      if (error.property && error.constraints) {
        result[error.property] = Object.values(error.constraints);
      }
      
      // Handle nested errors
      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatValidationErrors(error.children);
        Object.keys(nestedErrors).forEach(key => {
          const propertyKey = error.property ? `${error.property}.${key}` : key;
          result[propertyKey] = nestedErrors[key];
        });
      }
    });
    
    return result;
  }

  private parseStringErrors(errors: string[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    
    errors.forEach(error => {
      // Try to parse structured error messages
      // Format: "property should not exist" or "property must be a string"
      const match = error.match(/^([a-zA-Z0-9_]+) (.+)$/);
      
      if (match) {
        const field = match[1];
        const message = match[2];
        
        if (!result[field]) {
          result[field] = [];
        }
        
        result[field].push(message);
      } else {
        // For unstructured errors, add to a general key
        if (!result['general']) {
          result['general'] = [];
        }
        result['general'].push(error);
      }
    });
    
    return result;
  }
}