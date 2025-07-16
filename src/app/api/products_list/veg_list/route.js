
import { querys } from '@/src/app/lib/DbConnection';
import { verifyToken } from '@/src/app/lib/Token';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        // Verify the token
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const role = decoded.role;
        const user = decoded.mobile;

        if (role == 'buyer') {
            const query = await querys({
                query: `SELECT DISTINCT v.veg_name, v.veg_id, v.tamil_name
                        FROM products_list p
                        JOIN veg_list v ON p.veg_name = v.veg_name
                        WHERE p.mobile = ?`,
                values: [user]
            });

            // Return the inventory data
            return NextResponse.json({
                message: 'Veg Listed successfully',
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
