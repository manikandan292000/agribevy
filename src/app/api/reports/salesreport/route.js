
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
  