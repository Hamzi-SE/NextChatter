import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
	async function middleware(req) {
		const pathname = req.nextUrl.pathname

		// Manage route protection
		const isAuth = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
		const isLoginPage = pathname.startsWith('/login')

		const sensitiveRoutes = ['/dashboard']
		const isAccessingSensitiveRoute = sensitiveRoutes.some(route => pathname.startsWith(route))

		if (isLoginPage) {
			if (isAuth) {
				return NextResponse.redirect(new URL('/dashboard', req.url))
			}

			return NextResponse.next()
		}

		if (!isAuth && isAccessingSensitiveRoute) {
			return NextResponse.redirect(new URL('/login', req.url))
		}

		if (isAuth && pathname === '/') {
			return NextResponse.redirect(new URL('/dashboard', req.url))
		}
	},
	{
		// Include callbacks to handle infinite redirects (works with `withAuth` and is a workaround for now, mentioned in the docs)
		callbacks: {
			async authorized() {
				return true
			},
		},
	}
)

export const config = {
	matcher: ['/', '/login', '/dashboard/:path*'],
}
