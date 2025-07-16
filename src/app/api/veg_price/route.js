import { NextResponse } from "next/server";
import { querys } from "../../lib/DbConnection";
import { verifyToken } from "../../lib/Token";


export async function POST(req) {
    try {
        // Verify the token
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const role = decoded.role;
        const user = decoded.userId;

        const data = await req.json();

        if (role === 'buyer') {
            try {
                // Try inserting the data
                const query = await querys({
                    query: `INSERT INTO prices_list (veg_id, user_id, veg_name, price, tamil_name, short_key) VALUES (?, ?, ?, ?, ?, ?)`,
                    values: [data.veg_id, user, data.veg_name, data.price, data.tamil_name, data.key]
                });

                if (query.affectedRows > 0) {
                    return NextResponse.json({
                        message: 'Price added successfully',
                        // data: {veg_id: data.veg_id, veg_name: data.veg_name, tamil_name: data.tamil_name},
                        status: 200
                    }, { status: 200 });
                } else {
                    return NextResponse.json({
                        message: 'Insert failed',
                        status: 400
                    }, { status: 400 });
                }
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return NextResponse.json({
                        message: 'Already added this vegetable.',
                        status: 409
                    }, { status: 409 });
                }

                console.error('Database Error:', err);
                return NextResponse.json({
                    message: 'Database Error',
                    status: 500
                }, { status: 500 });
            }

        } else {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({
                message: 'Already added this vegetable.',
                status: 409
            }, { status: 409 });
        }
        console.error('Server Error:', error);
        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}


export async function GET(req) {
    try {
        // Verify the token
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const role = decoded.role;
        const user = decoded.userId;

        if (role == 'buyer') {
            // Fetch inventory data with tamil_name from the veg_list table
            const query = await querys({
                query: `
                    SELECT 
                         pl.*,
                        vl.tamil_name
                    FROM 
                        prices_list pl
                    LEFT JOIN 
                        veg_list vl
                    ON 
                        pl.veg_id = vl.veg_id
                    WHERE 
                        pl.user_id = ?;`,
                values: [user]
            });

            // Return the inventory data
            return NextResponse.json({
                message: 'Price Listed successfully',
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


export async function PUT(req) {
    try {
        // Verify the token
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const role = decoded.role;
        const user = decoded.userId;

        const data = await req.json();

        if (role == 'buyer') {
            // Fetch inventory data with tamil_name from the veg_list table
            const query = await querys({
                query: `UPDATE prices_list SET price = ?, short_key = ? WHERE veg_id = ? AND user_id = ?`,
                values: [data.price, data.key, data.veg_id, user]
            });

            if (query.affectedRows > 0) {
                return NextResponse.json({
                    message: 'Price updated successfully',
                    status: 200
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    message: 'Update failed or no changes made',
                    status: 400
                }, { status: 400 });
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