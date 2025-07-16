"use client"
import React, { useEffect, useRef, useState } from 'react';
import { PlusCircle, Trash2, Store } from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { getAllVegetableName, getPrice, postpriceAPI, updatebillAPI } from '@/src/Components/Api';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import AccessDenied from '@/src/Components/AccessDenied';
import Loader from '@/src/Components/Loader';
import Spinner from '@/src/Components/Spinner';
import SuccessAlert from '@/src/Components/SuccessAlert';
import ErrorAlert from '@/src/Components/ErrorAlert';
import Select from "react-select";

const ManualBill = () => {
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const app_language = useSelector((state) => state?.user?.app_language)
    const translations = useSelector((state) => state?.language?.translations)
    const language = useSelector((state) => state?.user?.language)
    const user = useSelector((state) => state?.user?.userDetails)
    const buyerData = useSelector((state) => state?.user?.bill)
    const [items, setItems] = useState([{ veg_name: '', quantity: '', price: '', amount: '' }]);
    const [searchProduct, setSearchProduct] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();
    const [suggestions, setSuggestions] = useState({});
    const [focusedIndex, setFocusedIndex] = useState(null);
    const inputContainerRef = useRef(null);
    const invoiceRef = useRef(null);
    const [successMsg, setSuccessMsg] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errMsg, setErrMsg] = useState(null);
    const [spinAdd, setSpinAdd] = useState(false);
    const [isFill, setIsFill] = useState(false)
    const [vegPopup, setVegPopup] = useState(false)

    const [discountType, setDiscountType] = useState('%'); // '%' or '$'
    const [discountValue, setDiscountValue] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [mobile, setMobile] = useState('');
    const [amount, setAmount] = useState("");
    const [askNamePopup, setAskNamePopup] = useState(false);
    const quantityRefs = useRef([]);

    const [selectedVegetable, setSelectedVegetable] = useState(null);
    const [vegetableOptions, setVegetableOptions] = useState(null)

    // const closeWarning = () =>{
    //     setAskNamePopup(false)
    // }

    const calculateAmount = (quantity, price) => {
        return quantity && price ? (parseFloat(quantity) * parseFloat(price)).toFixed(2) : '';
    };

    const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        let discountAmount = 0;

        if (discountValue && !isNaN(discountValue)) {
            if (discountType === '%') {
                discountAmount = subtotal * parseFloat(discountValue) / 100;
            } else if (discountType === '$') {
                discountAmount = parseFloat(discountValue);
            }
        }

        // The total remains constant, but the cross total is adjusted based on the discount
        return subtotal.toFixed(2);
    };

    const calculateCrossTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        let discountAmount = 0;

        if (discountValue && !isNaN(discountValue)) {
            if (discountType === '%') {
                discountAmount = subtotal * parseFloat(discountValue) / 100;
            } else if (discountType === '$') {
                discountAmount = parseFloat(discountValue);
            }
        }

        // Subtract the discount from the subtotal to get the cross total
        return (subtotal - discountAmount).toFixed(2);
    };


    const handleDiscountChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value)) setDiscountValue(value);
    };

    // const downloadInvoiceAsPDF = async () => {
    //     const element = invoiceRef.current;
    //     const addItemButton = document.querySelector('.add-item-button');
    //     addItemButton.classList.add('hidden-during-pdf');
    //     const addItem = document.querySelector('.add-item');
    //     addItem.classList.remove('justify-content-between');
    //     addItem.classList.add('justify-content-end');

    //     const deleteIconColumns = document.querySelectorAll('.manual_bill td:nth-child(5), .manual_bill th:nth-child(5)');
    //     deleteIconColumns.forEach(col => col.style.display = 'none');

    //     const canvas = await html2canvas(element, { scale: 2 });
    //     const imgData = canvas.toDataURL("image/png");
    //     const pdf = new jsPDF("p", "mm", "a4");
    //     const pageWidth = pdf.internal.pageSize.width;
    //     const imgWidth = pageWidth - 20;
    //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //     let position = 10;
    //     let heightLeft = imgHeight;

    //     pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    //     heightLeft -= pdf.internal.pageSize.height;

    //     while (heightLeft > 0) {
    //         position = heightLeft - imgHeight + 10;
    //         pdf.addPage();
    //         pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    //         heightLeft -= pdf.internal.pageSize.height;
    //     }

    //     pdf.save("invoice.pdf");

    //     deleteIconColumns.forEach(col => col.style.display = '');
    //     addItemButton.classList.remove('hidden-during-pdf');
    //     addItem.classList.add('justify-content-between');
    //     addItem.classList.remove('justify-content-end');
    // };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        if (field === 'veg_name') {
            const searchValue = value.toLowerCase();
            const filtered = searchProduct?.filter((product) =>
                product.short_key.toLowerCase().includes(searchValue) ||
                product.veg_name.toLowerCase().includes(searchValue) ||
                product.tamil_name.toLowerCase().includes(searchValue)
            );
            setSuggestions(prev => ({ ...prev, [index]: filtered }));
            setFocusedIndex(index);
        }

        if (field === 'quantity' || field === 'price') {
            const quantity = field === 'quantity' ? value : newItems[index].quantity;
            const price = field === 'price' ? value : newItems[index].price;
            newItems[index].amount = calculateAmount(quantity, price);
        }

        setItems(newItems);
    };

    // const handleSuggestionSelect = (index, product) => {
    //     const newItems = [...items];
    //     newItems[index].veg_name = product.veg_name;
    //     newItems[index].price = product.price;
    //     newItems[index].quantity = newItems[index].quantity || 1;
    //     newItems[index].amount = calculateAmount(newItems[index].quantity, product.price);
    //     setItems(newItems);
    //     setSuggestions(prev => ({ ...prev, [index]: [] }));
    //     setFocusedIndex(null);
    // };

    const addNewRow = () => {
        setItems([...items, { veg_name: '', quantity: '', price: '', amount: '' }]);
    };

    const removeRow = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const getProductList = async () => {
        const response = await getPrice();
        if (response?.status === 200) {
            setSearchProduct(response?.data);
            setLoading(false)
        } else {
            setErrMsg(response.message)
            setTimeout(() => {
                setErrMsg(null)
                setLoading(false)
            }, 2000)
        }

    };

    // const getDetails = async () => {
    //     const response = await getBuyerDetail();
    //     if (response?.status === 200) {
    //         setDetails(response.data);
    //         console.log(response.data);
    //         setLoading(false)
    //     } else {
    //         setErrMsg(response.message)
    //         setTimeout(() => {
    //             setErrMsg(null)
    //         }, 2000)
    //         setLoading(false)
    //     }
    // };

    const onEditbill = async () => {
        const total = calculateTotal();
        const discount = total - Number(amount);

        const modifyItems = items.filter((item) => {
            return item?.veg_name != ""
        })

        const payload = {
            mobile: mobile,
            paymentMode: paymentMode,
            amt: amount,
            discount: discount,
            item: modifyItems,
        };

        setSpinAdd(true);
        const response = await updatebillAPI(payload);

        if (response?.status === 200) {
            setSuccessMsg(response?.message);
            setSpinAdd(false);
            setTimeout(() => {
                setSuccessMsg(null);
                reset();
                getProductList();
            }, 2000);
        }
        else if (response?.status === 400 && response?.requireCustomerName) {
            setAskNamePopup(true);
            setSpinAdd(false);
        }
        else {
            setErrMsg(response?.message);
            setSpinAdd(false);
            setTimeout(() => {
                setErrMsg(null);
            }, 2000);
        }
    };

    const saleSubmit = async (data) => {
        const total = calculateTotal();
        const discount = total - Number(amount);

        const modifyItems = items.filter((item) => {
            return item?.veg_name != ""
        })

        const payload = {
            mobile: mobile,
            paymentMode: paymentMode,
            amt: amount,
            discount: discount,
            item: modifyItems,
            name: data.name,
        };

        // console.log(payload);

        setSpinAdd(true);
        const response = await updatebillAPI(payload);
        if (response?.status === 200) {
            setSuccessMsg(response?.message);
            setAskNamePopup(false)
            setSpinAdd(false);
            setTimeout(() => {
                setSuccessMsg(null);
                reset();
                // getProductList();
            }, 2000);
        }
        else {
            setErrMsg(response?.message);
            setSpinAdd(false);
            setAskNamePopup(false)
            setTimeout(() => {
                setErrMsg(null);
            }, 2000);
        }

    };

    useEffect(() => {
        getProductList();
        // getDetails()
        const handleClickOutside = (event) => {
            if (inputContainerRef.current && !inputContainerRef.current.contains(event.target)) {
                setSuggestions({});
                setFocusedIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (mobile.length == 10 && items.length > 0 && amount != "") {
            if (items[0]?.veg_name == "" || items[0]?.quantity == "") {
                setIsFill(false)
            } else {
                setIsFill(true)
            }

        } else {
            setIsFill(false)
        }
    }, [mobile, items, amount])

    // for auto set the new row

    const autofillItem = (index, product) => {
        const updatedItems = [...items];
        updatedItems[index] = {
            veg_name: product.veg_name,
            price: product.price,
            quantity: 1,
            amount: calculateAmount(1, product.price)
        };

        if (index === items.length - 1) {
            updatedItems.push({ veg_name: '', quantity: '', price: '', amount: '' });
        }

        setItems(updatedItems);
        setSuggestions(prev => ({ ...prev, [index]: [] }));
    };

    const handleSuggestionClick = (index, product) => {
        autofillItem(index, product);
    };

    const handleItemKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const shortKey = items[index].veg_name?.trim().toLowerCase();

            const matchedProduct = searchProduct.find(product =>
                product.short_key.toLowerCase() === shortKey ||
                product.veg_name.toLowerCase() === shortKey ||
                product.tamil_name.toLowerCase() === shortKey
            );

            if (matchedProduct) {
                autofillItem(index, matchedProduct);
                const input = quantityRefs.current[index];
                if (input) {
                    input.focus();
                    setTimeout(() => {
                        input.select();
                    }, 0);
                }
            } else {
                quantityRefs.current[index]?.focus();
            }
        }
    };

    const handleItemBlur = (e, index) => {
        e.preventDefault();
        const inputValue = e.target.value.trim().toLowerCase();
        if (!inputValue) return;
        setFocusedIndex(index)
        const matchedProduct = searchProduct.findIndex(
            (product) => {
                return product.short_key.toLowerCase() === inputValue ||
                    product.veg_name.toLowerCase() === inputValue
            }
        );
        // console.log(inputValue,matchedProduct);

        if (matchedProduct == -1) {
            setVegPopup(true)
            getVegetables()          
        }
    };

    // add new price list 
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
                
                setVegPopup(false)
                    const newItem = {
                    veg_name: selectedVegetable?.label,
                    quantity: 1,
                    price: formData.price,
                    amount: calculateAmount(1, formData.price),
                };

                setItems(prevItems => {
                    let updatedItems = [...prevItems];
                    
                    if (
                        focusedIndex !== null &&
                        updatedItems[focusedIndex] &&
                        !updatedItems[focusedIndex].veg_name
                    ) {
                        updatedItems[focusedIndex] = newItem;
                    } else {
                        updatedItems.push(newItem);
                    }

                     // ✅ Remove any empty rows (veg_name, quantity, and price all empty)
                    updatedItems = updatedItems.filter(item => {
                        return item.veg_name != "" && item.quantity != "" && item.price != "";
                    });


                     // ✅ Optionally auto-add an empty row at the end for UX
                    const lastItem = updatedItems[updatedItems.length - 1];
                    if (lastItem.veg_name !== '') {
                        updatedItems.push({ veg_name: '', quantity: '', price: '', amount: '' });
                    }

                    return updatedItems;
                });

                reset2();
                setSuccessMsg(response?.message);
                setTimeout(() => setSuccessMsg(null), 2000);
                setSelectedVegetable(null);
            } else {
                setErrMsg(response?.message || "Failed to add price");
                setTimeout(() => setErrMsg(null), 2000);
            }
        };

        useEffect(()=>{
            console.log(items);
        },[items])

        const getVegetables = async () => {
                setLoading(true);
            
                const vegetablesResponse = await getAllVegetableName()
            
                if (vegetablesResponse?.status === 200) {
                    const allVegetables = vegetablesResponse.data
    
                    const mappedVegetableOptions = allVegetables.map(option => ({
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
            

    return (
        <div className='app-container'>
            {user?.user_role === "buyer" ?
                <>
                    {loading ? <Loader /> :
                    <>
                        <div className='head pt-2 text-center '>
                            <h2 className='primary-color text-center flex-grow-1 m-0'>
                                {translations[app_language]?.buyerDirectory}
                            </h2>
                        </div>

                    {searchProduct?.length != 0 ? 
                    <>
                    {/* <div className="text-center d-flex justify-content-end">
                        <button onClick={downloadInvoiceAsPDF} className="submit-btn p-2">
                            Download as PDF
                        </button>
                    </div> */}
                        <div className="container">
                            <div className="card mx-auto my-4" style={{ maxWidth: '800px' }}>
                                <div className="card-body" ref={invoiceRef} id="invoice">
                                    <div className="text-center mb-2">
                                        <Store className="mb-2" size={40} />
                                        <h1 className="fs-3 fw-bold">{buyerData?.shop}</h1>
                                        <p className="text-muted mb-1">{buyerData?.address}</p>
                                        <p className="text-muted">Phone: {buyerData?.mobile}</p>
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            {/* Mobile Number Input */}
                                            <input
                                                type="tel"
                                                placeholder="Mobile Number"
                                                className="form-control"
                                                maxLength={10}
                                                value={mobile}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    setMobile(value);
                                                    // getCustomers(e)
                                                }}
                                                style={{ width: 'auto' }}
                                            />

                                            {/* Date Input */}
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="form-control ms-3"
                                                style={{ width: 'auto' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="table-responsive mb-4 pb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <table className="table table-bordered items_table">
                                            <thead className="table-light" style={{ position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 1 }}>
                                                <tr>
                                                    <th>Item Name</th>
                                                    <th className="text-end">Quantity</th>
                                                    <th className="text-end">Price</th>
                                                    <th className="text-end">Amount</th>
                                                    {items.length > 1 && <th style={{ width: '50px' }}></th>}
                                                </tr>
                                            </thead>
                                            <tbody className='manual_bill'>
                                                {items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="position-relative" ref={inputContainerRef}>
                                                                <input
                                                                    type="text"
                                                                    value={item.veg_name}
                                                                    onFocus={() => setFocusedIndex(index)}
                                                                    onChange={(e) => handleItemChange(index, 'veg_name', e.target.value)}
                                                                    className="form-control"
                                                                    placeholder="Item name"
                                                                    onKeyDown={(e) => handleItemKeyDown(e, index)}
                                                                    onBlur={(e) => handleItemBlur(e, index)}
                                                                />
                                                                {focusedIndex === index && suggestions[index]?.length > 0 && (
                                                                    <ul className="list-group position-absolute" style={{ zIndex: 1000, width: '100%' }}>
                                                                        {suggestions[index].map((product) => (
                                                                            <li
                                                                                key={product.veg_id}
                                                                                className="list-group-item list-group-item-action"
                                                                                onClick={() => handleSuggestionClick(index, product)}
                                                                                // onClick={() => handleSuggestionSelect(index, product)}
                                                                                style={{ cursor: 'pointer' }}
                                                                            >
                                                                                {product.veg_name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                ref={el => quantityRefs.current[index] = el}
                                                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                                className="form-control text-end"
                                                                placeholder="0.00"
                                                            // onKeyDown={(e) => handleEnterKey(e, index)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                value={item.price}
                                                                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                                className="form-control text-end"
                                                                placeholder="0.00"
                                                            />
                                                        </td>
                                                        <td className="text-end align-middle">{item.amount || '0.00'}</td>
                                                        {items.length > 1 &&
                                                            <td>
                                                                <button onClick={() => removeRow(index)} className="btn btn-link text-danger p-0">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </td>
                                                        }
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <div className='add_icon'>
                                                <PlusCircle size={20} onClick={addNewRow} />
                                            </div>
                                        </table>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center add-item">
                                        {/* <button
                                onClick={addNewRow}
                                className="btn btn-primary d-flex align-items-center gap-2 rounded-3 px-3 py-2 shadow-sm add-item-button"
                                style={{ fontWeight: '500' }}
                            >
                                <PlusCircle size={18} /> Add Item
                            </button> */}

                                        <button
                                            type="submit"
                                            className="submit-btn px-2 py-2"
                                            onClick={onEditbill}
                                            style={{ fontSize: "1rem" }}
                                            disabled={!isFill}
                                        >
                                            Submit
                                        </button>

                                        <div className="mt-3 d-flex flex-column gap-2" style={{ minWidth: '250px' }}>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="form-label text-muted small mb-0">Payment Mode :</label>
                                                <div className="d-flex align-items-center gap-2">
                                                    <select
                                                        value={paymentMode}
                                                        onChange={(e) => setPaymentMode(e.target.value)}
                                                        className="form-select"
                                                        style={{ width: '120px', padding: '4px 8px' }}
                                                    >
                                                        <option value="Cash">Cash</option>
                                                        <option value="UPI">UPI</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="form-label text-muted small mb-0">Discount :</label>
                                                <div className="d-flex align-items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={discountValue}
                                                        onChange={handleDiscountChange}
                                                        className="form-control text-end"
                                                        style={{ width: '70px' }}
                                                        placeholder="0"
                                                    />
                                                    <select
                                                        value={discountType}
                                                        onChange={(e) => setDiscountType(e.target.value)}
                                                        className="form-select"
                                                        style={{ width: '80px', padding: '4px 8px' }}
                                                    >
                                                        <option value="%">%</option>
                                                        <option value="₹">₹</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 d-flex flex-column gap-2" style={{ minWidth: '250px' }}>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="form-label text-muted small mb-0">Total :</label>
                                                <span className="fs-6 fw-bold">₹ {calculateTotal()}</span>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="form-label text-muted small mb-0">Cross Total :</label>
                                                <span className="fs-6 fw-bold">₹ {calculateCrossTotal()}</span>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="form-label text-muted small mb-0">Amount :</label>
                                                <input
                                                    type="text"
                                                    value={amount}
                                                    onChange={(e) => {
                                                        const enteredAmount = e.target.value;
                                                        setAmount(enteredAmount);

                                                        const total = Number(calculateTotal());
                                                        const amountNum = Number(enteredAmount);
                                                        const discount = total - amountNum;
                                                        if (total != amountNum) {
                                                            if (e.target.value == "") {
                                                                setDiscountType("%")
                                                                setDiscountValue(calculateCrossTotal() == total ? "" : total - calculateCrossTotal())
                                                            } else {
                                                                setDiscountType("₹")
                                                                setDiscountValue(calculateCrossTotal() - amountNum)
                                                            }
                                                        }

                                                    }}

                                                    style={{ width: '120px', padding: '4px 8px' }}
                                                    className="form-control"
                                                    placeholder="Enter Amount"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                                    
                            {/* pop up*/}
                            <div className={`modal ${askNamePopup ? "show" : ""} col-5`}>
                                <div className="modal-dialog">
                                    <div className="modal-dialog modal-confirm">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <div className="icon-box" onClick={() => { setAskNamePopup(false) }}>
                                                    <IoCloseCircleOutline className='close pointer' size={28} />
                                                </div>
                                            </div>
                                            <div className="modal-bodys col-md-8 m-auto">
                                                <form onSubmit={handleSubmit(saleSubmit)}>
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
                                                            {...register("name", {
                                                                required: "Please enter the Customer Name",
                                                                pattern: {
                                                                    value: /^[A-Za-z\s]+$/,
                                                                    message: "Only alphabets and spaces are allowed",
                                                                },
                                                            })}
                                                        />
                                                        <p className="err-dev">{errors?.name?.message}</p>
                                                    </div>

                                                    <div className="d-flex justify-content-center mt-4">
                                                        <button
                                                            type="submit"
                                                            className="start_btn"
                                                        > {spinAdd ? <Spinner /> : translations[app_language]?.submit}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`modal ${vegPopup ? "show" : ""} col-5`}>
                                <div className="modal-dialog">
                                    <div className="modal-dialog modal-confirm">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <div className="icon-box" onClick={() => { setVegPopup(false); reset2(); setSelectedVegetable(null) }}>
                                                    <IoCloseCircleOutline className='close pointer' size={28} />
                                                </div>
                                            </div>
                                            <div className="modal-bodys col-md-8 m-auto">
                                                <div>
                                                    <h3>Vegetable not in Price list</h3>
                                                </div>
                                                <form className="login-sign-form mt-4" onSubmit={handleSubmit2(onSubmitPrice)}>
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
                                                                required: "Please enter the key",
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

                            <SuccessAlert val={successMsg} msg={successMsg} />
                            <ErrorAlert val={errMsg} msg={errMsg} />
                        </div>
                    </>
                    :
                    <h4 className='mt-5 text-center text-danger'>No Price list were found.Please <Link href="/portal/vegetableprice" className='text-success text-decoration-underline'>ADD PRICE</Link> to add daily price</h4>
                    }
                    
                    </>}

                </>
                :
                <>
                    {user ? <AccessDenied /> : <Loader />}
                </>

            }

        </div>
    );
};

export default ManualBill;