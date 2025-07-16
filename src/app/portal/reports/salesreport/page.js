"use client";
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getSalesReport } from '@/src/Components/Api';
import Loader from '@/src/Components/Loader'; // ✅ Import your loader
import { BiBarChartAlt2 } from "react-icons/bi";
import { FaPercentage, FaMoneyBillWave, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdQrCodeScanner } from "react-icons/md";

// Format currency
const formatCurrency = (amount) => `₹${parseFloat(amount || 0).toFixed(2)}`;
const calculateProfit = (item) => (item.price - item.original_price) * item.quantity;


// Transaction Card
const TransactionCard = ({ txn, activeTxnId, setActiveTxnId }) => {
  const showDetails = activeTxnId === txn.id;

  const toggleCard = () => {
    setActiveTxnId((prevId) => (prevId === txn.id ? null : txn.id));
  };



  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between small">
          {/* <span><strong>Transaction ID:</strong> {txn.transaction_id}</span> */}
          <span><strong>Customer:</strong> {txn.customer_mobile}</span>
          <div className="d-flex align-items-center gap-2">
            <span>{format(new Date(txn.created_at), 'dd MMM yyyy • HH:mm')}</span>
            <button
              className="btn btn-sm btn-light"
              onClick={toggleCard}
            >
              {showDetails ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>

        <div className="row row-cols-2 row-cols-md-4 g-2 small mt-2">
          <div><strong>Total Amount:</strong> {formatCurrency(txn.total_amount)}</div>
          <div><strong>Paid:</strong> {formatCurrency(txn.paid_amt)}</div>
          <div><strong>Discount:</strong> {formatCurrency(txn.discount)}</div>
          <div><strong>Payment:</strong> {txn.payment_mode}</div>
        </div>

        {showDetails && (
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-sm">
              <thead className="table-light">
                <tr>
                  <th>Veg Name</th>
                  <th className="text-end">Qty</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Total</th>
                  <th className="text-end">Original Price</th>
                  <th className="text-end">Profit</th>
                </tr>
              </thead>
              <tbody>
                {txn.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.veg_name}</td>
                    <td className="text-end">{item.quantity}</td>
                    <td className="text-end">{formatCurrency(item.price)}</td>
                    <td className="text-end">{formatCurrency(item.total)}</td>
                    <td className="text-end">{formatCurrency(item.original_price)}</td>
                    <td className="text-end">{formatCurrency(calculateProfit(item))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Report Page
const SalesReportPage = () => {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loader state
  const [errMsg, setErrMsg] = useState(null);
  const [activeTxnId, setActiveTxnId] = useState(null); // 🔑 Track open card
  const [searchMobile, setSearchMobile] = useState('');


  const filteredTransactions = transactions?.filter((txn) =>
    txn.customer_mobile.includes(searchMobile)
  );

  const fetchSales = async () => {
    setLoading(true);
    const response = await getSalesReport();
    setTimeout(() => {
      if (response?.status === 200) {
        setSummary(response.summary);
        setTransactions(response.transactions);
      } else {
        setErrMsg(response?.message);
        setTimeout(() => setErrMsg(null), 2000);
      }
      setLoading(false);
    }, 3000);
  };


  useEffect(() => {
    fetchSales();
  }, []);


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="app-container py-4">
      <div className='head pt-2 text-center'>
        <h2 className='primary-color'>Sales Reports</h2>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Other content can go here */}

        <input
          type="date"
          className="form-control w-auto ms-auto" // 'ms-auto' for Bootstrap 5 to push it to the right
          defaultValue={format(new Date(), 'yyyy-MM-dd')}
        />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <p className="mb-1 text-muted d-flex align-items-center">
                <BiBarChartAlt2 className="me-2 fs-5" /> Total Sales
              </p>
              <h5>{formatCurrency(summary?.total_sales)}</h5>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <p className="mb-1 text-muted d-flex align-items-center">
                <FaPercentage className="me-2 fs-5" /> Total Discount
              </p>
              <h5>{formatCurrency(summary?.total_discount)}</h5>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <p className="mb-1 text-muted d-flex align-items-center">
                <FaMoneyBillWave className="me-2 fs-5" /> Cash Sales
              </p>
              <h5>{formatCurrency(summary?.cash_sales)}</h5>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <p className="mb-1 text-muted d-flex align-items-center">
                <MdQrCodeScanner className="me-2 fs-5" /> UPI Sales
              </p>
              <h5>{formatCurrency(summary?.upi_sales)}</h5>
            </div>
          </div>
        </div>
      </div>

      <h2 className="h5 mb-3">Transactions</h2>

      <div className="mb-3 d-flex justify-content-end">
        <input
          type="text"
          className="form-control form-control-sm w-auto"
          placeholder="Search by mobile number"
          value={searchMobile}
          onChange={(e) => setSearchMobile(e.target.value)}
          style={{ height: 'px', padding: '10px' }} // Adjust height and padding
        />
      </div>

      {filteredTransactions?.map((txn) => (
        <TransactionCard key={txn.id} txn={txn}
          activeTxnId={activeTxnId}
          setActiveTxnId={setActiveTxnId}
        />
      ))}

    </div>
  );
};

export default SalesReportPage;