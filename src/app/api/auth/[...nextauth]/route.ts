import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
const handler = NextAuth({
    providers :[
        GoogleProvider({
            clientId : process.env.AUTH_GOOGLE_ID || '',
            clientSecret : process.env.AUTH_GOOGLE_SECRET || ''
        }),
        GithubProvider({
            clientId : process.env.GITHUB_ID || '',
            clientSecret : process.env.GITHUB_SECRET || ''

        })
    ]
  })
  
  export { handler as GET, handler as POST }

// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "@/lib/prisma";

// const handler = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID!,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }: any) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//       }
//       return token;
//     },
//     async session({ session, token }: any) {
//       if (token && session.user) {
//         session.user.id = token.id;
//         session.user.email = token.email!;
//         session.user.name = token.name!;
//       }
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };