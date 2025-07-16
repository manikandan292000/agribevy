
import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// export async function GET(req) {
//     try {
//         const auth = await verifyToken(req)
//         const {searchParams}=new URL(req.url,`http://${req.headers.host}`)
//         const date=searchParams.get("date")
       
//         const { decoded } = auth
//         let mobile = decoded.mobile
//         const role = decoded.role

//         if (role == 'marketer' || role == 'assistant') {

//             if (role == 'assistant') {
//                 const [num] = await querys({
//                     query: `SELECT created_by FROM users WHERE user_id = ?`,
//                     values: [decoded.userId]
//                 });

//                 if (!num) {
//                     return NextResponse.json({
//                         message: 'User not found',
//                         status: 404
//                     }, { status: 404 });
//                 }
//                 mobile = num?.created_by
//             }
            
//             const rows = await querys({
//                 query: `SELECT t.veg_name, t.farmer_amount, t.buyer_amount, t.farmer_payment, t.buyer_payment,t.amount, t.farmer_status,t.buyer_status,t.commission, t.magamai, t.farmer_wage, t.farmer_rent, t.wage, t.rent,f.farmer_name,b.buyer_name,b.buyer_address,p.vegetable_id, v.list_id, vl.tamil_name
//                         FROM transactions t
//                         LEFT JOIN farmers f ON t.farmer_mobile = f.farmer_mobile AND t.marketer_mobile=f.marketer_mobile
//                         LEFT JOIN buyers b ON t.buyer_mobile = b.buyer_mobile AND t.marketer_mobile=b.marketer_mobile
//                         LEFT JOIN products p ON t.product_id = p.product_id 
//                         LEFT JOIN vegetables v ON p.vegetable_id = v.veg_id 
//                         LEFT JOIN veg_list vl ON v.list_id = vl.veg_id
//                         WHERE t.marketer_mobile = ? AND DATE(t.created_at) = ?`,
//                 values: [mobile, date]
//             });
//             const [userData] = await querys({
//                 query: `SELECT
//                             d.logo, d.marketer_mobile, u.user_name, u.user_address
//                         FROM default_setting d
//                         LEFT JOIN users u ON u.user_mobile = d.marketer_mobile
//                         WHERE d.marketer_mobile = ?; `, values: [mobile]
//             });
//             if (rows) {
//                 return NextResponse.json({
//                     message: 'Transaction Listed successfully',
//                     data: {
//                         sales:rows,
//                         userData
//                     },
//                     status: 200
//                 }, { status: 200 });
//             } else {
//                 return NextResponse.json({
//                     message: 'No Data Found',
//                     status: 404
//                 }, { status: 404 });
//             }
//         } else {
//             return NextResponse.json({
//                 message: 'Unauthorized',
//                 status: 403
//             }, { status: 403 });
//         }

//     } catch (error) {
//         return NextResponse.json({
//             message: 'Server Error',
//             status: 500
//         }, { status: 500 });
//     }
// }

export async function GET(req) {
    try {
      const auth = await verifyToken(req);
      const { decoded } = auth;
      const role = decoded.role;
      const userMobile = decoded.mobile;
  
      if (role !== 'buyer') {
        return NextResponse.json({ message: 'Unauthorized', status: 403 }, { status: 403 });
      }
  
      // Get today’s date in YYYY-MM-DD format
      const today = new Date().toISOString().slice(0, 10); // e.g. "2025-05-07"
  
      // 1. Get daily sales summary
      const [summary] = await querys({
        query: `
          SELECT 
            IFNULL(SUM(total_amount), 0) AS total_sales,
            IFNULL(SUM(discount), 0) AS total_discount,
            IFNULL(SUM(CASE WHEN payment_mode = 'cash' THEN paid_amt ELSE 0 END), 0) AS cash_sales,
            IFNULL(SUM(CASE WHEN payment_mode = 'upi' THEN paid_amt ELSE 0 END), 0) AS upi_sales
          FROM buyer_transactions
          WHERE DATE(created_at) = ? AND mobile = ?
        `,
        values: [today, userMobile],
      });
  
      // 2. Get all today's transactions
      const transactions = await querys({
        query: `
          SELECT * FROM buyer_transactions
          WHERE DATE(created_at) = ? AND mobile = ?
          ORDER BY created_at DESC
        `,
        values: [today, userMobile],
      });
  
      // 3. For each transaction, get its items
    //   const transactionItems = await querys({
    //     query: `
    //       SELECT * FROM transaction_items
    //       WHERE transaction_id IN (?)
    //     `,
    //     values: [transactions.map(tx => tx.transaction_id)],
    //   });
    
    const transactionIds = transactions.map(tx => tx.transaction_id);

    let transactionItems = [];
    if (transactionIds.length > 0) {
    const placeholders = transactionIds.map(() => '?').join(', ');
    transactionItems = await querys({
        query: `
        SELECT * FROM transaction_items
        WHERE transaction_id IN (${placeholders})
        `,
        values: transactionIds,
    });
    }
  
      const transactionsWithItems = transactions.map(tx => {
        const items = transactionItems.filter(i => i.transaction_id === tx.transaction_id);
        return { ...tx, items };
      });
  
      return NextResponse.json({
        summary,
        transactions: transactionsWithItems,
        status: 200,
      });
  
    } catch (error) {
      console.error('❌ GET API error:', error);
      return NextResponse.json({ message: 'Server Error', status: 500 }, { status: 500 });
    }
  }
  