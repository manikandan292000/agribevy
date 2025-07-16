import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const userMobile = decoded.mobile;
        const customer = new URL(req.url).pathname.split('/').filter(Boolean).pop();

        if (decoded.role === 'buyer') {
            const result = await querys({
                query: `SELECT * FROM customers WHERE buyer_mobile = ? AND cust_mobile = ?;`,
                values: [userMobile, customer]
            });

            if (result.length > 0) {
                return NextResponse.json({
                    message: 'Customer already exists',
                    status: 200,
                    data: result
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    message: 'Customer does not exist',
                    status: 404,
                    data: []
                }, { status: 404 });
            }
        } else {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}
