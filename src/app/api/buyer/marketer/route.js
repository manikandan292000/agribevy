import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const data = await req.json();

        const userMobile = decoded.mobile;

        if (decoded.role !== 'buyer') {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }

        // Check if marketer already exists for this buyer
        const existing = await querys({
            query: `SELECT 1 FROM marketers WHERE buyer_mobile = ? AND marketer_mobile = ? LIMIT 1`,
            values: [userMobile, data.mobile]
        });

        if (existing.length > 0) {
            return NextResponse.json({
                message: 'Marketer already exists for this buyer',
                status: 400
            }, { status: 400 });
        }

        // Insert new marketer
        await querys({
            query: `INSERT INTO marketers (buyer_mobile, marketer_name, marketer_mobile, marketer_address, status) VALUES (?, ?, ?, ?, ?)`,
            values: [userMobile, data.name, data.mobile, data.address, 1]
        });

        return NextResponse.json({
            message: 'Marketer added successfully',
            status: 200
        }, { status: 200 });

    } catch (error) {
        console.error('Server Error:', error);

        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}


export async function GET(req) {
    try {
        const auth = await verifyToken(req);
        const { decoded } = auth;
        let userMobile = decoded.mobile;

        if (decoded.role == 'buyer') {
            const allMarketers = await querys({
                query:`SELECT DISTINCT 
                        COALESCE(m.marketer_name, u.user_name) AS marketer_name,
                        x.marketer_mobile,
                        COALESCE(m.marketer_address, u.user_address) AS marketer_address
                    FROM (
                        SELECT marketer_mobile
                        FROM buyers WHERE buyer_mobile = ?
                        UNION
                        SELECT marketer_mobile
                        FROM marketers WHERE buyer_mobile = ?
                    ) x
                    LEFT JOIN marketers m ON m.marketer_mobile = x.marketer_mobile AND m.buyer_mobile = ?
                    LEFT JOIN users u ON u.user_mobile = x.marketer_mobile AND u.user_role = 'marketer';`,
                values: [userMobile,userMobile,userMobile]
            });

            return NextResponse.json({
                message: 'Marketer Listed successfully',
                status: 200,
                data: allMarketers
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


export async function PUT(req) {
    try {
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const data = await req.json();

        const userMobile = decoded.mobile;

        if (decoded.role !== 'buyer') {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }

        // Check if marketer exists for this buyer
        const existing = await querys({
            query: `SELECT 1 FROM marketers WHERE buyer_mobile = ? AND marketer_mobile = ? LIMIT 1`,
            values: [userMobile, data.mobile]
        });

        if (existing.length === 0) {
            return NextResponse.json({
                message: 'Marketer not found for this buyer',
                status: 404
            }, { status: 404 });
        }

        // Update marketer name and address
        await querys({
            query: `UPDATE marketers SET marketer_name = ?, marketer_address = ? WHERE buyer_mobile = ? AND marketer_mobile = ?`,
            values: [data.name, data.address, userMobile, data.mobile]
        });

        return NextResponse.json({
            message: 'Marketer updated successfully',
            status: 200
        }, { status: 200 });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const data = await req.json();

        const userMobile = decoded.mobile;

        if (decoded.role !== 'buyer') {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }

        // Check if the marketer exists for this buyer
        const existing = await querys({
            query: `SELECT 1 FROM marketers WHERE buyer_mobile = ? AND marketer_mobile = ? AND status = 1 LIMIT 1`,
            values: [userMobile, data.mobile]
        });

        if (existing.length === 0) {
            return NextResponse.json({
                message: 'Marketer not found or already deleted',
                status: 404
            }, { status: 404 });
        }

        // Soft delete: set status to 0
        await querys({
            query: `UPDATE marketers SET status = 0 WHERE buyer_mobile = ? AND marketer_mobile = ?`,
            values: [userMobile, data.mobile]
        });

        return NextResponse.json({
            message: 'Marketer deleted (status set to 0)',
            status: 200
        }, { status: 200 });

    } catch (error) {
        console.error('Server Error:', error);

        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}
