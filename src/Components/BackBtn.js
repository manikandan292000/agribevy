"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { IoArrowBackCircle } from 'react-icons/io5'
import { useSelector } from 'react-redux'

const BackBtn = ({ path, name }) => {
    const router = useRouter()
    const translations = useSelector((state) => state?.language?.translations)
    const appLanguage = useSelector((state) => state?.user?.app_language)

    const translatedName = translations?.[appLanguage]?.[name] || name
    const backText = translations?.[appLanguage]?.back || 'Back'

    const handleBackClick = () => {
        router.push(path)
    }

    return (
        <div className='head pt-2 d-flex align-items-center justify-content-between'>
            {/* Desktop Back Button */}
            <button 
                className='submit-btn py-2 requirement-btn px-2 d-none d-md-block' 
                onClick={handleBackClick}
            >
                {backText}
            </button>

            {/* Mobile Icon Button */}
            <button 
                className='back_icon d-block d-md-none' 
                onClick={handleBackClick}
            >
                <IoArrowBackCircle size={26} />
            </button>

            {/* Page Title */}
            <h2 className='primary-color text-center flex-grow-1 m-0'>
                {translatedName}
            </h2>
        </div>
    )
}

export default BackBtn
