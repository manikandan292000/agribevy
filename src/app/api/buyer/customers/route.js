import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const data = await req.json();
        const _id = nanoid(10)

        const userMobile = decoded.mobile;

        if (decoded.role !== 'buyer') {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }

        // Check if marketer already exists for this buyer
        const existing = await querys({
            query: `SELECT 1 FROM customers WHERE buyer_mobile = ? AND cust_mobile = ? LIMIT 1`,
            values: [userMobile, data.mobile]
        });

        if (existing.length > 0) {
            return NextResponse.json({
                message: 'Customers already exists for this buyer',
                status: 400
            }, { status: 400 });
        }

        // Insert new marketer
        await querys({
            query: `INSERT INTO customers ( cust_id, cust_name, cust_mobile, buyer_mobile) VALUES (?, ?, ?, ?)`,
            values: [_id, data.name, data.mobile, userMobile]
        });

        return NextResponse.json({
            message: 'Customers added successfully',
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
                query: `SELECT * FROM customers WHERE buyer_mobile = ?;`,
                values: [userMobile]
            });

            return NextResponse.json({
                message: 'Customers Listed successfully',
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

 
// export async function PUT(req) {
//     try {
//         const auth = await verifyToken(req);
//         const { decoded } = auth;
//         const data = await req.json();

//         const userMobile = decoded.mobile;

//         if (decoded.role !== 'buyer') {
//             return NextResponse.json({
//                 message: 'Unauthorized',
//                 status: 403
//             }, { status: 403 });
//         }

//         // Check if marketer exists for this buyer
//         const existing = await querys({
//             query: `SELECT 1 FROM marketers WHERE buyer_mobile = ? AND marketer_mobile = ? LIMIT 1`,
//             values: [userMobile, data.mobile]
//         });

//         if (existing.length === 0) {
//             return NextResponse.json({
//                 message: 'Marketer not found for this buyer',
//                 status: 404
//             }, { status: 404 });
//         }

//         // Update marketer name and address
//         await querys({
//             query: `UPDATE marketers SET marketer_name = ?, marketer_address = ? WHERE buyer_mobile = ? AND marketer_mobile = ?`,
//             values: [data.name, data.address, userMobile, data.mobile]
//         });

//         return NextResponse.json({
//             message: 'Marketer updated successfully',
//             status: 200
//         }, { status: 200 });

//     } catch (error) {
//         console.error('Server Error:', error);
//         return NextResponse.json({
//             message: 'Server Error',
//             status: 500
//         }, { status: 500 });
//     }
// }

