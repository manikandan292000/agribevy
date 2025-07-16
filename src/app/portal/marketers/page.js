"use client"
import AccessDenied from '@/src/Components/AccessDenied'
import Loader from '@/src/Components/Loader'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { FaMobileScreenButton } from 'react-icons/fa6'
import { deleteMarketerAPI, getMarketerbyBuyer, updatMarketerAPI } from '@/src/Components/Api'
import Spinner from '@/src/Components/Spinner'
import { BsShop } from 'react-icons/bs'
import { FaUserEdit } from 'react-icons/fa';
import { FiAlertTriangle } from 'react-icons/fi';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import {IoCloseCircleOutline } from 'react-icons/io5'
import SuccessAlert from '@/src/Components/SuccessAlert'
import ErrorAlert from '@/src/Components/ErrorAlert'

const Marketers = () => {
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false)
  const user = useSelector((state) => state?.user?.userDetails)
  // const sub_status = useSelector((state) => state?.user?.subscription)
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const app_language = useSelector((state) => state?.user?.app_language)
  const [tableData, setTableData] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null)
  const [errMsg, setErrMsg] = useState(null)
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true)
  const [spinAdd, setSpinAdd] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [removeMobile, setRemoveMobile] = useState(null);

  const translations = useSelector((state) => state?.language?.translations)
  const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();
    const [isOffCanvasOpenEdit, setIsOffCanvasOpenEdit] = useState(false)
  const phonePattern = /^[0-9]{10}$/;

  const filteredData = tableData?.filter((item) =>
    item?.marketer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.marketer_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item?.marketer_mobile?.includes(searchQuery)
  );

  const closeFunc = () => {
    reset()
    setIsOffCanvasOpen(false)
  }
  const closeFunc2 = () => {
    reset2()
    setIsOffCanvasOpenEdit(false)
  }
  const closeWarning = () => {
    setShowAlert(false);   
    setRemoveMobile(null);    
  };
  
  const showWarning = (mobile) => {
    console.log(mobile)
    setRemoveMobile(mobile);  
    setShowAlert(true);       
  };


  const onSubmitBuyer = async (data) => {
    setSpinAdd(true)
    const response = await addMarketerbyBuyerAPI(data)
    console.log(data)

    if (response?.status === 200) {
      const newMarketer = {
        marketer_name: data.name,
        marketer_mobile: data.mobile,
        marketer_address: data.address
      }
      setTableData(prev => [...(prev || []), newMarketer])
      setSuccessMsg(response?.message)
      setSpinAdd(false)
      setTimeout(() => {
        setSuccessMsg(null)
        setIsOffCanvasOpen(false)
        reset()
      }, 2000)
    } else {
      setErrMsg(response.message)
      setSpinAdd(false)
      setTimeout(() => {
        setErrMsg(null)
      }, 2000)
    }
  }

  const openEditCanvas = (e, user) => {
    e.stopPropagation()
    setEditUser(user)
    reset2({
      name: user?.marketer_name,
      mobile: user?.marketer_mobile,
      address: user?.marketer_address
    })
    setIsOffCanvasOpenEdit(true)
    setShowAlert(false)
    setIsOffCanvasOpen(false)
    setRemoveMobile(null)
  }

  const getMarketerList = async () => {
    setLoading(true)
    const response = await getMarketerbyBuyer()

    if (response?.status === 200) {
      setTableData(response.data)
    } else {
      setErrMsg(response.message)
      setTimeout(() => {
        setErrMsg(null)
      }, 2000)
    }
    setLoading(false)
  }



 const onEditMarketer = async (data) => {
  setSpinAdd(true);

  const payload = {
    name: data.name,
    mobile: data.mobile,
    address: data.address,
  };


  const response = await updatMarketerAPI(payload);

  if (response?.status === 200) {
    setSuccessMsg(response.message);
    setSpinAdd(false);
    setTimeout(() => {
      setSuccessMsg(null);
      setIsOffCanvasOpenEdit(false);
      setShowAlert(false);
      reset2();
      getMarketerList(); // <- fixed
      reset();
    }, 2000);
  } else {
    setErrMsg(response.message);
    setSpinAdd(false);
    setTimeout(() => {
      setErrMsg(null);
    }, 2000);
  }
};

  
const removeUserDetails = async () => {
  setLoading(true);
  setShowAlert(false);

  const mobile = {
    mobile: removeMobile,
  };

  const response = await deleteMarketerAPI(mobile);
  if (response?.status === 200) {
    setSuccessMsg(response?.message);
    setTimeout(() => {
      setRemoveMobile(null);
      getMarketerList()
      setIsOffCanvasOpenEdit(false);
      setSuccessMsg(null);
     
    }, 2000);
  } else {
    setErrMsg(response.message);
    setLoading(false);
    setTimeout(() => {
      setErrMsg(null);
    }, 2000);
  }
};

