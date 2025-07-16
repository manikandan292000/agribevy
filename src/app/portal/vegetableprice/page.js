"use client"
import AccessDenied from "@/src/Components/AccessDenied"
import { getAllVegetableName, getPrice, postpriceAPI, updatepriceAPI, } from "@/src/Components/Api"
import Loader from "@/src/Components/Loader"
import Spinner from "@/src/Components/Spinner"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import Select from "react-select";
import SuccessAlert from "@/src/Components/SuccessAlert"
import ErrorAlert from "@/src/Components/ErrorAlert"

const Vegetableprice = () => {
    const user = useSelector((state) => state?.user?.userDetails)
    const app_language = useSelector((state) => state?.user?.app_language)
    const translations = useSelector((state) => state?.language?.translations)
    const language = useSelector((state) => state?.user?.language)
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [price, setPrice] = useState([])
    const [loading, setLoading] = useState(true)
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false)
    const [spinAdd, setSpinAdd] = useState(false)
    const [vegetableOptions, setVegetableOptions] = useState(null)
    const [errMsg, setErrMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [selectedVegetable, setSelectedVegetable] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isOffCanvasOpenEdit, setIsOffCanvasOpenEdit] = useState(false)
    const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();

    const closeFunc = () => {
        reset({
            price: "",
            key: "",
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

    const onSubmitPrice = async (formData) => {
        if (!selectedVegetable) {
            setErrMsg(response?.message);
            return;
        }
        const payload = {
            veg_id: selectedVegetable?.value,
            veg_name: selectedVegetable?.label,
            tamil_name: language === "tamil" ? selectedVegetable?.label : "",
            price: formData.price,
            key: formData.key,
        };

        setSpinAdd(true);
        const response = await postpriceAPI(payload);
        setSpinAdd(false);

        if (response?.status === 200) {
            getPriceList();
            reset();
            setSelectedVegetable(null);
            setSuccessMsg(response?.message);
            setIsOffCanvasOpen(false)
            setTimeout(() => setSuccessMsg(null), 2000);
            setIsEditMode(false); 
        } else {
            setErrMsg(response?.message || "Failed to add price");
            setTimeout(() => setErrMsg(null), 2000);
        }
    };

    // const getVegetables = async () => {
    //     setLoading(true)
    //     const response = await getAllVegetablesAPI()
    //     console.log(response.data);
        
    //     if (response?.status === 200) {
    //         const mappedVegetableOptions = response?.data?.map(option => ({
    //             value: option?.veg_id,
    //             label: language === "tamil" ? option?.tamil_name : option?.veg_name,
    //         }));
    //         setVegetableOptions(mappedVegetableOptions)
    //     } else {
    //         setErrMsg(response.message)
    //         setTimeout(() => setErrMsg(null), 2000)
    //     }
    //     setLoading(false)
    // }

    const getPriceList = async () => {
        setLoading(true)
        const response = await getPrice()
        // console.log(response?.data);
        
        if (response?.status === 200) {
            setPrice(response?.data)
        } else {
            setErrMsg(response.message)
            setTimeout(() => setErrMsg(null), 2000)
        }
        setLoading(false)
    }

    const getVegetables = async () => {
        setLoading(true);
    
        const [vegetablesResponse, priceListResponse] = await Promise.all([
            getAllVegetableName(),
            getPrice()
        ]);
    
        if (vegetablesResponse?.status === 200 && priceListResponse?.status === 200) {
            const allVegetables = vegetablesResponse.data;
            const priceList = priceListResponse.data;
    
            // Extract veg_ids that are already priced
            const pricedVegIds = priceList.map(item => item.veg_id);
    
            // Filter out already priced vegetables
            const unpricedVegetables = allVegetables.filter(
                veg => !pricedVegIds.includes(veg.veg_id)
            );
    
            const mappedVegetableOptions = unpricedVegetables.map(option => ({
                value: option.veg_id,
                label: language === "tamil" ? option.tamil_name : option.veg_name,
            }));
    
            setVegetableOptions(mappedVegetableOptions);
        } else {
            setErrMsg(
                vegetablesResponse?.message || priceListResponse?.message || "Something went wrong"
            );
            setTimeout(() => setErrMsg(null), 2000);
        }
    
        setLoading(false);
    };
    

    const handleEdit = (vegData) => {
        setIsEditMode(true);
        setSelectedVegetable({
            value: vegData.veg_id,
            label: language === "tamil"
                ? (vegData?.tamil_name && vegData?.tamil_name.trim() !== "" ? vegData?.tamil_name : vegData?.veg_name)
                : vegData.veg_name,
        });
        reset2({
            price: vegData.price,
            key: vegData.short_key || "",
            veg_id: vegData.veg_id
        });
        setIsOffCanvasOpenEdit(true)
        setIsOffCanvasOpen(false);
        setSuccessMsg(null);
        setErrMsg(null);
    };

    const onEditPrice = async (formData) => {
        setSpinAdd(true)
        const response = await updatepriceAPI(formData)
        if (response?.status === 200) {
            setSuccessMsg(response?.message);
            setSpinAdd(false);
            setTimeout(() => {
                setSuccessMsg(null);
                setIsOffCanvasOpenEdit(false)
                reset();
                getPriceList();
            }, 2000);
        } else {
            setErrMsg(response.message);
            setSpinAdd(false)
            setTimeout(() => {
                setErrMsg(null);
            }, 2000);
        }
    }

    useEffect(() => {
        getPriceList()
        // getVegetables()
        getVegetables()
    }, [])

    return (
        <div className='app-container'>
            {user?.user_role === "buyer" ?
                <>
                    {loading ? <Loader /> : 
                    <>
                        <div className='head pt-2 d-flex align-items-center justify-content-between'>
                            <h2 className='primary-color text-center flex-grow-1 m-0'>
                                {translations[app_language]?.dailyPrice}
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
                                {translations[app_language]?.addVeg}
                            </button>
                        </div>

                        <div className="table-container shadow-none ">
                            <table className="modern-table price_table product-tab m-auto">
                                <thead>
                                    <tr>
                                        <th className='text-center'>Name</th>
                                        <th className='text-center'>Price</th>
                                        <th className='text-center'>Shortcut Key</th>
                                        <th className='text-center'>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {price?.length > 0 ? (
                                        price?.map((p) => (
                                            <tr key={p.veg_id}>
                                                <td className='text-center'>
                                                    {language === "tamil" ? p.tamil_name : p.veg_name}
                                                </td>
                                                <td className='text-center'>{p.price}</td>
                                                <td className='text-center'>{p.short_key || "-"}</td>
                                                <td className='text-center'>
                                                    <button className="edit-btn" onClick={() => handleEdit(p)}>
                                                        Edit
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

                        <div className={`offcanvas offcanvas-end ${isOffCanvasOpen ? "show" : ""}`} tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                            <div className="offcanvas-header">
                                <h5 id="offcanvasRightLabel">{translations[app_language]?.addVeg}</h5>
                                <button type="button" className="btn-close text-reset" onClick={closeFunc}></button>
                            </div>

                            <div className="offcanvas-body">
                                <div className="row canva">
                                    <div className="col-12 card-section">
                                        <div className="login-sign-form-section">
                                            <form className="login-sign-form mt-4" onSubmit={handleSubmit(onSubmitPrice)}>
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

                                                <div className="form-group">
                                                    <div className="label-time">
                                                        <label>{translations[app_language]?.shortcutList}<sup className="super">*</sup></label>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="key"
                                                        className="form-control"
                                                        {...register("key", {
                                                            required: "Please enter the key",
                                                        })}
                                                    />
                                                    <p className="err-dev">{errors?.key?.message}</p>
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
                                <h5 id="offcanvasRightLabel">{translations[app_language]?.editVeg}</h5>
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
                                                onSubmit={handleSubmit2(onEditPrice)}
                                            >
                                                <div className="form-group">
                                                    <div className="label-time">
                                                        <label>{translations[app_language]?.vegetable}<sup className="super">*</sup></label>
                                                    </div>
                                                    <Select
                                                        // options={vegetableOptions}
                                                        value={selectedVegetable}
                                                        onChange={(selected) => setSelectedVegetable(selected)}
                                                        placeholder={translations[app_language]?.chooseVegetables}
                                                    />
                                                    <p className="err-dev">{!selectedVegetable && errMsg}</p>
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

                                                <div className="form-group">
                                                    <div className="label-time">
                                                        <label>{translations[app_language]?.shortcutList}<sup className="super">*</sup></label>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="key"
                                                        className="form-control"
                                                        {...register2("key", {
                                                            required: "Please enter the Farmer Location",
                                                        })}
                                                    />
                                                    <p className="err-dev">{errors2?.key?.message}</p>
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

                        <SuccessAlert val={successMsg} msg={successMsg}/>
                        <ErrorAlert val={errMsg} msg={errMsg}/> 
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

export default Vegetableprice