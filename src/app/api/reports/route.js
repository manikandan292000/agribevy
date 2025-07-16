import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const auth = await verifyToken(req);
    const { decoded } = auth;
    const role = decoded.role;
    const mobile = decoded.mobile;

    if (role !== 'buyer') {
      return NextResponse.json({ message: 'Unauthorized', status: 403 }, { status: 403 });
    }

    // --- Sales Report ---
    const salesResult = await querys({
      query: `
        SELECT DATE(created_at) as date, SUM(total_amount) as total_sales
        FROM buyer_transactions
        WHERE mobile = ? AND created_at >= CURDATE() - INTERVAL 6 DAY
        GROUP BY DATE(created_at)
      `,
      values: [mobile],
    });

    let totalSales = 0;
    const salesChart = salesResult.map(row => {
      const total = parseFloat(row.total_sales);
      totalSales += total;
      return { date: row.date, total_sales: total };
    });

    // --- Profit Report ---
    const profitResult = await querys({
      query: `
        SELECT 
          DATE(bt.created_at) AS date,
          SUM(ti.price * ti.quantity) AS revenue,
          SUM(ti.original_price * ti.quantity) AS cost,
          SUM((ti.price - ti.original_price) * ti.quantity) AS profit
      FROM 
          transaction_items ti
      JOIN 
          buyer_transactions bt ON ti.transaction_id = bt.transaction_id
      WHERE 
          bt.mobile = ? 
          AND bt.created_at >= CURDATE() - INTERVAL 6 DAY
      GROUP BY 
          DATE(bt.created_at)
      ORDER BY 
          DATE(bt.created_at);`,
      values: [mobile],
    });

    let totalProfit = 0;
    const profitChart = profitResult.map(row => {
      const profit = parseFloat(row.profit);
      totalProfit += profit;
      return {
        date: row.date,
        revenue: parseFloat(row.revenue),
        cost: parseFloat(row.cost),
        profit,
      };
    });

    // --- Stock Report ---
    const stockResult = await querys({
      query: `
        SELECT veg_name, SUM(quantity_available) as available
        FROM products_list
        WHERE mobile = ? AND created_at >= CURDATE() - INTERVAL 6 DAY
        GROUP BY veg_name
      `,
      values: [mobile],
    });

    let totalStock = 0;
    const stockChart = stockResult.map(row => {
      const available = parseFloat(row.available);
      totalStock += available;
      return {
        veg_name: row.veg_name,
        available,
      };
    });

    return NextResponse.json({
      message: 'Report data fetched',
      status: 200,
      data: {
        summary: {
          total_sales: totalSales,
          total_profit: totalProfit,
          total_stock: totalStock,
        },
        charts: {
          sales_chart: salesChart,
          profit_chart: profitChart,
          stock_chart: stockChart,
        }
      }
    });

  } catch (error) {
    console.error('❌ Dashboard Report Error:', error);
    return NextResponse.json({ message: 'Server Error', status: 500 }, { status: 500 });
  }
}