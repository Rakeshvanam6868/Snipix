import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
const handler = NextAuth({
    providers :[
        GoogleProvider({
            clientId : process.env.GOOGLE_ID || process.env.AUTH_GOOGLE_ID || '',
            clientSecret : process.env.GOOGLE_SECRET || process.env.AUTH_GOOGLE_SECRET || ''
        }),
        GithubProvider({
            clientId : process.env.GITHUB_ID || '',
            clientSecret : process.env.GITHUB_SECRET || ''

        })
    ],
    secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt", // Use JWT instead of database
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === "development",
  })
  
  export { handler as GET, handler as POST }

