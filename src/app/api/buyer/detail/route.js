import { NextResponse } from 'next/server';
import { querys } from '@/src/app/lib/DbConnection';
import { verifyToken } from '@/src/app/lib/Token';

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        const auth = await verifyToken(req);
        const { decoded } = auth;
        let userMobile = decoded.mobile;

        if (decoded.role == 'buyer') {
            const allBuyer = await querys({
                query: `SELECT shop_name, shop_address, buyer_mobile FROM buyer_settings WHERE buyer_mobile = ?`,
                values: [userMobile]
            });

            return NextResponse.json({
                message: 'Buyers Detail listed successfully',
                status: 200,
                data: allBuyer
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
