import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: number;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      accountStatus: string;
      created_chatbots: [];
      preferences: {};
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    backendToken: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      _id: number;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      accountStatus: string;
      created_chatbots: [];
      preferences: {};
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    backendToken: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    error?: string;
  }
}
