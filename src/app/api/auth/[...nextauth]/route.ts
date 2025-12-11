import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshToken(token: JWT): Promise<JWT> {
  console.log("🔄 Starting token refresh...");

  const res = await fetch("http://localhost:3001/users/refresh", {
    method: "POST",
    headers: {
      authorization: `Refresh ${token.backendToken.refreshToken}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Refresh failed:", res.status, errorText);
    throw new Error("Refresh token expired or invalid");
  }

  const response = await res.json();
  console.log("✅ Token refreshed successfully");

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

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) return { ...token, ...user };

      // Handle manual session updates (from email-unverified page polling)
      if (trigger === "update") {
        const accessToken = token.backendToken?.accessToken;

        if (!accessToken) {
          console.error("❌ No access token found in token");
          return { ...token, error: "No access token found" } as JWT;
        }

        try {
          const response = await fetch("http://localhost:3001/users/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error("❌ Failed to fetch user data:", response.status);
            return token; // Return existing token on error
          }

          const userData = await response.json();

          // Backend might return array or single object
          const user = Array.isArray(userData) ? userData[0] : userData;

          console.log("✅ User data updated:", user?.accountStatus);
          token.user = user;

          return token;
        } catch (error) {
          console.error("❌ Error updating user data:", error);
          return token; // Return existing token on error
        }
      }

      // Safety check: if no backendToken, return as-is
      if (!token.backendToken?.expiresIn) return token;

      if (new Date().getTime() < token.backendToken.expiresIn - 5000)
        return token;

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
