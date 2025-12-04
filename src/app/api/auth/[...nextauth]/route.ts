import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await fetch("http://localhost:3001/users/refresh", {
    method: "POST",
    headers: {
      authorization: `Refresh ${token.backendToken.refreshToken}`,
    },
  });

  if (!res.ok) {
    console.log("Refresh token expired or invalid - logging out");
    throw new Error("Refresh token expired or invalid");
  }

  console.log("refreshed");
  const response = await res.json();

  return { ...token, backendToken: response };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;
        const res = await fetch("http://localhost:3001/users/signin", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status !== 200 && res.status !== 201) {
          console.log(res.statusText);

          return null;
        }
        const user = await res.json();
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      console.log(token, user);
      if (user) return { ...token, ...user };

      if (new Date().getTime() < token.backendToken.expiresIn) return token;

      try {
        return await refreshToken(token);
      } catch (error) {
        console.log("Failed to refresh token:", error);
        // Return token with error flag instead of null
        return { ...token, error: "RefreshTokenExpired" } as JWT;
      }
    },

    async session({ token, session }) {
      // If token has error, return null to force sign out
      if (token.error) {
        return null as any;
      }

      session.user = token.user;
      session.backendToken = token.backendToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
