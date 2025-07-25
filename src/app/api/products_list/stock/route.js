import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        // Verify the token
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const role = decoded.role;
        const user = decoded.mobile;

        if (role == 'buyer') {
            const query = await querys({
                query: `SELECT * FROM products_list WHERE mobile = ?;`,
                values: [user]
            });

            // Return the inventory data
            return NextResponse.json({
                message: 'Products Listed successfully',
                data: query,
                status: 200
            }, { status: 200 });

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