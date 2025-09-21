import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log('JWT callback:', { token, account, profile })
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token })
      if (token) {
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.idToken = token.idToken as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { user, account, profile })
      return true
    },
  },
  session: {
    strategy: 'jwt',
  },
}

