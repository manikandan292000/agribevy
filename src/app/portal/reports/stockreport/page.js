"use client";
import React, { useEffect, useState } from 'react';
import { getStockReport } from '@/src/Components/Api';
import Loader from '@/src/Components/Loader';
import { FaExclamationTriangle } from 'react-icons/fa';

const formatCurrency = (amount) => `₹${parseFloat(amount || 0).toFixed(2)}`;

const StockReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);
  const [reportDate, setReportDate] = useState('');

  const fetchStockReport = async () => {
    setLoading(true);
    const data = await getStockReport();
    if (data?.status === 500) {
      setErrMsg(data?.message || 'Something went wrong!');
    } else {
      setReport(data?.report);
      setReportDate(data?.date);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStockReport();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loader />
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          {errMsg}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container py-4">
             <div className='head pt-2 text-center'>
                <h2 className='primary-color'>Stock Report</h2>
              </div>
              <div className="mb-4 text-end ml-auto">
  <p className="text-muted mb-0">Date: <strong>{reportDate}</strong></p>
</div>


      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Vegetable</th>
              <th>Opening Stock</th>
              <th>Stock In</th>
              <th>Stock Out</th>
              <th>Closing Stock</th>
            </tr>
          </thead>
          <tbody>
            {report?.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="fw-bold text-primary">{row.veg_name}</td>
                <td>{formatCurrency(row.opening_stock)}</td>
                <td>{formatCurrency(row.stock_in)}</td>
                <td>{formatCurrency(row.stock_out)}</td>
                <td className={row.closing_stock < 0 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                  {formatCurrency(row.closing_stock)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockReportPage;