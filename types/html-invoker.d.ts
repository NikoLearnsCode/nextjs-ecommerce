import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    command?: string;
    commandfor?: string;
    closedby?: 'any' | 'closerequest' | 'none' | string;
  }
}
