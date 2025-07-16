"use client"
import { getAllFarmerInvoiceAPI, getSingleFarmerInvoiceAPI } from '@/src/Components/Api'
import Loader from '@/src/Components/Loader'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AccessDenied from '@/src/Components/AccessDenied'
import MultiFarmer from '@/src/Components/MultiFarmer'
import ErrorAlert from '@/src/Components/ErrorAlert'

const FarmerInvoice = () => {
    const user = useSelector((state) => state?.user?.userDetails)
    const [tableData, setTableData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [errMsg, setErrMsg] = useState(null)
    const [invoiceData, setInvoiceData] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const closeModal = () => {
        setTimeout(() => setIsModalOpen(false), 300);
    };

    const getAllDetails = async () => {
        setLoading(true)
        const response = await getAllFarmerInvoiceAPI()
        if (response?.status === 200) {
            setTableData(response?.data)
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

    const getInvoice = async (id) => {
        setLoading(true)
        const response = await getSingleFarmerInvoiceAPI(id)
        if (response?.status === 200) {
            setInvoiceData(response?.data);
            setLoading(false)
            setIsModalOpen(true)
        }
        else {
            setErrMsg(response.message)
            setIsModalOpen(false)
            setTimeout(() => {
                setErrMsg(null)
            }, 2000)
            setLoading(false)
        }

    }

    useEffect(() => {
        getAllDetails()
    }, [])

    return (
        <div className='app-container'>
            {user?.user_role === "farmer" ?
                <>
                    {loading ?
                        <Loader /> :
                        <>
                            <div className="farmer-dashboard">
                                <div className='head pt-2 text-center mb-4'>
                                    <h2 className='primary-color'>My Invoices</h2>
                                </div>
                            </div>

                            {tableData?.length > 0 ?
                                <div className='row mt-2'>
                                    {tableData?.map((invoice, index) => {
                                        return (
                                            <div className='col-12 col-md-6 col-lg-4 mt-4' key={index}>
                                                <div className="pdf-card pointer " onClick={() => getInvoice(decodeURIComponent(invoice?.invoiceId))}>

                                                    <div className="pdf-header">
                                                        View PDF
                                                    </div>

                                                    <div className="card-body">
                                                        <h5 className="card-title mb-2">{invoice?.invoiceId}</h5>
                                                        <p className="card-text">
                                                            <div className='mb-2'>
                                                                <span>Marketer:{invoice?.user_name}</span>
                                                            </div>

                                                            <div className='mb-1'>
                                                                <span>Amount: ₹{invoice?.total_farmer_amount}</span>
                                                            </div>
                                                        </p>
                                                    </div>
                                                    <div className="card-footer">
                                                        <small className="text-muted">Date:{formatDate(invoice?.created_at)}</small>
                                                    </div>
                                                </div>
                                            </div>)
                                    })}


                                </div>
                                :
                                <p className='text-danger fw-bold fs-3 text-center mt-5'>No Invoice found</p>
                            }

                            {isModalOpen && (
                                <div className={`modal d-block modal-fullscreen`} tabIndex="-1">
                                    <div className="modal-dialog modal-fullscreen">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title text-center">Invoice</h5>
                                                <button type="button" className="btn-close" onClick={closeModal}></button>
                                            </div>
                                            <div className="modal-body" >
                                                <MultiFarmer data={invoiceData} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <ErrorAlert val={errMsg} msg={errMsg} />
                        </>}
                </>
                :
                <>
                    {user ?
                        <AccessDenied /> : <Loader />}
                </>
            }
        </div>
    )
}

export default FarmerInvoice