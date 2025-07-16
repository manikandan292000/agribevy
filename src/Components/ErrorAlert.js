"use client"
import React from 'react'
import { IoClose } from 'react-icons/io5'
import { RxCrossCircled } from 'react-icons/rx'

const ErrorAlert = ({ val, msg }) => {

    return (
        <div className={val === null ? "alert_net hide_net" : "alert_net show alert_war_bg"} >
            <RxCrossCircled className='exclamation-circle' />
            <span className="msg">{msg}</span>
            <div className="close-btn close_war">
                <IoClose className='close_mark' size={26} />
            </div>
        </div>
    )
}

export default ErrorAlert