import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const auth = await verifyToken(req);
    const { decoded } = auth;
    const role = decoded.role;
    const userMobile = decoded.mobile;

    if (role !== 'buyer') {
      return NextResponse.json({ message: 'Unauthorized', status: 403 }, { status: 403 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Get opening stock (before today)
    const openingRows = await querys({
      query: `
        SELECT veg_name, 
               SUM(quantity_available + quantity_sold) AS total_stock
        FROM products_list
        WHERE mobile = ? AND DATE(created_at) < ?
        GROUP BY veg_name
      `,
      values: [userMobile, today],
    });

    const openingMap = {};
    openingRows.forEach(row => {
      openingMap[row.veg_name] = parseFloat(row.total_stock);
    });

    // Get today's stock_in
    const stockInRows = await querys({
      query: `
        SELECT veg_name, SUM(quantity) as stock_in
        FROM products_list
        WHERE mobile = ? AND DATE(created_at) = ?
        GROUP BY veg_name
      `,
      values: [userMobile, today],
    });

    const stockInMap = {};
    stockInRows.forEach(row => {
      stockInMap[row.veg_name] = parseFloat(row.stock_in);
    });

    // Get today's stock_out (sold)
    const stockOutRows = await querys({
      query: `
        SELECT ti.veg_name, SUM(ti.quantity) as stock_out
        FROM transaction_items ti
        JOIN buyer_transactions bt ON bt.transaction_id = ti.transaction_id
        WHERE bt.mobile = ? AND DATE(bt.created_at) = ?
        GROUP BY ti.veg_name
      `,
      values: [userMobile, today],
    });

    const stockOutMap = {};
    stockOutRows.forEach(row => {
      stockOutMap[row.veg_name] = parseFloat(row.stock_out);
    });

    // Combine all veg_names
    const vegNames = new Set([
      ...Object.keys(openingMap),
      ...Object.keys(stockInMap),
      ...Object.keys(stockOutMap),
    ]);

    const report = Array.from(vegNames).map(name => {
      const opening = openingMap[name] || 0;
      const stockIn = stockInMap[name] || 0;
      const stockOut = stockOutMap[name] || 0;
      const closing = opening + stockIn - stockOut;

      return {
        veg_name: name,
        opening_stock: opening,
        stock_in: stockIn,
        stock_out: stockOut,
        closing_stock: closing,
      };
    });

    return NextResponse.json({
      report,
      date: today,
    });

  } catch (error) {
    console.error('❌ Stock report error:', error);
    return NextResponse.json({ message: 'Server Error', status: 500 }, { status: 500 });
  }
}
