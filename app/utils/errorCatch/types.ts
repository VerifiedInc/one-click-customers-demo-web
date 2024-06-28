import { UserDto } from '@verifiedinc/core-types';

export type SeverityLevel =
  | 'fatal'
  | 'error'
  | 'warning'
  | 'log'
  | 'info'
  | 'debug';

export interface ErrorCatch {
  name: string;
  setUser<T>(user: T): any;
  sendMessage<T>(message: string, options: T): any;
  sendException(exception: any): any;
  sendFeedback(feedback: any): any;
}

export type CaptureMessageOptions = {
  status?: string | number;
  extra?: Record<string, any> & {
    email?: string;
    description?: string;
    isFeedback?: boolean;
  };
  stack?: string;
  error?: Error;
};

export interface ErrorCatchGateway {
  captureException(exception: any): void;
  captureMessage(message: string, options: CaptureMessageOptions): void;
  identifyUser(userOrEmail: UserDto | string): void;
}
