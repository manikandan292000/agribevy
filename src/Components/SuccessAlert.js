"use client"
import React from 'react'
import { FaCircleCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'

const SuccessAlert = ({ val, msg }) => {

    return (
        <div className={val === null ? "alert_net hide_net" : "alert_net show alert_suc_bg"}>
            <FaCircleCheck className='exclamation-circle' />
            <span className="msg">{msg}</span>
            <div className="close-btn close_suc">
                <IoClose className='close_mark' size={26} />
            </div>
        </div>
    )
}

export default SuccessAlert