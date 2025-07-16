"use client"
import React, { useEffect, useState } from 'react'
import Loader from '@/src/Components/Loader';
import { useSelector } from 'react-redux';
import AccessDenied from '@/src/Components/AccessDenied';
import { getReportsDetails } from '@/src/Components/Api';
import BarCharts from '@/src/Components/BarCharts';
import AreaCharts from '@/src/Components/AreaCharts';
import { useRouter } from 'next/navigation';

const Products = () => {
  const user = useSelector((state) => state?.user?.userDetails)
  const router = useRouter()
  const [chartData, setChartData] = useState(null)
  const [summary,setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)
  
    const getDashboard = async () => {
      setLoading(true)
      const response = await getReportsDetails()
      if (response?.status === 200) {
        console.log(response.data);
        
        setChartData(response?.data.charts)
        setSummary(response?.data.summary)
        setLoading(false)
      }
      else {
        setErrMsg(response.message)
        setTimeout(() => {
          setErrMsg(null)
        }, 2000)
        setLoading(false)
      }
    }

    useEffect(()=>{
      getDashboard()
    },[])

    console.log(chartData);
    

  return (
    <div className='app-container'>
      {user?.user_role === "buyer" ?
        <>
          {loading ? <Loader /> :
            <>
            <div className="report-dashboard">
              <div className='head pt-2 text-center mb-4'>
                <h2 className='primary-color'>Reports</h2>
              </div>
              
              <div className='container'>
                  <div className='row'>

                    <div className='col-md-4 px-4'>
                      <div className='card p-3'>
                        <h4>Sales Reports</h4>
                        <p>Total Sales: ₹ {summary?.total_sales}</p>
                        <div className='text-end mt-2'>
                          <button className='submit-btn py-2 px-2' onClick={() => router.push("/portal/reports/salesreport")}>
                            {/* {translations[app_language]?.addproducts} */}
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='col-md-4 px-4'>
                      <div className='card p-3'>
                        <h4>Profit Reports</h4>
                        <p>Total Profit: ₹ {summary?.total_profit}</p>
                        <div className='mt-2 text-end'>
                          <button className='submit-btn py-2 px-2' onClick={() => router.push("/portal/reports/profitreport")}>
                            {/* {translations[app_language]?.addproducts} */}
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='col-md-4 px-4'>
                      <div className='card p-3'>
                        <h4>Stock Reports</h4>
                        <p>Total Stock: {summary?.total_stock} kg</p>
                        <div className='text-end mt-2'>
                          <button className='submit-btn py-2 px-2' onClick={() => router.push("/portal/reports/stockreport")}>
                            {/* {translations[app_language]?.addproducts} */}
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
              </div>

              {/* charts part  */}
              <div className='contanier'>
                <div className='row'>

                  <div className='col-4'>
                    <div>
                      <BarCharts data={chartData?.sales_chart} type={"sales"}/>
                    </div>
                  </div>

                  <div className='col-4'>
                    <div>
                      <AreaCharts data={chartData?.profit_chart}/>
                    </div>
                  </div>

                  <div className='col-4'>
                    <div>
                      <BarCharts data={chartData?.stock_chart} type={"stock"}/>
                    </div>
                  </div>

                </div>
              </div>

            </div>
            </>
            }
        </>
        :
        <>
          {user ?
            <AccessDenied /> : <Loader />}
        </>}
    </div>
  )
}

export default Products