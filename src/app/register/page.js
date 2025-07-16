"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { getAllMarket, registerUserAPI } from "@/src/Components/Api";
import { useRouter } from "next/navigation";
import Spinner from "@/src/Components/Spinner";
import { IoClose } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [role, setRole] = useState("marketer");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const market = useRef("");
  const [location, setLocation] = useState(null);
  const phonePattern = /^[0-9]{10}$/;
  const inputRef = useRef(null);
  const [errMsg, setErrMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showSearchProduct, setShowSearchProduct] = useState(false);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const listItemRefs = useRef([]);
  const marketInputRef = useRef(null);
  const router = useRouter();

  const registerUser = async (data) => {
    let payload;
    setLoading(true);

    if (role === "marketer") {
      delete data?.location;
      payload = { ...data, role, market: market.current };
    } else {
      payload = { ...data, role, market: "" };
    }

    const response = await registerUserAPI(payload);

    if (response?.status === 200) {
      setSuccessMsg("Login after some time");
      setTimeout(() => {
        setSuccessMsg(null);
        router.push('/');
        setLoading(false);
      }, 2000);
    } else if (response?.status === 409) {
      setLoading(false);
      setErrMsg(response?.message);
      setTimeout(() => {
        setErrMsg(null);
      }, 2000);
    }
  };

  const marketsList = async () => {
    const response = await getAllMarket();

    if (response?.status === 200) {
      setShowSearchProduct(response.data);
    } else {
      setErrMsg(response?.message);
      setTimeout(() => {
        setErrMsg(null);
      }, 2000);
    }
  };

  useEffect(() => {
    marketsList();
  }, []);

  const change = (e) => {
    setRole(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        marketInputRef.current &&
        !marketInputRef.current.contains(e.target) &&
        !e.target.closest(".search-result-in")
      ) {
        setFilteredMarkets([]);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  return (
    <main>
      <div className="bg-login d-flex align-items-center">
        <div className="col-12 d-flex flex-wrap justify-content-center reg-row">
          <div className="col-12 col-lg-7 d-flex justify-content-center align-items-center">
            <div>
              <h1 className="primary-color heading-login">AgriBevy</h1>
              <h3 className="mt-2 mt-lg-3 mb-3 mb-lg-0 primary-color sub-heading-login">Harvesting Opportunities, Connecting Communities...</h3>
            </div>
          </div>

          <div className="col-12 col-md-8 col-lg-5">
            <div className="login-card bg-white col-12 col-md-10 m-auto">
              <h2 className="text-center primary-color">Registration</h2>
              <div className="form-login">
                <form onSubmit={handleSubmit(registerUser)}>
                  <div className="form-group mb-0">
                    <label className="radio-inline" htmlFor="marketer">
                      <input type="radio" name="optradio" id="marketer" value="marketer" defaultChecked onChange={change} />&nbsp;&nbsp;Marketer
                    </label>
                    <label className="radio-inline2 ms-3" htmlFor="buyer">
                      <input type="radio" name="optradio" id="buyer" value="buyer" onChange={change} />&nbsp;&nbsp;Buyer
                    </label>
                    <label className="radio-inline2 ms-3" htmlFor="farmer">
                      <input type="radio" name="optradio" id="farmer" value="farmer" onChange={change} />&nbsp;&nbsp;Farmer
                    </label>
                  </div>

                  <div className="d-flex gap-3">
                    <div className="form-group">
                      <label htmlFor="name">{role === "marketer" ? "Shop name" : "Name"}</label>
                      <input type="text" className="form-control" id="name"
                        {...register("name", {
                          required: `Please enter the ${role === "marketer" ? "Shop name" : "Name"}`
                        })} />
                      <p className="err-dev">{errors.name?.message}</p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="mobile">Mobile</label>
                      <input type="number" className="form-control" onInput={(e) => {
                        if (e.target.value.length > 10) {
                          e.target.value = e.target.value.slice(0, 10);
                        }
                      }} onWheel={(e) => e.target.blur()} {...register("mobile", {
                        required: "Please enter the Mobile number",
                        pattern: {
                          value: phonePattern,
                          message: "Enter valid mobile number",
                        },
                      })} />
                      <p className="err-dev">{errors.mobile?.message}</p>
                    </div>
                  </div>

                  <div className="form-group showpass">
                    <label htmlFor="pwd">Password</label>
                    <input type={show ? "text" : "password"} className="form-control" id="pwd" {...register("password", {
                      required: "Please enter the Password"
                    })} />
                    {show ? (
                      <VscEyeClosed className="eye2" onClick={() => setShow(false)} />
                    ) : (
                      <VscEye className="eye2" onClick={() => setShow(true)} />
                    )}
                    <p className="err-dev">{errors.password?.message}</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="con_pwd">Confirm Password</label>
                    <input type="password" className="form-control" id="con_pwd" {...register("cpassword", {
                      required: "Please reenter the Password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })} />
                    <p className="err-dev">{errors.cpassword?.message}</p>
                  </div>

                  {role === "marketer" &&
                    <div className="form-group">
                      <label htmlFor="market">Market</label>
                      <div className="form-group position-relative">
                        <input
                          type="text"
                          className="form-control input-search"
                          ref={marketInputRef}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase();
                            const filtered = showSearchProduct.filter(m =>
                              m.market_name.toLowerCase().includes(value)
                            );
                            setFilteredMarkets(filtered);
                            market.current = e.target.value;
                          }}
                          onFocus={() => {
                            const value = marketInputRef.current?.value?.toLowerCase() || "";
                            const filtered = showSearchProduct.filter(m =>
                              m.market_name.toLowerCase().includes(value)
                            );
                            setFilteredMarkets(filtered);
                          }}
                        />
                        {filteredMarkets.length > 0 && (
                          <div className="search-result-in" onMouseDown={(e) => e.preventDefault()}>
                            <ul className="p-2">
                              {filteredMarkets.map((item, i) => (
                                <li
                                  key={i}
                                  className={`search-list ${i === activeItemIndex ? "highlighted" : ""}`}
                                  ref={(el) => (listItemRefs.current[i] = el)}
                                  onClick={() => {
                                    marketInputRef.current.value = item.market_name;
                                    market.current = item.market_name;
                                    setFilteredMarkets([]);
                                  }}
                                  onMouseEnter={() => setActiveItemIndex(i)}
                                >
                                  {item.market_name}, {item.district}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <p className="err-dev">{errors.market?.message}</p>
                    </div>}

                  {role !== "marketer" &&
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <input type="text" className="form-control" id="location" {...register("address", {
                        required: "Please enter the Location"
                      })} />
                      <p className="err-dev">{errors.address?.message}</p>
                    </div>}

                  {role === "marketer" &&
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <input type="text" className="form-control" id="address" {...register("address", {
                        required: "Please enter the Address"
                      })} />
                      <p className="err-dev">{errors.address?.message}</p>
                    </div>}

                  <div className="err-div">
                    <div className="d-flex justify-content-center mb-2">
                      <button type="submit" className="mt-4 px-3 py-1 submit-btn">
                        {loading ? <Spinner /> : "Submit"}
                      </button>
                    </div>
                    {errMsg && <p className="err-message">{errMsg}</p>}
                  </div>

                  <div className="pt-2 mt-3 text-center">
                    Already have an account? <Link href="/" className="primary-color login-link">Login</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={successMsg === null ? "alert_net hide_net" : "alert_net show alert_suc_bg"}>
        <FaCircleCheck className='exclamation-circle' />
        <span className="msg">{successMsg}</span>
        <div className="close-btn close_suc">
          <IoClose className='close_mark' size={26} />
        </div>
      </div>
    </main>
  );
}
