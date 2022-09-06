import {withAuth} from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server";


export default withAuth(

    {
callbacks:{
    authorized({req}){
        const sessionToken = (req.cookies.get('next-auth.session-token'))
        if(sessionToken) {
            return true
        } 
        return false
    }
    
},
pages: {
    signIn: '/login',
    error: '/api/auth/error',
  }
}

);

export const config = {
    matcher: ['/exercises/:id/:path*','/'],
  }
