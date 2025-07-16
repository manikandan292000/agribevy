"use client"
import AccessDenied from '@/src/Components/AccessDenied'
import Loader from '@/src/Components/Loader'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addBuyerSettingsAPI, getBuyerSettingsAPI, updateBuyerSettingsAPI } from '@/src/Components/Api'
import Spinner from '@/src/Components/Spinner'
import { changeLanguage, getIsShow } from '@/src/app/features/Slice'
import imageCompression from "browser-image-compression";
import SuccessAlert from '@/src/Components/SuccessAlert'
import ErrorAlert from '@/src/Components/ErrorAlert'

const Settings = () => {
    const dispatch = useDispatch()
    const languageChanged = useSelector((state) => state?.user?.languageChanged)
    const app_language = useSelector((state) => state?.user?.app_language)
    const translations = useSelector((state) => state?.language?.translations)
    // const sub_status = useSelector((state) => state?.user?.subscription)
    const user = useSelector((state) => state?.user?.userDetails)
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState(null)
    const [spin, setSpin] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [settingsData, setSettingsData] = useState(null)
    const [edit, setEdit] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [imgPath, setImgPath] = useState('')

    const onSubmit = async (data) => {
        if (isEditing) {
            setSpin(true)
            const formData = new FormData();
            formData.append("shop_name", data.shop_name);
            formData.append("shop_address", data.shop_address);
            formData.append("discount_show", data.discount_show);
            formData.append("discount", data.discount);
            formData.append("payment_mode", data.payment_mode);
            formData.append("language", data.language);
            formData.append("app_language", data.app_language);

            if (data.file && data.file.length > 0) {
                formData.append("file", data.file[0]);
            } else if (settingsData.logo) {
                formData.append("existingLogo", settingsData.logo);
            }
            const response = await updateBuyerSettingsAPI(formData)
            if (response?.status === 200) {
                setSuccessMsg(response?.message)
                dispatch(changeLanguage(!languageChanged))
                setSpin(false)
                setTimeout(() => {
                    reset()
                    getSettings()
                    setIsEditing(false)
                    setSuccessMsg(null)
                }, 2000)
            }
            else {
                setErrMsg(response?.message)
                setSpin(false)
                setTimeout(() => {
                    setErrMsg(null)
                }, 2000)
            }
        }
        else {
            setSpin(true)
            const formData = new FormData();
            const payload = { ...data }
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };

            for (const key in payload) {
                if (key === 'file' && payload[key].length > 0) {
                    const compressedFile = await imageCompression(payload[key][0], options);
                    formData.append(key, compressedFile);
                } else {
                    formData.append(key, payload[key]);
                }
            }

            const response = await addBuyerSettingsAPI(formData)
            if (response?.status === 200) {
                dispatch(changeLanguage(!languageChanged))
                setSuccessMsg(response?.message)
                setSpin(false)
                setTimeout(() => {
                    reset()
                    getSettings()
                    setSuccessMsg(null)
                }, 2000)
            }
            else {
                setErrMsg(response?.message)
                setSpin(false)
                setTimeout(() => {
                    setErrMsg(null)
                }, 2000)
            }

        }
    };

    const getSettings = async () => {
        setLoading(true)
        const response = await getBuyerSettingsAPI()
        
        if (response?.status === 200) {
            setSettingsData(response?.data)
            // const path = response?.data.logo.split('\\')
            const ImageURL = `${response?.data.logo}`
            setImgPath(ImageURL)
            dispatch(getIsShow(true))
            setEdit(false)
            setLoading(false)
            reset(response?.data)
        }
        else if (response?.status === 404) {
            setSettingsData(null)
            setEdit(true)
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
 
    useEffect(() => {
        getSettings(true)
    }, [])

    const editSettings = (e) => {
        e.preventDefault()
        setEdit(true)
        setIsEditing(true);
        reset(settingsData)
    }

    return (
        <div className='app-container'>
            {user?.user_role === "buyer" ? (
                <>
                    {loading ? (
                        <Loader />
                    ) : (
                        <>
                            <div className='head pt-2 d-flex align-items-center justify-content-between'>
                                <h2 className='primary-color text-center flex-grow-1 m-0'>
                                    {translations[app_language]?.settings}
                                </h2>
                            </div>

                            <div className="container mt-4">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="row">
                                            {/* {sub_status ?  */}
                                            <div className="col-12 text-end mb-2">
                                                {(!settingsData || edit) && (
                                                    <button type="submit" className="submit-btn py-2 px-2">
                                                        {spin ? <Spinner /> : translations[app_language]?.saveSettings}
                                                    </button>
                                                )}
                                                {(settingsData && !edit) && (
                                                    <button
                                                        type="button"
                                                        className="submit-btn py-2 px-2"
                                                        onClick={editSettings}
                                                    >
                                                        {spin ? <Spinner /> : translations[app_language]?.editSettings}
                                                    </button>
                                                )}
                                            </div> 
                                            {/* : ""} */}
                                        </div>
                                        <div className='border border-muted p-3 mb-4'>
                                            <h4 className='mb-2 input-heading'>{translations[app_language]?.shopDetail}</h4>
                                            <div className="row my-2 set_div">
                                                <div className="col-md-4">
                                                    <label htmlFor="shopName">{translations[app_language]?.shopName}</label>
                                                    <input
                                                        id="shopName"
                                                        type="text"
                                                        className="form-control"
                                                        onWheel={(e) => e.target.blur()}
                                                        {...register('shop_name', {
                                                            required: 'Shop Name is required',
                                                        })}
                                                        disabled={!edit}
                                                    />
                                                    {errors.shop_name && <p className="text-danger">{errors.shop_name.message}</p>}
                                                </div>

                                                <div className="col-md-4">
                                                    <label htmlFor="shopAddress">{translations[app_language]?.shopAddress}</label>
                                                    <input
                                                        id="shopAddress"
                                                        type="text"
                                                        className="form-control"
                                                        onWheel={(e) => e.target.blur()}
                                                        {...register('shop_address', {
                                                            required: 'Shop Address is required',
                                                        })}
                                                        disabled={!edit}
                                                    />
                                                    {errors.shop_address && <p className="text-danger">{errors.shop_address.message}</p>}
                                                </div>

                                                <div className="col-md-4">
                                                    <label>{translations[app_language]?.shopLogo}</label>
                                                    {settingsData?.logo && !edit && (
                                                        <img src={imgPath} alt="logo" className="img-fluid" width={100} height={50} />
                                                    )}
                                                    {(!settingsData || isEditing) && (
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            {...register("file", {
                                                                required: !isEditing,
                                                            })}
                                                            disabled={!edit}
                                                        />
                                                    )}
                                                    {errors.file && <p className="text-danger">Logo is required</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='border border-muted p-3 mb-4'>
                                            <h4 className='mb-2 input-heading'>{translations[app_language]?.deductions}</h4>
                                            <div className="row my-2 set_div">
                                                <div className="col-md-3">
                                                    <label htmlFor="dis_show">{translations[app_language]?.discountShow}</label>
                                                    <select
                                                        id="dis_show"
                                                        className="form-select"
                                                        {...register('discount_show', {
                                                            required: 'Discount Show is required',
                                                        })}
                                                        disabled={!edit}
                                                    >
                                                        <option value={0}>{translations[app_language]?.no}</option>
                                                        <option value={1}>{translations[app_language]?.yes}</option>
                                                    </select>
                                                    {errors.discount_show && <p className="text-danger">{errors.discount_show.message}</p>}
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="discount">{translations[app_language]?.discount}</label>
                                                    <select
                                                        id="discount"
                                                        className="form-select"
                                                        {...register('discount', {
                                                            required: 'Discount is required',
                                                        })}
                                                        disabled={!edit}
                                                    >
                                                        <option value="percentage">%</option>
                                                        <option value="amount">Rs</option>
                                                    </select>
                                                    {errors.discount && <p className="text-danger">{errors.discount.message}</p>}
                                                </div>

                                                <div className="col-md-3">
                                                    <label htmlFor="payment">{translations[app_language]?.paymentMode}</label>
                                                    <select
                                                        id="payment"
                                                        className="form-select"
                                                        {...register('payment_mode', {
                                                            required: 'Payment Mode is required',
                                                        })}
                                                        disabled={!edit}
                                                    >
                                                        <option value="cash">Cash</option>
                                                        <option value="upi">UPI</option>
                                                    </select>
                                                    {errors.payment_mode && <p className="text-danger">{errors.payment_mode.message}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='border border-muted p-3'>
                                            <h4 className='mb-2 input-heading'>{translations[app_language]?.language}</h4>
                                            <div className="row my-2 set_div">
                                                <div className="col-md-4">
                                                    <label htmlFor="app_language">{translations[app_language]?.appLanguage}</label>
                                                    <select
                                                        id="app_language"
                                                        className="form-select"
                                                        {...register('app_language', {
                                                            required: 'App Language is required',
                                                        })}
                                                        disabled={!edit}
                                                    >
                                                        <option value="english">English</option>
                                                        <option value="tamil">தமிழ்</option>
                                                    </select>
                                                    {errors.app_language && <p className="text-danger">{errors.app_language.message}</p>}
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="language">{translations[app_language]?.billLanguage}</label>
                                                    <select
                                                        id="language"
                                                        className="form-select"
                                                        {...register('language', {
                                                            required: 'Language is required',
                                                        })}
                                                        disabled={!edit}
                                                    >
                                                        <option value="english">English</option>
                                                        <option value="tamil">தமிழ்</option>
                                                    </select>
                                                    {errors.language && <p className="text-danger">{errors.language.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                            </div>
                        </>
                    )
                    }
                    <SuccessAlert val={successMsg} msg={successMsg}/>
                    <ErrorAlert val={errMsg} msg={errMsg}/> 
                </>
            ) : (
                <>
                    {user ? <AccessDenied /> : <Loader />}
                </>
            )}
        </div >
    );
}

export default Settings;
