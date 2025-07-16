"use client"
import React, { useEffect, useState } from 'react'
import { getAllVegetablesAPI, getBuyerProductsbytype, postBuyerProducts } from '@/src/Components/Api';
import Loader from '@/src/Components/Loader';
import TabButton from '@/src/Components/TabButton';
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import Select from "react-select";
import Spinner from "@/src/Components/Spinner"
import SuccessAlert from '@/src/Components/SuccessAlert';
import ErrorAlert from '@/src/Components/ErrorAlert';

const Buyer = () => {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errMsg, setErrMsg] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const translations = useSelector((state) => state?.language?.translations)
  const [isOffCanvasOpenEdit, setIsOffCanvasOpenEdit] = useState(false)
  const app_language = useSelector((state) => state?.user?.app_language)
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false)
  const [vegetableOptions, setVegetableOptions] = useState(null)
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const language = useSelector((state) => state?.user?.language)
  const [isEditMode, setIsEditMode] = useState(false);
  const [spinAdd, setSpinAdd] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const {
         register: register2,
         handleSubmit: handleSubmit2,
         reset: reset2,
         formState: { errors: errors2 }
       } = useForm();
       

  const closeFunc = () => {
    reset({
        price: ""
    })
    setSelectedVegetable(null)
    setIsOffCanvasOpen(false)
    setSuccessMsg(null)
    setIsEditMode(false)
}
const closeFunc2 = () => {
    reset2()
    setIsOffCanvasOpenEdit(false)
}

    const getVegetables = async () => {
        setLoading(true)
        const response = await getAllVegetablesAPI()

        if (response?.status === 200) {
            const mappedVegetableOptions = response?.data?.map(option => ({
                value: option?.veg_id,
                label: language === "tamil" ? option?.tamil_name : option?.veg_name,
            }));
            setVegetableOptions(mappedVegetableOptions)
        } else {
            setErrMsg(response.message)
            setTimeout(() => setErrMsg(null), 2000)
        }
        setLoading(false)
    }



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const [activeType, setActiveType] = useState('own');

  const [data, setData] = useState([])

  const getAllOwnDetails = async () => {
    setLoading(true)
    const response = await getBuyerProductsbytype("own")
    if (response?.status === 200) {
      setDetails(response?.data)
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

  const getAllMarketerDetails = async () => {
    setLoading(true)
    const response = await getBuyerProductsbytype("marketer")
    if (response?.status === 200) {
      setData(response?.data)
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


     const onSubmitProduct = async (formData) => {
          
          if (!selectedVegetable) {
              setErrMsg(response?.message);
              return;
          }
          const payload = {
              veg_id: selectedVegetable?.value,
              veg_name: selectedVegetable?.label,
              // tamil_name: language === "tamil" ? selectedVegetable?.label : "",
              price: formData.price,
              unit: formData.unit,
              quantity: formData.quantity
          };
  
          setSpinAdd(true);
          const response = await postBuyerProducts(payload);
  
          if (response?.status === 200) {
             getAllOwnDetails();
              setSpinAdd(false);
              setSelectedVegetable(null);
              setSuccessMsg(response?.message);
              setIsOffCanvasOpen(false)
              reset()
              setTimeout(() => setSuccessMsg(null), 3000);
              setIsEditMode(false); // reset after submit
          } else {
              setErrMsg(response?.message || "Failed to add price");
              setTimeout(() => setErrMsg(null), 2000);
              setSpinAdd(false);
          }
      };


      
  

  useEffect(() => {
    getAllOwnDetails()
    getAllMarketerDetails()
    getVegetables()
  }, [])

  

  return (

    
    <div className='app-container'>
      
      {loading ?
        <Loader /> :
        <>
          <div className="farmer-dashboard">
            <div className='head pt-2 text-center mb-4'>
              <h2 className='primary-color'>My Purchases</h2>
            </div>


                   <div className='d-flex justify-content-end mt-4'>
                            <button
                                className='submit-btn py-2 px-2'
                                onClick={() => {
                                    reset();
                                    setSelectedVegetable(null);
                                    setErrMsg(null);
                                    setSuccessMsg(null);
                                    setIsEditMode(false);
                                    setIsOffCanvasOpen(true);
                                }}
                            >
                                {translations[app_language]?.addproducts}
                            </button>
                        </div>


            <div className='d-flex justify-content-between flex-wrap mb-4'>
              <div>
              <TabButton
                  active={activeType === 'own'}
                  onClick={() => {
                    setActiveType('own');
                  }}
              >
                own
              </TabButton>
              <TabButton
                active={activeType === 'marketer'}
                onClick={() => {
                  setActiveType('marketer');
                }}
              >
                marketer
              </TabButton>
              </div>
            </div>
          
          {activeType === "own" ?
             <>
               {details?.length > 0 ?
               <div className="farmer-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[...details]?.reverse().map((item, index) => (
                  <div key={index} className="farmer-card">
                    <div className="farmer-card-header">
                      <h2 className="text-xl font-semibold mb-0">{item?.veg_name}</h2>
                    </div>

                    <div className="farmer-card-body ">
                      <div className="farmer-card-info space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-semibold">{item?.quantity} Kg</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-semibold">₹{item?.price}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Marketer:</span>
                          <span className="font-semibold">{item?.marketer_name}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-semibold">{formatDate(item?.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="farmer-card-footer p-3">
                      {/* <button className={`text-center py-1 px-3 rounded-full border-0 status_btn ${getStatusClass(item.status)}`} disabled={item.status === "unsold"} onClick={() => router.push("/portal/salesinfo/info")}>{getStatusValue(item.status)}</button> */}

                      <div className="d-flex align-items-center">
                        <span className="me-2">Payment:</span>
                        <span className={`badge ${(item?.buyer_status) === "paid" ? 'bg-success' : item?.buyer_status === "partly_paid" ? "bg-warning" : 'bg-danger'}`}>
                          {(item?.buyer_status) === "paid" ? 'Paid' : item?.buyer_status === "partly_paid" ? "Partly paid" : 'Unpaid'}
                        </span>
                      </div>

                      <div className="d-flex align-items-center">
                        <span className="me-2">Invoice</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              :
              <p className='text-danger fw-bold fs-3 text-center mt-5'>No records found</p>
            }

             </>
              :
            <>
             {data?.length > 0 ?
              <div className="farmer-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.map((item, index) => (
                  <div key={index} className="farmer-card">
                    <div className="farmer-card-header">
                      <h2 className="text-xl font-semibold mb-0">{item?.veg_name}</h2>
                    </div>

                    <div className="farmer-card-body ">
                      <div className="farmer-card-info space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-semibold">{item?.quantity} Kg</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-semibold">₹{item?.price}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Marketer:</span>
                          <span className="font-semibold">{item?.marketer_name}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-semibold">{formatDate(item?.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="farmer-card-footer p-3">
                      {/* <button className={`text-center py-1 px-3 rounded-full border-0 status_btn ${getStatusClass(item.status)}`} disabled={item.status === "unsold"} onClick={() => router.push("/portal/salesinfo/info")}>{getStatusValue(item.status)}</button> */}

                      <div className="d-flex align-items-center">
                        <span className="me-2">Payment:</span>
                        <span className={`badge ${(item?.buyer_status) === "paid" ? 'bg-success' : item?.buyer_status === "partly_paid" ? "bg-warning" : 'bg-danger'}`}>
                          {(item?.buyer_status) === "paid" ? 'Paid' : item?.buyer_status === "partly_paid" ? "Partly paid" : 'Unpaid'}
                        </span>
                      </div>

                      <div className="d-flex align-items-center">
                        <span className="me-2">Invoice</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              :
              <p className='text-danger fw-bold fs-3 text-center mt-5'>No records found</p>
            }
          </>
          }         
          </div>






          <div className={`offcanvas offcanvas-end ${isOffCanvasOpen ? "show" : ""}`} tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                            <div className="offcanvas-header">
                                <h5 id="offcanvasRightLabel">{translations[app_language]?.addproducts}</h5>
                                <button type="button" className="btn-close text-reset" onClick={closeFunc}></button>
                            </div>

                            <div className="offcanvas-body">
                                <div className="row canva">
                                    <div className="col-12 card-section">
                                        <div className="login-sign-form-section">
                                            <form className="login-sign-form mt-4" onSubmit={handleSubmit(onSubmitProduct)}>
                                                <div className="form-group">
                                                    <div className="label-time">
                                                        <label>{translations[app_language]?.vegetable}<sup className="super">*</sup></label>
                                                    </div>
                                                    <Select
                                                        options={vegetableOptions}
                                                        value={selectedVegetable}
                                                        onChange={(selected) => setSelectedVegetable(selected)}
                                                        placeholder={translations[app_language]?.chooseVegetables}
                                                    />
                                                    <p className="err-dev">{!selectedVegetable && errMsg}</p>
                                                </div>

                                                
                                                <div className="form-group">
                                                    <div className="label-time">
                                                        <label>{translations[app_language]?.quantity}<sup className="super">*</sup></label>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        className="form-control"
                                                        {...register("quantity", {
                                                            required: "Please enter the Quantity"
                                                        })}
                                                    />
                                                    <p className="err-dev">{errors?.quantity?.message}</p>
                                                </div>

                                                <div className="form-group">
                                                    <label className='label-time'>
                                                        {translations[app_language]?.units} <sup className="super">*</sup>
                                                    </label>
                                                    <div>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="kg"
                                                                {...register("unit", {
                                                                    required: "Please select a unit"
                                                                })}
                                                            />
                                                            &nbsp; {translations[app_language]?.perKg}
                                                        </label>
                                                        <label style={{ marginLeft: "15px" }}>
                                                            <input
                                                                type="radio"
                                                                value="total"
                                                                {...register("unit", {
                                                                    required: "Please select a unit"
                                                                })}
                                                            />
                                                            &nbsp; {translations[app_language]?.total}
                                                        </label>
                                                    </div>
                                                    <p className="err-dev">{errors?.unit?.message}</p>
                                                </div>

                                                <div className="form-group">
                                                    <div className="label-time">
                                                        <label>{translations[app_language]?.price}<sup className="super">*</sup></label>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        className="form-control"
                                                        {...register("price", {
                                                            required: "Please enter the Price"
                                                        })}
                                                    />
                                                    <p className="err-dev">{errors?.price?.message}</p>
                                                </div>

                                                <div className="d-flex justify-content-center mt-4">
                                                    <button type="submit" className="start_btn">
                                                        {spinAdd ? <Spinner /> : translations[app_language]?.submit}
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
                                <h5 id="offcanvasRightLabel">{translations[app_language]?.editproducts}</h5>
                                <button
                                    type="button"
                                    className="btn-close text-reset"
                                    onClick={closeFunc2}
                                ></button>
                            </div>
                            {/* ============ offcanvas create ====================== */}
                            <div className="offcanvas-body">
                                <div className="row canva">
                                    <div className="col-12 card-section">

                                        <div className="login-sign-form-section">
                                            <form
                                                className="login-sign-form mt-4"
                                                onSubmit={handleSubmit2((formData) => onEditProduct(id, formData))}
                                            >
                                                <div className="form-group">
                                                    <div className="label-time">
                                                        <label>{translations[app_language]?.vegetable}<sup className="super">*</sup></label>
                                                    </div>
                                                    <Select
                                                        options={vegetableOptions}
                                                        value={selectedVegetable}
                                                        onChange={(selected) => setSelectedVegetable(selected)}
                                                        placeholder={translations[app_language]?.chooseVegetables}
                                                    />
                                                    <p className="err-dev">{!selectedVegetable && errMsg}</p>
                                                </div>


                                                <div className="form-group">
                                                    <div className="label-time">
                                                        <label>{translations[app_language]?.quantity}<sup className="super">*</sup></label>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        className="form-control"
                                                        {...register2("quantity", {
                                                            required: "Please enter the Quantity"
                                                        })}
                                                        />
                                                        <p className="err-dev">{errors2?.quantity?.message}</p>

                                                </div>




                                                <div className="form-group">
                                                    <label className='label-time'>
                                                        {translations[app_language]?.units} <sup className="super">*</sup>
                                                    </label>
                                                    <div>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                value="kg"
                                                                {...register2("unit", {
                                                                    required: "Please select a unit"
                                                                })}
                                                            />
                                                            &nbsp; {translations[app_language]?.perKg}
                                                        </label>
                                                        <label style={{ marginLeft: "15px" }}>
                                                            <input
                                                                type="radio"
                                                                value="total"
                                                                {...register2("unit", {
                                                                    required: "Please select a unit"
                                                                })}
                                                            />
                                                            &nbsp; {translations[app_language]?.total}
                                                        </label>
                                                    </div>
                                                    <p className="err-dev">{errors?.unit?.message}</p>
                                                </div>


                                                <div className="form-group">
                                                    <div className="label-time">
                                                        <label>{translations[app_language]?.price}<sup className="super">*</sup></label>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        className="form-control"
                                                        {...register2("price", {
                                                            required: "Please enter the Price"
                                                        })}
                                                    />
                                                    <p className="err-dev">{errors2?.price?.message}</p>
                                                </div>

                                                
                                                <div className="d-flex justify-content-center mt-4">
                                                    <button type="submit" className="start_btn">
                                                        {spinAdd ? <Spinner /> : translations[app_language]?.submit}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SuccessAlert val={successMsg} msg={successMsg} />
                        <ErrorAlert val={errMsg} msg={errMsg} />
          
                      
        </>}
    </div>
  )
}

export default Buyer