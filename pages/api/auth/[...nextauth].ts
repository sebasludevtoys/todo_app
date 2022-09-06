import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import {prisma} from '../../../lib/prisma'

export const authOptions:NextAuthOptions = {
  session:{
    strategy:"jwt"
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }
    
    ),
  ],
  callbacks:{

    // jwt(params) {
    //     if(params.user) {
    //       params.token.email = params.user.email
    //     }
    //     return params.token
    // },
  }
}

export default NextAuth(authOptions)