import { nanoid } from 'nanoid';
import { verifyToken } from '../../lib/Token';
import { querys } from '../../lib/DbConnection';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Verify the token
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const role = decoded.role;
        const user = decoded.mobile; 

        const data = await req.json();
        const id = nanoid();

        if (role === 'buyer') {
            const query = await querys({
                query: `INSERT INTO products_list (product_id, veg_name, quantity,
                    quantity_available, quantity_sold, unit, price, mobile, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                values: [id, data.veg_name, data.quantity, data.quantity, 0, data.unit,
                        data.price, user, "own"]
            });

            if (query.affectedRows > 0) {
                return NextResponse.json({
                    message: 'Product added successfully',
                    status: 200
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    message: 'Insert failed',
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

export async function GET(req) {
    try {
        // Verify the token
        const auth = await verifyToken(req);
        const { decoded } = auth;
        const role = decoded.role;
        const user = decoded.mobile;

        if (role == 'buyer') {
            const query = await querys({
                query: `SELECT * FROM products_list WHERE mobile = ?;`,
                values: [user]
            });

            // Return the inventory data
            return NextResponse.json({
                message: 'Products Listed successfully',
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
    const auth = await verifyToken(req);
    const { decoded } = auth;
    const role = decoded.role;
    const userId = decoded.userId;
    const buyerMobile = decoded.mobile;
 
    const payload = await req.json();
    const items = payload.item;
    
    const customerMobile = payload.mobile;
    const customerName = payload?.name;
    const paymentMode = payload.paymentMode;
    const paidAmt = parseFloat(payload.amt);
    const discount = parseFloat(payload.discount);
    const id = nanoid(10)

    if (role !== 'buyer') {
      return NextResponse.json({ message: 'Unauthorized', status: 403 }, { status: 403 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Invalid item array', status: 400 }, { status: 400 });
    }

    // Check if customer exists
    const [existingCustomer] = await querys({
      query: `SELECT cust_id FROM customers WHERE cust_mobile = ? AND buyer_mobile = ?`,
      values: [customerMobile, buyerMobile],
    });
    

    if (!existingCustomer && !payload?.name) {
      return NextResponse.json({
        message: 'Customer not found. Please provide customer name.',
        requireCustomerName: true,
        status: 400,
      }, { status: 400 });
    }    

    if (!existingCustomer && payload?.name) {
      await querys({
        query: `INSERT INTO customers (cust_id, cust_name, cust_mobile, buyer_mobile) VALUES (?, ?, ?, ?)`,
        values: [id, customerName, customerMobile, buyerMobile],
      });
    }

    // Step 1: Validate & stock check
    for (const item of items) {
      const { veg_name, quantity } = item;
      const qty = parseFloat(quantity);

      if (!veg_name || isNaN(qty) || qty <= 0) {
        return NextResponse.json({
          message: `Invalid item: ${veg_name}`,
          status: 400,
        }, { status: 400 });
      }

      const [priceListCheck] = await querys({
        query: `SELECT * FROM prices_list WHERE veg_name = ? AND user_id = ?`,
        values: [veg_name, userId],
      });

      if (!priceListCheck) {
        return NextResponse.json({
          message: `❌ "${veg_name}" is not listed in your price list.`,
          status: 400,
        }, { status: 400 });
      }

      const [stockCheck] = await querys({
        query: `SELECT SUM(quantity_available) AS total_stock 
                FROM products_list 
                WHERE veg_name = ? AND mobile = ?`,
        values: [veg_name, buyerMobile],
      });

      const available = stockCheck?.total_stock ?? 0;
      if (qty > available) {
        return NextResponse.json({
          message: `❌ Not enough stock for "${veg_name}". Available: ${available}, Requested: ${qty}`,
          status: 400,
        }, { status: 400 });
      }
    }

    // Step 2: Stock updates and calculations
    const transactionId = nanoid();
    let totalAmount = 0;
    const itemsToInsert = [];

    for (const item of items) {
      const { veg_name, quantity, price } = item;
      const qty = parseFloat(quantity);
      let remainingQty = qty;

      const rows = await querys({
        query: `SELECT product_id, quantity_available, quantity_sold 
                FROM products_list 
                WHERE veg_name = ? AND mobile = ? AND quantity_available > 0 
                ORDER BY created_at ASC`,
        values: [veg_name, buyerMobile],
      });
 
      const updates = [];
      for (const row of rows) {
        if (remainingQty <= 0) break;

        const useQty = Math.min(row.quantity_available, remainingQty);
        updates.push({
          id: row.product_id,
          quantity_available: row.quantity_available - useQty,
          quantity_sold: row.quantity_sold + useQty,
        });
        remainingQty -= useQty;
      }

      for (const u of updates) {
        await querys({
          query: `UPDATE products_list 
                  SET quantity_available = ?, quantity_sold = ? 
                  WHERE product_id = ?`,
          values: [u.quantity_available, u.quantity_sold, u.id],
        });
      }

      const [priceRow] = await querys({
        query: `SELECT price FROM products_list 
                WHERE veg_name = ? AND mobile = ? 
                ORDER BY created_at DESC LIMIT 1`,
        values: [veg_name, buyerMobile],
      });

      const ogPrice = parseFloat(priceRow?.price ?? item.price ?? 0);
      const total = parseFloat(price) * qty;
      totalAmount += total;

      itemsToInsert.push({ veg_name, quantity: qty, price, total, ogPrice });
    }

    // console.log(itemsToInsert,payload,"**********");
    
    // Step 3: Proportional paid amount distribution
    const rawShares = itemsToInsert.map(item => (item.total / totalAmount) * paidAmt);
    const roundedShares = rawShares.map(s => Math.floor(s));
    let sumRounded = roundedShares.reduce((a, b) => a + b, 0);
    let diff = Math.round(paidAmt - sumRounded);

    for (let i = 0; diff !== 0; i = (i + 1) % roundedShares.length) {
      roundedShares[i]++;
      diff--;
    }

    itemsToInsert.forEach((item, i) => {
      item.amount_paid = roundedShares[i];
    });

    // Step 4: Record transaction
    await querys({
      query: `INSERT INTO buyer_transactions 
              (transaction_id, mobile, total_amount, payment_mode, customer_mobile, paid_amt, discount) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
      values: [
        transactionId,
        buyerMobile,
        totalAmount,
        paymentMode,
        customerMobile,
        paidAmt,
        discount,
      ],
    });

    for (const item of itemsToInsert) {
      await querys({
        query: `INSERT INTO transaction_items 
                (transaction_id, veg_name, quantity, price, total, amount_paid, original_price) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
        values: [
          transactionId,
          item.veg_name,
          item.quantity,
          item.price,
          item.total,
          item.amount_paid,
          item.ogPrice
        ],
      });
    }

    return NextResponse.json({
      message: 'Stock updated & transaction recorded',
      status: 200,
      transaction_id: transactionId,
      total_amount: totalAmount,
      items: itemsToInsert,
    }, { status: 200 });

  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({
      message: 'Server Error',
      status: 500,
    }, { status: 500 });
  }
}
