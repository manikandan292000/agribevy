import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";
 
export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        // Verify the token
        const auth = await verifyToken(req);
 
        const { decoded } = auth;
        let farmerMobile = decoded.mobile;
        const role = decoded.role;
 
        if (role == 'farmer') {
 
            const list = await querys({
                query: `SELECT
                        i.invoiceId,
                        i.created_by,
                        i.created_at,
                        SUM(t.farmer_amount) AS total_farmer_amount,
                        SUM(t.quantity) AS total_quantity,
                        u.user_name
                    FROM invoice i
                    LEFT JOIN transactions t ON t.invoiceId = i.invoiceId
                    LEFT JOIN users u ON u.user_mobile = i.created_by
                    WHERE i.farmer_mobile = ?
                    GROUP BY i.invoiceId, i.created_by, i.created_at, u.user_name
                    ORDER BY i.created_at DESC;
                    `,
                values: [farmerMobile]
            })
            return NextResponse.json({
                message: 'Data listed',
                data: list,
                status: 200
            }, { status: 200 });
 
        } else {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }
    } catch (error) {
        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}
