import prisma from "@/prisma/prismaClient";
import { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SEC as string,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.userId = token.sub;
        token.name = user?.name;
        token.email = user?.email;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      console.log(session, 'session in authOptions');
      const existingUser = await prisma.user.findUnique({
        where: {
          email: token.email as string,
        },
      });
      console.log(existingUser, 'existing user in authOptions');
      // If user does not exist, create a new user
      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: {
            id: token.userId as string,
            name: token.name as string,
            email: token.email as string,
          },
        });

        session.user.id = newUser.id;
      } else {
        session.user.id = existingUser.id;
      }

      return session;
    },
  },
};
