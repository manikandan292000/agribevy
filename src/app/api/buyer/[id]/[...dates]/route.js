import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// // This function generates the static parameters for the dynamic route
// export async function generateStaticParams() {
//     try {
//         // Fetch all buyers (or specific mobile numbers)
//         const buyers = await querys({
//             query: `SELECT DISTINCT buyer_mobile FROM transactions`
//         });

//         const allParams = [];

//         // Loop through each buyer
//         for (const buyer of buyers) {
//             const mobile = buyer.buyer_mobile;

//             // Fetch available date ranges for the buyer
//             const dateRanges = await querys({
//                 query: `SELECT DISTINCT created_at FROM transactions WHERE buyer_mobile = ?`,
//                 values: [mobile]
//             });

//             // Add each combination of mobile and date ranges
//             for (const date of dateRanges) {
//                 const startDate = date.created_at;  // Assuming you want to fetch start and end dates from the transaction date
//                 const endDate = new Date(startDate);
//                 endDate.setDate(endDate.getDate() + 1); // Example: Just one day ahead, adjust as needed

//                 allParams.push({
//                     id: mobile.toString(), // Add buyer mobile
//                     dates: [startDate.toISOString(), endDate.toISOString()] // Date range (example: start and end)
//                 });
//             }
//         }

//         // Return static paths for all combinations of buyer mobile and date ranges
//         return allParams;
//     } catch (error) {
//         console.error('Error generating static params:', error);
//         return [];
//     }
// }

export async function GET(req) {
    try {
        const auth = await verifyToken(req); // Verify the user token

        if (!auth || !auth.decoded) {
            return NextResponse.json({
                message: 'Invalid or missing token',
                status: 401
            }, { status: 401 });
        }

        const { decoded } = auth;
        let userMobile = decoded.mobile;

        const pathSegments = new URL(req.url).pathname.split('/').filter(Boolean);

        if (pathSegments.length < 3) {
            return NextResponse.json({
                message: 'Invalid URL structure',
                status: 400
            }, { status: 400 });
        }

        const [mobile, start, end] = pathSegments.slice(-3); 

        if (!mobile || !start || !end) {
            return NextResponse.json({
                message: 'Missing required parameters',
                status: 400
            }, { status: 400 });
        }

        // Check user's role
        if (decoded.role === 'marketer' || decoded.role === 'assistant') {
            if (decoded.role === 'assistant') {
                const [num] = await querys({
                    query: `SELECT created_by FROM users WHERE user_id = ?`,
                    values: [decoded.userId]
                });

                if (!num || !num?.created_by) {
                    return NextResponse.json({
                        message: 'User not found',
                        status: 404
                    }, { status: 404 });
                }

                userMobile = num?.created_by;
            }

            // Fetch the records for the buyer, marketer, and date range
            const records = await querys({
                query: `
                    SELECT 
                        t.invoice_Id,
                        SUM(t.quantity) AS quantity,
                        SUM(t.buyer_payment) AS buyer_payment,
                        SUM(t.buyer_amount) AS buyer_amount,
                        MAX(t.created_at) AS soldDate,
                        CASE 
                            WHEN SUM(CASE WHEN t.buyer_status = 'pending' THEN 1 ELSE 0 END) > 0 
                            THEN 'pending' 
                            ELSE 'paid' 
                        END AS buyer_status,
                        MAX(b.buyer_name) AS buyer_name,
                        MAX(b.buyer_mobile) AS buyer_mobile,
                        MAX(b.buyer_address) AS buyer_address,
                        MAX(u.user_name) AS user_name,
                        MAX(u.user_address) AS user_address,
                        MAX(d.logo) AS logo,
                        MAX(d.magamai) AS magamai,
                        SUM(t.wage) AS total_wage,
                        SUM(t.rent) AS total_rent,
                        GROUP_CONCAT(DISTINCT v.veg_name) AS veg_name,
                        MAX(vl.tamil_name) AS tamil_name,
                        JSON_ARRAYAGG(t.transaction_id) AS transaction_id,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'veg_name', v.veg_name,
                                'quantity', t.quantity,
                                'amount', t.amount
                            )
                        ) AS details,
                        GROUP_CONCAT(DISTINCT t.marketer_mobile) AS marketer_mobile
                    FROM 
                        transactions t
                    JOIN 
                        products p ON t.product_id = p.product_id
                    LEFT JOIN 
                        users u ON t.marketer_mobile = u.user_mobile
                    LEFT JOIN 
                        buyers b ON t.buyer_mobile = b.buyer_mobile AND t.marketer_mobile = b.marketer_mobile
                    LEFT JOIN 
                        vegetables v ON p.vegetable_id = v.veg_id
                    LEFT JOIN 
                        veg_list vl ON v.list_id = vl.veg_id
                    LEFT JOIN 
                        default_setting d ON t.marketer_mobile = d.marketer_mobile
                    WHERE 
                        t.buyer_mobile = ? 
                        AND t.marketer_mobile = ? 
                        AND t.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
                    GROUP BY 
                        t.invoice_Id;
                `,
                values: [mobile, userMobile, start, end] // Dynamic values from the URL
            });

            return NextResponse.json({
                message: 'Details Fetched Successfully',
                data: records,
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
