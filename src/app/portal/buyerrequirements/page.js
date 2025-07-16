"use client"
import Loader from '@/src/Components/Loader'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AccessDenied from '@/src/Components/AccessDenied'
import SuccessAlert from '@/src/Components/SuccessAlert'
import ErrorAlert from '@/src/Components/ErrorAlert'

const BuyerRequirements = () => {
    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state?.user?.userDetails)
    const [successMsg, setSuccessMsg] = useState(null)
    const [errMsg, setErrMsg] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closePaymentModal = () => {
        setIsModalOpen(false)
    }

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

    };

    return (
        <div className='app-container'>
            {user?.user_role === "buyer" ?
                <>
                    {
                        loading ?
                            <Loader /> :
                            <>
                                <div className='head pt-2 text-center'>
                                    <h2 className='primary-color'>My Requirements</h2>
                                </div>

                                <div className='d-flex justify-content-end mt-4'>
                                    <button className='submit-btn py-2' onClick={() => setIsModalOpen(true)}>Add Requirement</button>
                                </div>

                                {isModalOpen && (
                                    <div className="modal fade show d-block" tabIndex="-1">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title fw-bold">Add requirement</h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        onClick={closePaymentModal}
                                                    ></button>
                                                </div>

                                                <form onSubmit={handlePaymentSubmit}>
                                                    <div className="modal-body">
                                                        <div className='mb-3'>
                                                            <label className="form-label">Vegetable</label><sup className="super">*</sup>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="form-label">Quantity(kg)</label><sup className="super">*</sup>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                required
                                                                onWheel={(e) => e.target.blur()}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="modal-footer">
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary"
                                                            onClick={() => setIsModalOpen(false)}
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button type="submit" className="submit-btn requirement-btn py-2">
                                                            Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                <SuccessAlert val={successMsg} msg={successMsg} />
                                <ErrorAlert val={errMsg} msg={errMsg} />
                            </>}
                </>
                :
                <>
                    {user ?
                        <AccessDenied /> : <Loader/>}
                </>}
        </div>
    )
}

export default BuyerRequirements