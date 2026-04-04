import {DefaultSession} from 'next-auth';

/** Keeps DrizzleAdapter and NextAuth on the same `AdapterUser` shape (custom columns). */
declare module '@auth/core/types' {
  interface User {
    role: number;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: number;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: number;
  }
}

export type AdapterAccount = {
  type: 'oauth' | 'oidc' | 'email';
};
