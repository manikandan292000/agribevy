import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        const auth = await verifyToken(req);

        const { searchParams } = new URL(req.url);
        const param = searchParams.get("params");

        if (!param) {
            return NextResponse.json({
                message: "Param is required",
                status: 400
            }, { status: 400 });
        }

        const { decoded } = auth;
        let userMobile = decoded.mobile;
        const role = decoded.role;

        if (role === "buyer") {
            const result = await querys({
                query: `SELECT * FROM products_list WHERE created_by = ? AND mobile = ?`,
                values: [param, userMobile]
            });

            if (result.length > 0) {
                return NextResponse.json({
                    message: "Products fetched successfully",
                    data: result,
                    status: 200
                }, { status: 200 });
            }

            return NextResponse.json({
                message: "No products found",
                data: [],
                status: 200
            }, { status: 200 });
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