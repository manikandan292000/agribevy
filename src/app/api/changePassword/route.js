import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export const dynamic = "force-dynamic";

export async function PUT(req) {
    try {
        // Verify the token
        const auth = await verifyToken(req);
       

        // get user details
        const user = await req.json()

        const { decoded } = auth;
        const userId = decoded.userId;

        const rows = await querys({
            query: `SELECT * FROM users WHERE user_id = ?`,
            values: [userId]
        });

        // If user does not exist
        if (rows.length === 0) {
            return NextResponse.json({
                message: 'No user found with this Id',
                status: 404
            }, { status: 404 });
        }

        const users = rows[0];

        // Compare password
        const match = await bcrypt.compare(user.password, users.user_pwd);
        const salt = await bcrypt.genSalt(10)
        const hashPW = await bcrypt.hash(user.newPassword, salt)
        if (match) {
            await querys({
                query: `UPDATE users SET user_pwd = ? WHERE user_id = ?`,
                values: [hashPW, userId]
            });
        } else {
            return NextResponse.json({
                message: 'Incorrect password',
                status: 400
            }, { status: 400 });
        }

        return NextResponse.json({
            message: 'Password Changed successfully',
            status: 200
        }, { status: 200 })
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}