console.log(removeMobile);


  useEffect(() => {
    getMarketerList()
  }, [])

  return (
    <div className='app-container'>
      {user?.user_role === "buyer" ? (
        <>
          {loading ? <Loader /> : (
            <>
              <div className='head pt-2 text-center'>
                <h2 className='primary-color'>Marketers directory</h2>
              </div>

              <div className='d-flex justify-content-end mt-4'>
                <button className='submit-btn py-2' onClick={() => setIsOffCanvasOpen(true)}>Add Marketer</button>
              </div>

              <div className='d-flex justify-content-end mt-3'>
                <input
                  type="text"
                  className='search-input'
                  placeholder='Search'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className='row mt-3'>
                {filteredData?.length > 0 ? (
                  filteredData?.map((v, i) => (
                    <div className='col-md-6 col-lg-4' key={i}>
                      <div className="profile-card card border-0 rounded-4 p-4 m-3">
                        <div className="profile-header">
                          <div className="d-flex align-items-center gap-4">
                            <div>
                              <h3 className="profile-name">{v?.marketer_name}</h3>
                              <div className="profile-shop">
                                <div className="profile-icon"><BsShop /></div>
                                {v?.marketer_address}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="profile-info">
                          <div className="profile-mobile">
                            <FaMobileScreenButton />
                            {v?.marketer_mobile}
                          </div>
                        </div>
                        <div className="edit-assistant mt-3 d-flex gap-2 align-items-center">
                          <FaUserEdit
                            size={24}
                            // className={sub_status ? 'pointer primary-color' : 'disabled primary-color'}
                            className='pointer primary-color'
                            onClick={(e) => openEditCanvas(e, v)}
                          />
                         <button
                              type="button"
                              style={{ cursor: "pointer" }}
                              className="border-0 bg-white p-0 primary-color"
                              // disabled={!sub_status}
                              onClick={() => showWarning(v?.marketer_mobile)}
                              // onClick={()=>console.log(58)}
                            >
                              <RiDeleteBin5Fill size={24} />
                            </button>

                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-danger fw-bold fs-3 text-center'>No records found</p>
                )}
              </div>

              {/* ============ Offcanvas Form ============== */}
              <div
                className={`offcanvas offcanvas-end ${isOffCanvasOpen ? "show" : ""}`}
                tabIndex="-1"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
              >
                <div className="offcanvas-header">
                  <h5 id="offcanvasRightLabel">Add Marketer</h5>
                  <button type="button" className="btn-close text-reset" onClick={closeFunc}></button>
                </div>

                <div className="offcanvas-body">
                  <div className="row canva">
                    <div className="col-12 card-section">
                      <div className="login-sign-form-section">
                        <form className="login-sign-form mt-4" onSubmit={handleSubmit(onSubmitBuyer)}>
                          <div className="form-group">
                            <div className="label-time">
                              <label>Nick Name<sup className="super">*</sup></label>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              {...register("name", { required: "Please enter the Nick Name" })}
                            />
                            <p className="err-dev">{errors?.name?.message}</p>
                          </div>

                          <div className="form-group">
                            <div className="label-time">
                              <label>Mobile number<sup className="super">*</sup></label>
                            </div>
                            <input
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              onInput={(e) => {
                                if (e.target.value.length > 10) {
                                  e.target.value = e.target.value.slice(0, 10)
                                }
                              }}
                              className="form-control"
                              {...register("mobile", {
                                required: "Please enter the Marketer Mobile number",
                                pattern: {
                                  value: phonePattern,
                                  message: "Incorrect phone number"
                                }
                              })}
                            />
                            <p className="err-dev">{errors?.mobile?.message}</p>
                          </div>

                          <div className="form-group">
                            <div className="label-time">
                              <label>Shop name<sup className="super">*</sup></label>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              {...register("address", { required: "Please enter the Marketer Shop name" })}
                            />
                            <p className="err-dev">{errors?.address?.message}</p>
                          </div>

                          <div className="d-flex justify-content-center mt-4">
                            <button type="submit" className="start_btn">
                              {spinAdd ? <Spinner /> : "Submit"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                     <div
                        className={`offcanvas offcanvas-end ${isOffCanvasOpenEdit ? "show" : ""}`}
                        id="offcanvasRight"
                        aria-labelledby="offcanvasRightLabel"
                    >
                        <div className="offcanvas-header">
                            <h5 id="offcanvasRightLabel">{translations[app_language]?.ed}</h5>
                            <button
                                type="button"
                                className="btn-close text-reset"
                                onClick={closeFunc2}
                            ></button>
                        </div>
                        <div className="offcanvas-body">
                            <div className="row canva">
                                <div className="col-12 card-section">
                                    <div className="login-sign-form-section">
                                        <form
                                            className="login-sign-form mt-4"
                                            onSubmit={handleSubmit2(onEditMarketer)}
                                        >
                                            <div className="form-group">
                                                <div className="label-time">
                                                    <label>
                                                        {translations[app_language]?.nickName}<sup className="super">*</sup>
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    {...register2("name", {
                                                        required: "Please enter the Buyer's Nick name",
                                                        onChange: (e) => setEditUser({ ...editUser, marketer_name: e.target.value })
                                                    })}
                                                    value={editUser?.marketer_name}
                                                />
                                                <p className="err-dev">{errors2?.name?.message}</p>
                                            </div>

                                            <div className="form-group">
                                                <div className="label-time">
                                                    <label>
                                                        {translations[app_language]?.mobileNumber}<sup className="super">*</sup>
                                                    </label>
                                                </div>
                                                <input
                                                    type="number"
                                                    onInput={(e) => {
                                                        if (e.target.value.length > 10) {
                                                            e.target.value = e.target.value.slice(0, 10);
                                                        }
                                                    }}
                                                    onWheel={(e) => e.target.blur()}
                                                    name="mobile"
                                                    className="form-control"
                                                    readOnly
                                                    {...register2("mobile", {
                                                        required: "Please enter the Buyer Mobile number",
                                                        pattern: {
                                                            value: phonePattern,
                                                            message: "Incorrect phone number",
                                                        },
                                                    })}
                                                    value={editUser?.marketer_mobile}
                                                    onChange={(e) => setEditUser({ ...editUser, marketer_mobile: e.target.value })}
                                                />
                                                <p className="err-dev">{errors2?.mobile?.message}</p>
                                            </div>

                                            <div className="form-group">
                                                <div className="label-time">
                                                    <label>
                                                        {translations[app_language]?.shopName}<sup className="super">*</sup>
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    className="form-control"
                                                    {...register2("address", {
                                                        required: "Please enter the Buyer Shop name ",
                                                        onChange: (e) => setEditUser({ ...editUser, marketer_address: e.target.value })
                                                    })}
                                                    value={editUser?.marketer_address}
                                                />
                                                <p className="err-dev">{errors2?.address?.message}</p>
                                            </div>

                                            <div className="d-flex justify-content-center mt-4">
                                                <button
                                                    type="submit"
                                                    className="start_btn"
                                                > 
                                                    {spinAdd ? <Spinner /> : translations[app_language]?.submit}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className={`modal ${showAlert ? "show" : ""} col-5`}>
                      <div className="modal-dialog">
                        <div className="modal-dialog modal-confirm">
                          <div className="modal-content">
                            <div className="modal-header">
                              <div className="icon-box" onClick={closeWarning}>
                                <IoCloseCircleOutline className='close pointer' size={28} />
                              </div>
                              <div className="col-12 text-center">
                                <FiAlertTriangle size={40} className='text-danger' />
                              </div>
                              <div className="col-12">
                                <h4 className="modal-title w-100">{translations[app_language]?.areYouSure}?</h4>
                              </div>
                            </div>
                            <div className="modal-body">
                              <p className='text-center'>{translations[app_language]?.confirmWarning} {translations[app_language]?.buyerDelete}</p>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary" onClick={closeWarning}>{translations[app_language]?.cancel}</button>
                              <button type="button" className="btn btn-secondary" onClick={removeUserDetails}>{translations[app_language]?.delete}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


              {/* Success & Error Messages */}
              <SuccessAlert val={successMsg} msg={successMsg}/>
              <ErrorAlert val={errMsg} msg={errMsg}/> 

            </>
          )}
        </>
      ) : (
        <>
          {user ? <AccessDenied /> : <Loader />}
        </>
      )}
    </div>
  )
}

export default Marketers