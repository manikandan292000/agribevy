import { NextResponse } from "next/server";
import { querys } from "../../lib/DbConnection";

export async function GET(req) {
    try {

//         const limit = 10;
// const offset = (page - 1) * limit;

// const rows = await querys({
//     query: `SELECT * FROM markets LIMIT ? OFFSET ?`,
//     values: [limit, offset]
// });

        const rows = await querys({
            query: `SELECT * FROM markets`,
            values: []
        });

        if (rows) {
            return NextResponse.json({
                message: 'Markets Listed successfully',
                data: rows,
                status: 200
            }, { status: 200 });
        } else {
            return NextResponse.json({
                message: 'No Data Found',
                status: 404
            }, { status: 404 });
        }


    } catch (error) {
        return NextResponse.json({
            message: 'Server Error',
            data: error.message,
            status: 500
        }, { status: 500 });
    }
}