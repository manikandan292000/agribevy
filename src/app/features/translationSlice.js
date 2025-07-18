"use client"
import { createSlice } from "@reduxjs/toolkit";

const Slice = createSlice({
    name: "myslice",
    initialState: {
        translations: {
            english: {
                next: 'Next',
                prev: "Prev",
                sales: 'Sales',
                search: "Search",
                farmer: "Farmer",
                vegetable: "Vegetable",
                weight: "Quantity",
                amount: "Amount",
                date: "Traded date",
                invoiceNo: "Invoice No.",
                invoice: "Invoice",
                buyer: "Buyer",
                farmerSales: "Farmer sales",
                buyerSales: "Buyer Sales",
                welcome: "Welcome",
                today: "Today",
                week: "Last 7 days",
                month: "Last 30 days",
                totalRevenue: "Total Sales Revenue",
                totalCommodity: "Total Commodities",
                recentTransactions: "Recent Transactions",
                salesOverview: "Sales Overview",
                myItems: "My Items",
                addInventory: "Add inventory",
                viewInventory: "View Stocks",
                kg: "KG.",
                noStocks: "No Stocks Available",
                inventoryEntry: "Inventory Entry Form",
                proposedPrice: "Proposed price",
                sack: "Sacks",
                rent: "Rent",
                submit: "Submit",
                farmerDirectory: "Farmers directory",
                addFarmer: "Add farmer",
                nickName: "Nick name",
                mobileNumber: "Mobile number",
                location: "Location",
                editFarmer: "Edit Farmer",
                product: "Products",
                manageVegetables: "Manage Vegetables",
                manageShortcut: "Manage Shortcuts",
                cancel: "Cancel",
                chooseVegetables: "Choose Vegetables",
                productList: "Product List",
                shortcutList: "Shortcut key",
                noresults: "No results found",
                createShortcut: "Create Shortcuts",
                noRecords: "No records found",
                buyerDirectory: "Buyers directory",
                addBuyer: "Add Buyer",
                shopName: "Shop name",
                editBuyer: "Edit Buyer",
                bill: "Bill",
                bills: "Bills",
                viewBills: "View all bills",
                selectBills: "Please select a farmer to generate bill",
                noBillRequest: "No Farmer with bill requests found",
                allBills: "All Bills",
                viewPdf: " View PDF",
                noBills: "No Bill found",
                expenses: "Expenses",
                addExpenses: "Add Expenses",
                resetFilter: "Reset Filter",
                expenseDetails: "Expense details ",
                noExpenses: "No Expense data found",
                total: "Total",
                expenseEntry: "Expense Entry Form",
                emptyDate: "Date",
                expenseEdit: "Expense Edit Form",
                filter: "Filter",
                enterAmount: "Enter amount",
                employeeWage: "Employee Wage",
                teaSnacks: "Tea/Snacks",
                fuel: "Fuel",
                electricity: "Electricity",
                water: "Water",
                mobile: "Mobile",
                travel: "Travel",
                misc: "Miscellaneous",
                reports: "Reports",
                balanceSheet: "Balance Sheet",
                salesReport: "Sales Report",
                netProfit: "Net Profit",
                generate: "Generate",
                manageColumn: "Manage Columns",
                exportPDF: "Export as PDF",
                exportExcel: "Export as Excel",
                selectColumns: "Select Columns",
                totalCredit: "Total Credit",
                debitFarmers: "Debit to Farmers",
                grossProfit: "Gross Profit",
                operationalExpenses: "Operational Expenses",
                assistantDirectory: "Assistants directory",
                addAssistant: "Add Assistant",
                emptyName: "Name",
                selectRole: "Select Role",
                inventoryManager: "Inventory Manager",
                salesManager: "Sales Manager",
                accountsManager: "Accounts Manager",
                editAssistant: "Edit Assistant",
                market: "Market",
                coolie: "Coolie",
                marketSettings: "Market Settings",
                settings: "Settings",
                commission: "Commission",
                magamai: "Magamai",
                marketHoliday: "Market Holiday",
                magamaiSource: "Magamai Source",
                magamaiType: "Magamai Type",
                financialYear: "Financial year",
                billLanguage: "Bill Language",
                appLanguage: "App Language",
                shopLogo: "Shop Logo",
                addSack: "Add sack",
                saveSettings: "Save Settings",
                editSettings: "Edit Settings",
                sackDetails: "Sack Details",
                sackType: "Sack Type",
                price: "Price",
                actions: "Actions",
                noSack: "No Sacks found",
                editSack: "Edit Sack Details",
                addWage: "Add Wage",
                wageDetails: "Wage Details",
                noWages: "No Wages found",
                editWage: "Edit Wage Details",
                fromkg: "From (kg)",
                tokg: "To (kg)",
                sunday: "Sunday",
                monday: "Monday",
                tuesday: "Tuesday",
                wednesday: "Wednesday",
                thursday: "Thursday",
                friday: "Friday",
                saturday: "Saturday",
                jandec: "January-December",
                aprmar: "April-March",
                transactions: "Transactions",
                addTransaction: "Add transaction",
                totalPayment: "Total Payment",
                pendingPayment: "Pending Payment",
                multiplePayment: "Multiple payment",
                payNow: " Pay Now",
                addPaymentFarmer: "Add Payment to Farmer",
                paymentDue: "Payment due",
                advance: "Advance",
                enterPayment: "Enter payment amount",
                enterAdvance: "Enter advance amount",
                transactionType: "Transaction Type",
                payment: "Payment",
                payBill: "Pay this bill",
                billAmount: "Bill amount",
                paymentAmount: "Payment Amount",
                payMultiBill: "Pay Multiple bills",
                pay: "Pay",
                getPayment: "Get Payment",
                addPaymentBuyer: "Add Payment from Buyer",
                gettingPayment: "Get Payment",
                gettingAmount: "Payment Amount",
                multiSell: "Multi Sell",
                sellSelected: "Sell Selected",
                sellProduct: "Sell product",
                priceType: "Price Type",
                sellingPrice: "Selling price",
                paid: "Paid",
                totalWeight: "Total Weight",
                wage: "Wage",
                perKg: "Per KG",
                select: "Select",
                deselect: "Deselect",
                myAccount: "My Account",
                logOut: "Logout",
                loggingOut: "Logging out ...",
                dashboard: "Dashboard",
                myFarmers: "My Farmers",
                myProducts: "My Products",
                myBuyers: "My Buyers",
                myAssistants: "My Assistants",
                settings: "Settings",
                personalInfo: "Personal information",
                editInfo: "Edit",
                changePassword: "Change password",
                oldpassword: "Old Password",
                newPassword: "New Password",
                confirm: "Confirm new password",
                editMyDetails: "Edit details",
                areYouSure: "Are you sure",
                confirmWarning: "Do you really want to continue?",
                farmerDelete: "This process will delete the farmer permanently.",
                buyerDelete: "This process will delete the buyer permanently.",
                assistantDelete: "This process will delete the assistant permanently.",
                delete: "Confirm",
                farmerBill: "Farmer Bill",
                soldAt: "Sold at",
                buyerAmount: "Buyer Amount",
                farmerPayment: "Farmer Payment",
                buyerPayment: "Buyer Payment",
                farmerCoolie: "Farmer Wage",
                farmerRent: "Farmer Rent",
                buyerCoolie: "Buyer Wage",
                buyerRent: "Buyer Rent",
                generateBill: "Generate Bill",
                selectAll: "Select All",
                deselectAll: "Deselect All",
                back: "Back",
                language: "Language",
                deductions: "Deductions",
                percentage: "Percentage",
                sackCount: "Sack Count",
                auto: "Auto",
                manual: "Manual",
                billMode: "Bill Generation",
                magamai_show: "Should Magamai show in bill",
                dailyPrice: "Daily Price",
                addVeg: "Add Veg",
                addproducts:"Add Products",
                editproducts:"Edit Products",
                quantity:"Quantity",
                units:"Units",
                paymentMode: "Payment Mode",
                shopAddress: "Shop Address",
                shopDetail: "Shop Detail",
                discountShow: "Should Discount show in bill",
                discount: "Discount",
                no: "No",
                yes: "Yes",
                customers: "Customers",
                sales_bill: "Sales Bill",
                marketers: "Marketers",
                my_purchase: "My Purchase",
                requirements: "My Requirements",
            },
            tamil: {
                next: 'பின்',
                prev: "முன்",
                sales: 'விற்பனைகள்',
                search: "தேடு",
                farmer: "விவசாயி",
                vegetable: "காய்கறி",
                weight: "எடை",
                amount: "தொகை",
                date: "தேதி",
                invoiceNo: "விலைப்பட்டியல் எண்",
                invoice: "விலைப்பட்டியல்",
                buyer: "வாங்குவோர் ",
                farmerSales: "விவசாயி விற்பனை",
                buyerSales: "வாங்குவோர் விற்பனை",
                welcome: "வணக்கம்",
                today: "இன்று",
                week: "கடந்த 7 நாட்கள்",
                month: "கடந்த 30 நாட்கள்",
                totalRevenue: "மொத்த விற்பனை வருவாய்",
                totalCommodity: "மொத்த பொருட்கள்",
                recentTransactions: "சமீபத்திய பரிவர்த்தனைகள்",
                salesOverview: "விற்பனை கண்ணோட்டம்",
                myItems: "என் கையிருப்பு",
                addInventory: "கையிருப்பு சேர்",
                viewInventory: "கையிருப்பு பார்க்க",
                kg: "கி.",
                noStocks: "கையிருப்பு எதுவும் இல்லை",
                inventoryEntry: "கைஇருப்பு பதிவேற்றம்",
                proposedPrice: "உத்தேச விலை",
                sack: "சாக்கு",
                rent: "வாடகை",
                submit: "சமர்ப்பி",
                farmerDirectory: "விவசாயி பட்டியல்",
                addFarmer: "விவசாயி சேர்க்க",
                nickName: "பெயர்",
                mobileNumber: "தொலைபேசி எண்",
                location: "இடம்",
                editFarmer: "விவசாயி விவரம் திருத்த",
                product: "காய்கறிகள்",
                manageVegetables: "காய்கறி மேலாண்மை",
                manageShortcut: "குறியீடு மேலாண்மை",
                cancel: "ரத்து செய்க",
                chooseVegetables: "தேர்வு செய்க",
                productList: "காய்கறி பட்டியல் ",
                shortcutList: "குறியீடு",
                noresults: "எந்த முடிவும் கிடைக்கவில்லை",
                createShortcut: "குறியீடு உருவாக்க",
                noRecords: "தரவு எதுவும் கிடைக்கவில்லை",
                buyerDirectory: "வாங்குவோர் பட்டியல்",
                addBuyer: "வாங்குவோர் சேர்க்க",
                shopName: "கடையின் பெயர்",
                editBuyer: "வாங்குவோர் விவரம் திருத்த",
                bill: "பில்",
                bills: "பில்கள்",
                viewBills: "பில்கள் பார்க்க",
                selectBills: "பில் உருவாக்க ஒரு விவசாயியைத் தேர்ந்தெடுக்கவும்",
                noBillRequest: "பில் கோரிக்கைகளுடன் எந்த விவசாயியும் இல்லை",
                allBills: "அனைத்து பில்கள்",
                viewPdf: " PDF பார்க்க",
                noBills: "பில் எதுவும் கிடைக்கவில்லை",
                expenses: "செலவுகள்",
                addExpenses: "செலவுகள் சேர்க்க",
                resetFilter: "பில்டர் ரத்துசெய்",
                expenseDetails: "செலவு விவரங்கள் ",
                noExpenses: "செலவுத் தரவு எதுவும் இல்லை",
                total: "மொத்தம்",
                expenseEntry: "செலவு பதிவு படிவம்",
                emptyDate: "தேதி",
                expenseEdit: "செலவு திருத்த படிவம்",
                filter: "பில்டர்",
                enterAmount: "தொகை",
                employeeWage: "பணியாளர் ஊதியம்",
                teaSnacks: "தேநீர்/சிற்றுண்டி",
                fuel: "எரிபொருள்",
                electricity: "மின்சாரம்",
                water: "தண்ணீர்",
                mobile: "மொபைல் பில்",
                travel: "பயணம்",
                misc: "இதர செலவு",
                reports: "அறிக்கைகள்",
                balanceSheet: "இருப்புநிலை ஏடு",
                salesReport: "விற்பனை அறிக்கை",
                netProfit: "நிகர லாபம்",
                generate: "உருவாக்கு",
                manageColumn: "வரிசைகளை நிர்வகிக்க",
                exportPDF: "PDF ஆக பதிவிறக்க",
                exportExcel: "Excel ஆக பதிவிறக்க",
                selectColumns: "வரிசைகளை தேர்ந்தெடு",
                totalCredit: "மொத்த வருவாய்",
                debitFarmers: "விவசாயிக்கு  டெபிட் ",
                grossProfit: "மொத்த லாபம்",
                operationalExpenses: "செலவுகள்",
                assistantDirectory: "உதவியாளர்கள்",
                addAssistant: "உதவியாளர் சேர்க்க",
                emptyName: "பெயர்",
                selectRole: "வேலையைத் தேர்ந்தெடுக்கவும்",
                inventoryManager: "சரக்கு மேலாளர்",
                salesManager: "விற்பனை மேலாளர்",
                accountsManager: "கணக்கு மேலாளர்",
                editAssistant: "உதவியாளர் விவரம் திருத்த",
                market: "சந்தை",
                coolie: "கூலி",
                marketSettings: "சந்தை அமைப்புகள்",
                settings: "அமைப்புகள்",
                commission: "கமிஷன்",
                magamai: "மகமை",
                marketHoliday: "சந்தை விடுமுறை",
                magamaiSource: "மகமை ஆதாரம்",
                magamaiType: "மகமை வகை",
                financialYear: "நிதி ஆண்டு",
                billLanguage: "பில் மொழி",
                appLanguage: "செயலி மொழி",
                shopLogo: "கடை லோகோ",
                addSack: "சாக்கு சேர்க்க",
                saveSettings: "அமைப்புகளைச் சேமி",
                editSettings: "அமைப்புகளைத் திருத்து",
                sackDetails: "சாக்கு விவரம்",
                sackType: "சாக்கு வகை",
                price: "விலை",
                actions: "செயல்கள்",
                editSack: "சாக்கு விவரம் திருத்த ",
                addWage: "கூலியைச் சேர்க்க",
                wageDetails: "கூலி விவரம்",
                editWage: "கூலி விவரம் திருத்த",
                fromkg: "தொடக்க எடை(கி.)",
                tokg: "முடிவு எடை(கி.)",
                sunday: "ஞாயிறு",
                monday: "திங்கள்",
                tuesday: "செவ்வாய்",
                wednesday: "புதன்",
                thursday: "வியாழன்",
                friday: "வெள்ளி",
                saturday: "சனி",
                jandec: "ஜனவரி-டிசம்பர்",
                aprmar: "ஏப்ரல்-மார்ச்",
                transactions: "பரிவர்த்தனைகள்",
                addTransaction: "மொத்த பரிவர்த்தனை",
                totalPayment: "மொத்த தொகை ",
                pendingPayment: "நிலுவை தொகை",
                multiplePayment: "ஒன்றுக்கு மேற்பட்ட பரிவர்த்தனை",
                payNow: " பணம் செலுத்து",
                addPaymentFarmer: "விவசாயிக்கு பணம் செலுத்த",
                paymentDue: "நிலுவை தொகை",
                advance: "முன்பணம்",
                enterPayment: "தொகையை உள்ளிடவும்",
                enterAdvance: "முன்பணம் உள்ளிடவும்",
                transactionType: "பரிவர்த்தனை வகை",
                payment: "பணம் செலுத்துதல்",
                payBill: "இந்த பில் செலுத்து",
                billAmount: "பில் தொகை",
                paymentAmount: "செலுத்தும் தொகை",
                payMultiBill: "ஒன்றுக்கு மேற்பட்ட பரிவர்த்தனை",
                pay: "செலுத்து",
                getPayment: "பணம் பெற",
                addPaymentBuyer: "வாங்குபவரிடம் பணம் பெற",
                gettingPayment: "பணம் பெறுதல்",
                gettingAmount: "பெறும் தொகை",
                multiSell: "ஒன்றுக்கு மேற்பட்ட விற்பனை",
                sellSelected: "தேர்ந்தெடுக்கப்பட்டதை விற்க",
                sellProduct: "விற்பனை செய்",
                priceType: "விலை வகை",
                sellingPrice: "விற்பனை விலை",
                paid: "பணம் பெறப்பட்டது",
                totalWeight: "மொத்த எடை",
                wage: "கூலி",
                perKg: "/கி.",
                select: "தேர்ந்தெடு",
                deselect: "தேர்வு நீக்கு",
                myAccount: "என் கணக்கு",
                logOut: "வெளியேறு",
                loggingOut: "வெளியேறுகிறது...",
                dashboard: "முகப்பு",
                myFarmers: "விவசாயிகள்",
                myProducts: "காய்கறிகள்",
                myBuyers: "வாங்குவோர்",
                myAssistants: "உதவியாளர்கள்",
                settings: "அமைப்புகள்",
                personalInfo: "எனது சுயவிவரம்",
                editInfo: "திருத்து",
                changePassword: "கடவுச்சொல்லை மாற்ற",
                oldpassword: "பழைய கடவுச்சொல்",
                newPassword: "புதிய கடவுச்சொல்",
                confirm: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
                editMyDetails: "விவரங்களைத் திருத்த",
                areYouSure: "நீக்குவதற்கான எச்சரிக்கை",
                confirmWarning: "நீங்கள் உண்மையில் தொடர விரும்புகிறீர்களா?",
                farmerDelete: "இந்த செயல்முறை இந்த விவசாயியை நிரந்தரமாக நீக்கிவிடும்.",
                buyerDelete: "இந்த செயல்முறை வாங்குபவரை நிரந்தரமாக நீக்கும்.",
                assistantDelete: "இந்த செயல்முறை இந்த உதவியாளரை நிரந்தரமாக நீக்கும்.",
                delete: "நீக்கு",
                farmerBill: "விவசாயி பில்",
                soldAt: "விற்பனை விலை",
                buyerAmount: "வாங்குவோர் தொகை",
                farmerPayment: "விவசாயிக்கு செலுத்தியது",
                buyerPayment: "வாங்குபவரிடம் பெற்றது",
                farmerCoolie: "விவசாயி கூலி",
                farmerRent: "விவசாயி வாடகை",
                buyerCoolie: "வாங்குவோர் கூலி",
                buyerRent: "வாங்குவோர் வாடகை",
                generateBill: "பில் உருவாக்கு",
                selectAll: "அனைத்தையும் தேர்ந்தெடு",
                deselectAll: "அனைத்தையும் நீக்கு",
                back: "Back",
                language: "மொழி",
                deductions: "கழிவுகள்",
                percentage: "சதவீதம்",
                sackCount: "சாக்கு எண்ணிக்கை",
                auto: "ஆட்டோ",
                manual: "கைமுறை",
                billMode: "பில் உருவாக்கம்",
                magamai_show: "மகமை பில்லில் காட்ட வேண்டுமா",
                dailyPrice: "விலை பட்டியல்",
                addVeg: "addVeg",
                addproducts:"பொருட்கள் சேர்க்க",
                editproducts:"பொருட்கள் திருத்தவும்",
                quantity:"அளவு",
                units:"அலகுகள்",
                paymentMode: "கட்டண முறை",
                shopAddress: "முகவரி",
                shopDetail: "கடை விவரம்",
                discountShow: "தள்ளுபடி பில்லில் காட்ட வேண்டுமா",
                discount: "தள்ளுபடி",
                no: "இல்லை",
                yes: "ஆம்",
                customers:"வாடிக்கையாளர்",
                sales_bill: "விற்பனை பில்",
                marketers: "வணிகர்",
                my_purchase: "கொள்முதல்",
                requirements: "தேவைகள்",
            },
        },
    }
})
export default Slice.reducer