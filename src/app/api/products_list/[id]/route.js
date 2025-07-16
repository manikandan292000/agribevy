import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";


export async function PUT(req) {
    try {
        const auth = await verifyToken(req);
        const id = new URL(req.url).pathname.split('/').filter(Boolean).pop();
        const { decoded } = auth;
        const role = decoded.role;
        const userMobile = decoded.mobile;

        const data = await req.json();
        const { quantity, price } = data;

        if (role !== 'buyer') {
            return NextResponse.json({ message: 'Unauthorized', status: 403 }, { status: 403 });
        }
        
        const rows = await querys({
                query: `UPDATE products_list 
                        SET quantity_available = ?, quantity = ?, price = ?
                        WHERE product_id = ? AND mobile = ?`,
                values: [quantity, quantity, price, id, userMobile]
            });
        
        return NextResponse.json({
            message: 'Stock updated successfully',
            status: 200
        }, { status: 200 });

    } catch (error) {
        console.error('Update Error:', error);
        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await verifyToken(req);
       
        const id = new URL(req.url).pathname.split('/').filter(Boolean).pop();

        if (!id) {
            return NextResponse.json({
                message: "ID is required",
                status: 400
            }, { status: 400 });
        }

        const { decoded } = auth;
        let userMobile = decoded.mobile;
        const role = decoded.role;

        if (role === "buyer") {

            // Delete the wage
            const result = await querys({
                query: `DELETE FROM products_list WHERE product_id = ? AND mobile = ?`,
                values: [id, userMobile]
            });

            if (result.affectedRows > 0) {
                return NextResponse.json({
                    message: "Product deleted successfully",
                    status: 200
                }, { status: 200 });
            }

            return NextResponse.json({
                message: "Failed to delete Product",
                status: 400
            }, { status: 400 });
        } else {
            return NextResponse.json({
                message: "Unauthorized",
                status: 403
            }, { status: 403 });
        }

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({
            message: "Server Error",
            status: 500
        }, { status: 500 });
    }
}