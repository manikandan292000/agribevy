"use client"
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    nameChanged:false,
    userDetails:null,
    language: "english",
    languageChanged:false,
    app_language:"english",
    subscription: null,
    data: {},
    bill: {},
    session: 0,
    isShow: null,
  };

const Slice=createSlice({
    name:"myslice",
    initialState,
    reducers:{
        changeName:(state,action)=>{
            state.nameChanged=action.payload
        },
        getUserDetailsSlice:(state,action)=>{
            state.userDetails=action.payload
        },
        getUserLanguageSlice:(state,action)=>{
            state.language=action.payload
        },
        changeLanguage:(state,action)=>{
            state.languageChanged=action.payload
        },
        getAppLanguageSlice:(state,action)=>{
            state.app_language=action.payload
        },
        getSubscription:(state,action)=>{
            state.subscription = action.payload
        },
        getSubscriptionData:(state,action)=>{
            state.data = action.payload
        },
        getBillMode:(state,action)=>{            
            state.bill = action.payload
        },
        getSession:(state,action)=>{
            state.session = action.payload
        },
        getIsShow:(state,action)=>{
            state.isShow = action.payload
        },
        logout: () => initialState,
    }
})

export const {changeName,getUserDetailsSlice,getUserLanguageSlice,changeLanguage,getAppLanguageSlice,changeAppLanguage,getSubscription,getSubscriptionData,getBillMode,getSession,getIsShow,logout}= Slice.actions
export default Slice.reducer