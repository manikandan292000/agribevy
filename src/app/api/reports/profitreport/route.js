
// function getDateCondition(filter, startDate, endDate) {
//   switch (filter) {
//     case 'today':
//       return `DATE(created_at) = CURDATE()`;
//     case 'this_week':
//       return `YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)`;
//     case 'last_week':
//       return `YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) - 1`;
//     case 'custom':
//       return `DATE(created_at) BETWEEN '${startDate}' AND '${endDate}'`;
//     default:
//       return `1`; // no filter
//   }
// }

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const filter = searchParams.get('filter') || 'today';
//     const startDate = searchParams.get('start_date');
//     const endDate = searchParams.get('end_date');

//     const condition = getDateCondition(filter, startDate, endDate);

//     // Fetch profit-related data
//     const items = await querys({
//       query: `
//         SELECT veg_name, SUM(quantity) as quantity,
//                SUM(price * quantity) as revenue,
//                SUM(original_price * quantity) as cost,
//                SUM((price - original_price) * quantity) as profit
//         FROM transaction_items
//         WHERE ${condition}
//         GROUP BY veg_name
//       `,
//     });

//     let totalRevenue = 0;
//     let totalCost = 0;
//     let totalProfit = 0;

//     const details = items.map(item => {
//       const quantity = parseFloat(item.quantity);
//       const revenue = parseFloat(item.revenue);
//       const cost = parseFloat(item.cost);
//       const profit = parseFloat(item.profit);

//       totalRevenue += revenue;
//       totalCost += cost;
//       totalProfit += profit;

//       return {
//         veg_name: item.veg_name,
//         quantity,
//         revenue,
//         cost,
//         profit,
//       };
//     });

//     return NextResponse.json({
//       summary: {
//         total_profit: totalProfit,
//         total_revenue: totalRevenue,
//         total_cost: totalCost,
//       },
//       details,
//     });
//   } catch (error) {
//     console.error('Profit Report Error:', error);
//     return NextResponse.json({
//       message: 'Server Error',
//       status: 500,
//     }, { status: 500 });
//   }
// }



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

    // Fetch items related to this buyer only
    const items = await querys({
      query: `
        SELECT ti.veg_name, 
               SUM(ti.quantity) as quantity,
               SUM(ti.price * ti.quantity) as revenue,
               SUM(ti.original_price * ti.quantity) as cost,
               SUM((ti.price - ti.original_price) * ti.quantity) as profit
        FROM transaction_items ti
        JOIN buyer_transactions bt ON ti.transaction_id = bt.transaction_id
        WHERE bt.mobile = ?
        GROUP BY ti.veg_name
      `,
      values: [userMobile],
    });

    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    const details = items.map(item => {
      const quantity = parseFloat(item.quantity);
      const revenue = parseFloat(item.revenue);
      const cost = parseFloat(item.cost);
      const profit = parseFloat(item.profit);

      totalRevenue += revenue;
      totalCost += cost;
      totalProfit += profit;

      return {
        veg_name: item.veg_name,
        quantity,
        revenue,
        cost,
        profit,
      };
    });

    return NextResponse.json({
      summary: {
        total_profit: totalProfit,
        total_revenue: totalRevenue,
        total_cost: totalCost,
      },
      details,
    });

  } catch (error) {
    console.error('❌ GET API error:', error);
    return NextResponse.json({ message: 'Server Error', status: 500 }, { status: 500 });
  }
}

  