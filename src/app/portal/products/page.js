"use client"
import { addCommodityAPI, getAllVegetablesAPI, getCommodityAPI, updateProductAPI } from '@/src/Components/Api';
import Select from "react-select";
import React, { useEffect, useState } from 'react'
import Loader from '@/src/Components/Loader';
import Spinner from '@/src/Components/Spinner';
import { useSelector } from 'react-redux';
import AccessDenied from '@/src/Components/AccessDenied';
import { useRouter } from 'next/navigation';
import { IoArrowBackCircle } from 'react-icons/io5'
import ErrorAlert from '@/src/Components/ErrorAlert';
import SuccessAlert from '@/src/Components/SuccessAlert';

const Products = () => {
  const user = useSelector((state) => state?.user?.userDetails)
  const language = useSelector((state) => state?.user?.language)
  const app_language = useSelector((state) => state?.user?.app_language)
  const translations = useSelector((state) => state?.language?.translations)
  const sub_status = useSelector((state) => state?.user?.subscription)
  const [tableData, setTableData] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null)
  const [errMsg, setErrMsg] = useState(null)
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true)
  const [spin, setSpin] = useState(false)
  const [selectedVegetables, setSelectedVegetables] = useState([]);
  const [vegetableOptions, setVegetableOptions] = useState(null)
  const [manage, setManage] = useState(false)
  const [showShortcutModal, setShowShortcutModal] = useState(false);
  const [shortcutData, setShortcutData] = useState([]);
  const router=useRouter()
  const handleChange = (selectedOptions) => {
    setSelectedVegetables(selectedOptions || []);
  };
  const getVegetables = async () => {
    setLoading(true)
    const response = await getAllVegetablesAPI()
    if (response?.status === 200) {
      if (language === "tamil") {
        const mappedVegetableOptions = response?.data?.map(option => ({
          value: option?.veg_id,
          label: option?.tamil_name,
        }));

        setVegetableOptions(mappedVegetableOptions)
      }
      else {
        const mappedVegetableOptions = response?.data?.map(option => ({
          value: option.veg_id,
          label: option.veg_name,
        }));
        setVegetableOptions(mappedVegetableOptions)
      }

      setLoading(false)
    }
    else if (response?.status === 404) {
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

  const filteredData = tableData?.filter((item) => {
    const name = language === "tamil" ? item.tamil_name : item.veg_name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getProductList = async () => {
    setLoading(true)
    const response = await getCommodityAPI()
    if (response?.status === 200) {
      if (language === "tamil") {
        const mappedVegetableOptions = response?.data?.map(option => ({
          value: option.list_id,
          label: option.tamil_name,
        }));
        setSelectedVegetables(mappedVegetableOptions)
      }
      else {
        const mappedVegetableOptions = response?.data?.map(option => ({
          value: option.list_id,
          label: option.veg_name,
        }));
        setSelectedVegetables(mappedVegetableOptions)
      }

      setTableData(response?.data)
      setShortcutData(response?.data)
      setLoading(false)
    }
    else {
      setErrMsg(response.message)
      setLoading(false)
      setTimeout(() => {
        setErrMsg(null)
      }, 2000)
    }
  }

  const manageVeg = async () => {
    setSpin(true)
    const veg_id = selectedVegetables?.map((veg) => {
      return veg?.value
    })
    const response = await addCommodityAPI(veg_id)
    if (response?.status === 200) {
      setSuccessMsg(response?.message)
      setSpin(false)
      setTimeout(() => {
        setSuccessMsg(null)
        setManage(false)
        getProductList()
      }, 2000)
    }
    else {
      setErrMsg(response.message)
      setSpin(false)
      setTimeout(() => {
        setErrMsg(null)
      }, 2000)
    }
  }

  const handleShortcutSubmit = async () => {
    setSpin(true)
    const shortcutArray = tableData.map((veg, index) => ({
      veg_id: veg.veg_id,
      veg_name: veg.veg_name,
      shortcut_key: shortcutData[index]?.shortcut_key || null,
    }));
    const response = await updateProductAPI("none", shortcutArray)
    if (response?.status === 200) {
      setSuccessMsg(response?.message)
      setSpin(false)
      setTimeout(() => {
        setSuccessMsg(null)
        setManage(false)
        setShowShortcutModal(false);
        getProductList()
      }, 2000)
    }
    else {
      setErrMsg(response.message)
      setSpin(false)
      setTimeout(() => {
        setErrMsg(null)
      }, 2000)
    }
  };

  const handleShortcutChange = (index, value) => {
    const updatedShortcutData = [...shortcutData];
    updatedShortcutData[index] = { ...updatedShortcutData[index], shortcut_key: value };
    setShortcutData(updatedShortcutData);
  };
console.log(language);

  useEffect(() => {
    if (language) {
      getProductList();
      getVegetables();
    }
  }, [language])

  return (
    <div className='app-container'>
      {user?.user_role === "marketer" || (user?.user_role === "assistant" && (user?.access?.accounts || user?.access?.inventory)) ?
        <>
          {loading ? <Loader /> :
            <>
              <div className='head pt-2 d-flex align-items-center justify-content-between'>
                <button className='submit-btn py-2 requirement-btn px-2 d-none d-md-block' onClick={() => router.push("/portal/inventory")}>{translations[app_language]?.back}</button>
                <button className='back_icon d-block d-md-none' onClick={() => router.push("/portal/inventory")}><IoArrowBackCircle size={26}/></button>
                <h2 className='primary-color text-center flex-grow-1 m-0'>
                  {translations[app_language]?.product}
                </h2>
              </div>

              {(!manage) &&
                <div className='d-flex justify-content-center justify-content-md-end mt-4' style={{ gap: '10px' }}>
                {sub_status ? <button className='submit-btn py-1 px-2 px-md-3 py-md-2 fs-6 w-auto' style={{ minWidth: '90px' }} onClick={() => setManage(true)}>{translations[app_language]?.manageVegetables}</button> : ""}

               {sub_status ? <button className='submit-btn py-1 px-2 px-md-3 py-md-2 fs-6 w-auto'   style={{ minWidth: '90px' }} onClick={() => setShowShortcutModal(true)}>{translations[app_language]?.manageShortcut}</button>:""}
                </div>}
              {(manage) &&
                <div className='d-flex justify-content-end mt-4'>
                  <button className='submit-btn py-2 px-2' onClick={() => setManage(false)}> {translations[app_language]?.cancel}</button>
                </div>}
              {manage &&
                <>
                  <div className='head pt-2'>
                    <h5 className='primary-color'>{translations[app_language]?.manageVegetables}</h5>
                  </div>
                  <div className='d-flex align-items-center gap-4  veg_box'>
                    {(vegetableOptions && language) &&
                      <div className='form-group veg_selectbox col-6'>
                        <div className="">
                          <Select
                            options={vegetableOptions}
                            isMulti
                            closeMenuOnSelect={false}
                            value={selectedVegetables}
                            onChange={handleChange}
                            placeholder={translations[app_language]?.chooseVegetables}
                          />
                        </div>
                      </div>}

                    <div className='col-6'>
                      <button className='submit-btn py-2' onClick={manageVeg}>{spin ? <Spinner /> : translations[app_language]?.submit}</button>
                    </div>
                  </div>
                </>}


              <div className='d-flex justify-content-end mt-3' >
                <input
                  type="text"
                  className=' search-input'
                  placeholder={translations[app_language]?.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="table-container shadow-none ">
                <table className="modern-table product-tab m-auto">
                  <thead>
                    <tr>

                      <th className='text-center'>{translations[app_language]?.productList}</th>

                      <th className='text-center'>{translations[app_language]?.shortcutList}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.length > 0 ? (
                      filteredData?.map((v, i) => (
                        <tr key={v.veg_id}>
                          <td className='text-center'>
                            {language === "tamil" ? v?.tamil_name : v.veg_name}
                          </td>
                          <td className='text-center'>
                            {v.shortcut_key ? v.shortcut_key : "-"}
                          </td>

                          {/* <td className='text-center'>
                            <div>
                              <button type='button' className='border-0 ps-1 bg-white primary-color' onClick={() => showWarning(v?.veg_id)}> <RiDeleteBin5Fill size={20} /></button></div>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="1" className="text-center">{translations[app_language]?.noresults}</td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>

              {/* Shortcut Modal */}
              {showShortcutModal &&
                <div className="modal show d-block" tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">{translations[app_language]?.createShortcut}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowShortcutModal(false)}></button>
                      </div>
                      <div className="modal-body veg_list_modal">
                        {tableData?.map((veg, index) => (
                          <div className="d-flex align-items-center mb-3" key={index}>
                            <label className="form-label me-2" style={{ minWidth: '150px', textAlign: 'right' }}>{language === "tamil" ? veg?.tamil_name : veg.veg_name}</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={translations[app_language]?.shortcutList}
                              style={{ maxWidth: '200px' }}
                              value={shortcutData[index]?.shortcut_key || ""}
                              onChange={(e) => handleShortcutChange(index, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowShortcutModal(false)}>{translations[app_language]?.cancel}</button>
                        <button type="button" className="submit-btn requirement-btn py-2" onClick={handleShortcutSubmit}>{spin ? <Spinner /> : translations[app_language]?.submit}</button>
                      </div>
                    </div>
                  </div>
                </div>
              }
                <SuccessAlert val={successMsg} msg={successMsg} />
                <ErrorAlert val={errMsg} msg={errMsg} />
            </>}
        </>
        :
        <>
          {user ?
            <AccessDenied /> : <Loader />}
        </>}
    </div>
  )
}

export default Products