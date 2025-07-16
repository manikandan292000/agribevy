"use client";
import React, { useEffect, useState } from "react";
import { getProfitReport } from "@/src/Components/Api";
import Loader from "@/src/Components/Loader";
import { FaExclamationTriangle } from "react-icons/fa";

const formatCurrency = (amount) => `₹${parseFloat(amount || 0).toFixed(2)}`;

const ProfitReport = () => {
  const [data, setData] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfitData = async () => {
    setLoading(true);
    const res = await getProfitReport();
    console.log(res)
    if (res?.status === 500 || res?.status === 403) {
      setErrMsg(res?.message || "Something went wrong");
    } else {
      setData(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfitData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Loader />
      </div>
    );
  }

  if (errMsg) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ backgroundColor: "#f8d7da", padding: "1rem", borderRadius: "5px", color: "#842029", display: "flex", alignItems: "center" }}>
          <FaExclamationTriangle style={{ marginRight: "8px" }} />
          {errMsg}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container px-4 py-8">
     <div className='head pt-2 mt-0 text-center'>
                <h2 className='primary-color'>Profit Report</h2>
              </div>

      {/* Summary Box */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem",marginTop:"40px" , flexWrap: "wrap" }}>
        <div style={{ flex: 1, padding: "1rem", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#e9f7ef" }}>
          <h6 style={{ marginBottom: "0.5rem", color: "#28a745" }}>Total Revenue</h6>
          <strong>{formatCurrency(data?.summary?.total_revenue)}</strong>
        </div>
        <div style={{ flex: 1, padding: "1rem", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#fef9e7" }}>
          <h6 style={{ marginBottom: "0.5rem", color: "#ffc107" }}>Total Cost</h6>
          <strong>{formatCurrency(data?.summary?.total_cost)}</strong>
        </div>
        <div style={{ flex: 1, padding: "1rem", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#f8f9fa" }}>
          <h6 style={{ marginBottom: "0.5rem", color: data?.summary?.total_profit >= 0 ? "#28a745" : "#dc3545" }}>
            Total Profit
          </h6>
          <strong style={{ color: data?.summary?.total_profit >= 0 ? "#28a745" : "#dc3545" }}>
            {formatCurrency(data?.summary?.total_profit)}
          </strong>
        </div>
      </div>

      {/* Details Table */}
      <div style={{ overflowX: "auto",marginTop:"20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f1f1", textAlign: "left" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Vegetable</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Quantity</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Revenue</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Cost</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Profit</th>
            </tr>
          </thead>
          <tbody>
            {data?.details?.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{item.veg_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{item.quantity}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{formatCurrency(item.revenue)}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{formatCurrency(item.cost)}</td>
                <td style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  color: item.profit >= 0 ? "green" : "red",
                  fontWeight: "bold"
                }}>
                  {formatCurrency(item.profit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitReport;