import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import bcryptjs from 'bcryptjs';
import { EmailTemplate } from "@/components/Email/Welcome";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
    await connect();

    try {
        const { email, password } = await request.json();

        // Validate and format email address
        if (!email || !email.includes('@') || !email.includes('.')) {
            return NextResponse.json({
                status: 400,
                success: false,
                error: "Invalid email format"
            });
        }

        const user = await Label.findOne({ email });
        if (!user) {
            return NextResponse.json({
                status: 400,
                success: false,
                error: "User doesn't exist"
            });
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({
                success: false,
                status: 400,
                error: "Check your credentials"
            });
        }

        // Generate a new token for the session
        const tokenData = {
            id: user._id,
            username: user.username
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '5d' });

        // Send the welcome email to your own address for testing
        const { error } = await resend.emails.send({
            from: 'SwaLay India <swalay.care@talantoncore.in>',
            to: email,
            subject: 'Welcome to SwaLay!',
            react: EmailTemplate({ firstName: user.username }),
        });

        if (error) {
            console.error("Email sending error:", error);
            return NextResponse.json({
                status: 500,
                success: false,
                error: "Failed to send welcome email"
            });
        }

        const response = NextResponse.json({
            message: "Logged In Successfully",
            success: true,
            status: 200
        });

        // Clear any old tokens to avoid conflicts
        response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

        // Set the new token in cookies
        response.cookies.set("token", token, { httpOnly: true });

        return response;

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({
            error: error.message,
            success: false,
            status: 500
        });
    }
}