"use client"
import AccessDenied from "@/src/Components/AccessDenied"
import { getAllVegetablesAPI, getBuyerProducts, postBuyerProducts, editBuyerProducts, deleteBuyerProducts, } from "@/src/Components/Api"
import Loader from "@/src/Components/Loader"
import Spinner from "@/src/Components/Spinner"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import Select from "react-select";
import { IoCloseCircleOutline } from 'react-icons/io5'
import { FiAlertTriangle } from 'react-icons/fi';
import TabButton from '@/src/Components/TabButton';
import SuccessAlert from "@/src/Components/SuccessAlert"
import ErrorAlert from "@/src/Components/ErrorAlert"

const Buyerproducts = () => {
    const user = useSelector((state) => state?.user?.userDetails)
    const app_language = useSelector((state) => state?.user?.app_language)
    const translations = useSelector((state) => state?.language?.translations)
    const language = useSelector((state) => state?.user?.language)
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false)
    const [spinAdd, setSpinAdd] = useState(false)
    const [vegetableOptions, setVegetableOptions] = useState(null)
    const [errMsg, setErrMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [selectedVegetable, setSelectedVegetable] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isOffCanvasOpenEdit, setIsOffCanvasOpenEdit] = useState(false)
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        reset: reset2,
        formState: { errors: errors2 }
    } = useForm();

    const [showAlert, setShowAlert] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [id, setId] = useState(null)
    const [activeType, setActiveType] = useState('sold');

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



    useEffect(() => {
        if (!isEditMode) {
            reset();
            setSelectedVegetable(null);
        }
    }, [isEditMode]);

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
            getProductList();
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

    const getProductList = async () => {
        setLoading(true)
        const response = await getBuyerProducts()

        if (response?.status === 200) {
            setProduct(response.data)
        } else {
            setErrMsg(response.message)
            setTimeout(() => setErrMsg(null), 2000)
        }
        setLoading(false)
    }


    const handleEdit = (vegData) => {
        setId(vegData?.product_id)
        setIsEditMode(true);
        setSelectedVegetable({
            value: vegData.veg_id,
            label: language === "tamil"
                ? (vegData?.tamil_name && vegData?.tamil_name.trim() !== "" ? vegData?.tamil_name : vegData?.veg_name)
                : vegData.veg_name,
        });

        reset2({
            price: vegData.price,
            quantity: vegData.quantity || "",
            unit: vegData.unit,
            veg_name: vegData.veg_name
        });
        setIsOffCanvasOpenEdit(true)
        setIsOffCanvasOpen(false);
        setSuccessMsg(null);
        setErrMsg(null);
    };

    const onEditProduct = async (id, formData) => {
        console.log(id,formData);
        
        // const response = await editBuyerProducts(id, formData);

        // if (response?.status === 200) {
        //     setSuccessMsg(response?.message);
        //     setSpinAdd(false);
        //     setTimeout(() => {
        //         setSuccessMsg(null);
        //         setIsOffCanvasOpenEdit(false);
        //         reset();
        //         getProductList();
        //     }, 2000);
        // } else {
        //     setErrMsg(response?.message || "Update failed");
        //     setSpinAdd(false);
        //     setTimeout(() => {
        //         setErrMsg(null);
        //     }, 2000);
        // }
    };


    const ondeleteproduct = async (id) => {
        const response = await deleteBuyerProducts(id);

        if (response?.status === 200) {
            setSuccessMsg(response?.message);
            setSpinAdd(false);
            setTimeout(() => {
                setSuccessMsg(null);
                setIsOffCanvasOpenEdit(false);
                reset();
                getProductList();
            }, 2000);
        } else {
            setErrMsg(response?.message || "Update failed");
            setSpinAdd(false);
            setTimeout(() => {
                setErrMsg(null);
            }, 2000);
        }
    };

    // danger box
    const handleDeleteClick = (product_id) => {
        setSelectedProduct(product_id);
        setShowAlert(true);
    };

    const removeUserDetails = () => {
        if (selectedProduct) {
            setShowAlert(false);
            setSelectedProduct(null);
            ondeleteproduct(selectedProduct)
        }
    };
    const closeWarning = () => {
        setShowAlert(false);
        setSelectedProduct(null);
    };



    useEffect(() => {
        getProductList()
        getVegetables()

    }, [])

    return (
        <div className='app-container'>
            {user?.user_role === "buyer" ?
                <>
                    {loading ? <Loader /> : <>
                        <div className='head pt-2 d-flex align-items-center justify-content-between'>
                            <h2 className='primary-color text-center flex-grow-1 m-0'>
                                {translations[app_language]?.product}
                            </h2>
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
                                    active={activeType === 'sold'}
                                    onClick={() => {
                                        setActiveType('sold');
                                    }}
                                >
                                    Sold
                                </TabButton>
                                <TabButton
                                    active={activeType === 'unsold'}
                                    onClick={() => {
                                        setActiveType('unsold');
                                    }}
                                >
                                    Un Sold
                                </TabButton>
                            </div>
                        </div>




                        {activeType === "sold" ?
                            <>
                                <div className="table-container shadow-none ">
                                    <table className="modern-table product-tab m-auto">
                                        <thead>
                                            <tr>
                                                <th className='text-center'>Name</th>
                                                <th className='text-center'>Quantity</th>
                                                <th className='text-center'>Unit</th>
                                                <th className='text-center'>Price</th>
                                                <th className='text-center'>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product?.length > 0 ?
                                                (product.map((p) => {
                                                    if (p.quantity_available == 0) {
                                                        return (
                                                            <tr key={p.veg_id}>
                                                                <td className='text-center'>
                                                                    {language === "tamil" ? p.tamil_name : p.veg_name}
                                                                </td>
                                                                <td className='text-center'>{p.quantity}</td>
                                                                <td className='text-center'>{p.unit}</td>
                                                                <td className='text-center'>{p.price}</td>
                                                                <td className='text-center'>{p.created_at.split('T')[0]}</td>
                                                            </tr>
                                                        );
                                                    }
                                                })
                                                ) : (<tr>
                                                    <td colSpan="4" className="text-center">{translations[app_language]?.noresults}</td>
                                                </tr>)
                                            }

                                        </tbody>
                                    </table>
                                </div>


                            </>
                            :
                            <>
                                <div className="table-container shadow-none ">
                                    <table className="modern-table product-tab m-auto">
                                        <thead>
                                            <tr>
                                                <th className='text-center'>Name</th>
                                                <th className='text-center'>Quantity</th>
                                                <th className='text-center'>Unit</th>
                                                <th className='text-center'>Price</th>
                                                <th className='text-center'>Date</th>
                                                <th className='text-center'>Edit</th>
                                                <th className='text-center'>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product?.length > 0 ? (
                                                product?.map((p) => (
                                                    <tr key={p.veg_id}>
                                                        <td className='text-center'>
                                                            {language === "tamil" ? p.tamil_name : p.veg_name}
                                                        </td>
                                                        <td className='text-center'>{p.quantity}</td>
                                                        <td className='text-center'>{p.unit}</td>
                                                        <td className='text-center'>{p.price}</td>
                                                        <td className='text-center'>{p.created_at.split('T')[0]}</td>
                                                        <td className='text-center'>
                                                            <button className="edit-btn"
                                                                disabled={p.created_by == "marketer"}
                                                                onClick={() => handleEdit(p)}
                                                            >
                                                                Edit
                                                            </button>
                                                        </td>
                                                        <td className='text-center'>
                                                            <button
                                                                className="edit-btn"
                                                                disabled={p.created_by == "marketer"}
                                                                onClick={() => handleDeleteClick(p.product_id)}
                                                            >
                                                                Delete
                                                            </button>

                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">{translations[app_language]?.noresults}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        }

                        {/* create offcanvas  */}
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

                        {/* edit offcanvas */}

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
                                                    <input
                                                        type="text"
                                                        name="veg_name"
                                                        className="form-control"
                                                        {...register2("veg_name", {
                                                            required: "Please enter the Quantity"
                                                        })}
                                                        disabled
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
                                                                disabled
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
                                                                disabled
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
                                            <p className='text-center'>
                                                {translations[app_language]?.confirmWarning} {translations[app_language]?.buyerDelete}
                                            </p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-primary" onClick={closeWarning}>
                                                {translations[app_language]?.cancel}
                                            </button>
                                            <button type="button" className="btn btn-secondary" onClick={removeUserDetails}>
                                                {translations[app_language]?.delete}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SuccessAlert val={successMsg} msg={successMsg} />
                        <ErrorAlert val={errMsg} msg={errMsg} />
                    </>}
                </>
                :
                <>
                    {loading ? <Loader /> : <AccessDenied />}
                </>
            }
        </div>
    )
}

export default Buyerproducts