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
            
            const res = await querys({
                query: `SELECT t.quantity,t.veg_name,t.buyer_status,t.buyer_amount,t.created_at,u.user_name AS marketer_name FROM transactions t JOIN users u ON t.marketer_mobile = u.user_mobile WHERE t.buyer_mobile = ? ORDER BY t.created_at DESC;`,
                values: [userMobile]
            });
            return NextResponse.json({
                message: 'Buyer details listed successfully',
                status: 200,
                data: res
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