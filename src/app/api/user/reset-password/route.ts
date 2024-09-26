import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Label from '@/models/Label';
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    await connect();

    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({
                status: 400,
                success: false,
                error: "Invalid request"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
        if (!decoded || typeof decoded === "string") {
            return NextResponse.json({
                status: 400,
                success: false,
                error: "Invalid token"
            });
        }

        const user = await Label.findById((decoded as any).id);
        if (!user) {
            return NextResponse.json({
                status: 400,
                success: false,
                error: "User not found"
            });
        }

        // Hash the new password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;

        // Clear all cookies to ensure all sessions are logged out
        const response = NextResponse.json({
            success: true,
            status: 200,
            message: "Password reset successfully. Please log in again."
        });

        // Clear tokens (for multiple sessions if applicable)
        response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
        response.cookies.set("refreshToken", "", { httpOnly: true, expires: new Date(0) }); // If you use refresh tokens, clear them too.

        await user.save();

        return response;

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({
            status: 500,
            success: false,
            error: error.message
        });
    }
}
