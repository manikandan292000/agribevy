"use client";
import React, { useEffect, useState } from "react";
import { getCustomersAPI } from "@/src/Components/Api";
import Loader from "@/src/Components/Loader";
import { FaExclamationTriangle } from "react-icons/fa";

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const data = await getCustomersAPI();
    if (data?.status === 500) {
      setErrMsg(data?.message || "Something went wrong!");
    } else {
      setCustomers(data?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
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
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded-md flex items-center gap-2">
          <FaExclamationTriangle className="text-xl" />
          {errMsg}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container px-4 py-8">
      {/* Heading Section */}
      <div className='head pt-2 text-center'>
                <h2 className='primary-color'>Customers</h2>
              </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-5 justify-center">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f1f1", textAlign: "center" }}>
                  <th style={{ padding: "10px", border: "1px solid #ccc" }}>#</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc" }}>Customer Name</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc" }}>Customer Mobile</th>
                  <th style={{ padding: "10px", border: "1px solid #ccc" }}>Buyer Mobile</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((cust, index) => (
                    <tr key={cust.id} style={{ backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff" }}>
                      <td style={{ padding: "10px", border: "1px solid #ccc", textAlign: "center" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ccc", textAlign: "center", color: "#1D4ED8", fontWeight: "500" }}>
                        {cust.cust_name}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ccc", textAlign: "center" }}>
                        {cust.cust_mobile}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ccc", textAlign: "center" }}>
                        {cust.buyer_mobile}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "10px", color: "#D32F2F" }}>
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerListPage;