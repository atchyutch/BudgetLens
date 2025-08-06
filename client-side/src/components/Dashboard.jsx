import React, { use } from 'react';
import axios from 'axios';
import Fuse from "fuse.js";
import {createBudget_frontend, get_budget_details, drop_budget, email_alert_frontend}  from '../api_helper/budgetAxios.js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef} from 'react';
import { useState } from 'react';
import ViewTrans from "./ViewTrans.jsx";
import Header from './Header.jsx';
import Piechart from './Piechart.jsx';
import BudgetProgressBar from './budgetBar.jsx';


function Dashboard (){
    const [get_name, setName] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progressArray , setProgressArray] = useState([]);
    const alertedBudgets = useRef(new Set());

    const url = "http://localhost:5500/db/getuser";
    
    function fetchusername(){
        const response = axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });

        return response;
    }

    useEffect(() => {        
        fetchusername().then((response) => {
            if (response.status === 200) {
                setName(`${response.data.user_firstname} ${response.data.user_lastname}`);
            } else {
                console.error("Failed to fetch username from backend.");
            }
        })
    }, []);


    async function get_trans_frontend(){
        try{
        setLoading(true);
        const url_to_get = "http://localhost:5500/plaid/transactions";
        const response = await  axios.post(url_to_get, {}, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},withCredentials: true});
        if (response.status === 200 && Array.isArray(response.data.transactions)) {
            setTransactions(response.data.transactions ?? []);
          } else {
            console.error('Unexpected response for transactions:', response);
        }} catch (error) {
        console.error('Error fetching transactions:', error);
    }finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      get_trans_frontend();
    }, []); 

    const CATEGORY_KEYWORDS = {
        BANK_FEES: [
          "bank fee", "atm fee", "maintenance fee", "overdraft", "late fee",
          "service charge", "monthly fee", "wire fee"
        ],
      
        CASH_ADVANCE: [
          "cash advance", "credit cash", "cash withdrawal", "atm cash",
          "credit card cash", "cash loan"
        ],
      
        COMMUNITY: [
          "donation", "charity", "church", "temple", "club dues",
          "membership fee", "nonprofit", "community event"
        ],
      
        ENTERTAINMENT: [
          "movie", "movies", "cinema", "netflix", "concert", "music", "theater",
          "amusement park", "streaming", "hulu", "spotify", "gaming", "video game",
        ],
      
        FOOD_AND_DRINK: [
          "food", "restaurant", "fast food", "groceries", "grocery",
          "cafe", "coffee", "bar", "dining", "meal", "snack", "drinks"
        ],
      
        GENERAL_MERCHANDISE: [
          "walmart", "target", "amazon", "superstore", "department store",
          "retail", "merchandise", "shopping mall"
        ],
      
        GENERAL_SERVICES: [
          "repair", "cleaning", "laundry", "subscription", "consulting",
          "service fee", "maintenance service", "utilities service"
        ],
      
        GOVERNMENT_AND_NON_PROFIT: [
          "parking ticket", "license fee", "government fee", "dmv",
          "court fine", "donation nonprofit", "passport fee", "visa fee"
        ],
      
        HEALTHCARE: [
          "doctor", "hospital", "pharmacy", "meds", "medicine", "dentist",
          "clinic", "health insurance", "copay"
        ],
      
        HOUSING: [
          "rent", "mortgage", "apartment", "lease payment", "hoa",
          "property fee", "landlord", "housing"
        ],
      
        INTEREST: [
          "interest income", "interest credit", "interest payment",
          "bank interest", "savings interest"
        ],
      
        INVESTMENT_AND_RETIREMENT_INCOME: [
          "investment", "stocks", "brokerage", "dividend", "401k",
          "ira", "capital gain", "robinhood", "etrade"
        ],
      
        LOAN_PAYMENTS: [
          "loan payment", "student loan", "auto loan", "mortgage payment",
          "personal loan", "emi", "repayment", "lending club"
        ],
      
        PERSONAL_CARE: [
          "salon", "haircut", "spa", "gym", "cosmetics", "beauty",
          "wellness", "massage", "fitness"
        ],
      
        TAXES: [
          "tax", "irs", "state tax", "federal tax", "income tax",
          "property tax", "sales tax"
        ],
      
        TRANSPORTATION: [
          "gas", "fuel", "uber", "lyft", "bus", "metro", "train",
          "parking", "toll", "car maintenance"
        ],
      
        TRAVEL: [
          "flight", "airline", "hotel", "vacation", "airbnb",
          "car rental", "trip", "booking", "expedia", "travel"
        ]
      };
      

    const fuseList = Object.entries(CATEGORY_KEYWORDS).flatMap(
        ([cat, words]) => words.map(w => ({ word: w, category: cat }))
      );
      
    const fuse = new Fuse(fuseList, { keys: ["word"], threshold: 0.3 });

    async function classifier(category){

        if (!category || typeof category !== "string") {
            // fallback or early return
            return "OTHER";
          }

        const best = fuse.search(category)[0];
        return best ? best.item.category : "OTHER";
    }


    function calculate_expenses(txns, budget_id, category_of_budget,budget_amount, budget_name) {
      let amount_spent = 0;
      let category_dict = {};
      txns.forEach(element => {
          if (element.amount <= 0) return; 
          let pfc = element.personal_finance_category?.primary || "OTHER" ;
          category_dict[pfc] = (category_dict[pfc] || 0)+element.amount;
      });

      amount_spent = category_dict[String(category_of_budget)] || 0;

      const balance = budget_amount - amount_spent;
      if (balance < 0 && !alertedBudgets.current.has(budget_id)){
        alertedBudgets.current.add(budget_id);
        const alert_data = { exceeded_amount: Math.abs(balance), id: budget_id, budget_name: budget_name };
        email_alert_frontend(alert_data);
        setTimeout(() => {
          alert(`You have exceeded your budget for ${category_of_budget} by ${Math.abs(balance)}.`);
        }, 1000);
      }
      return {balance, amount_spent};
    }


      async function show_budgets() {
        try{
        const budget_data = await get_budget_details();
        if (!Array.isArray(budget_data) || budget_data.length === 0) {
          console.log("Did not receive any budget from the backend.");
          return;
        }
        const uiList = budget_data.map(budget => {
          const {balance, amount_spent} = calculate_expenses(transactions, budget.budget_id ,budget.budget_category, budget.budget_amount, budget.budget_name );
        return {
            budget_id: budget.budget_id,
            budget_name: budget.budget_name,
            budget_amount: budget.budget_amount,
            budget_balance : balance,
            spent: amount_spent
          };
        });
        setProgressArray(uiList);
        
      }catch (error) {
        console.error('Error fetching budget details:', error);
      }} 

    useEffect(() => {
      if (transactions.length) show_budgets();
    }, [transactions]);

  
    async function handleSetBudget() {
        const budget = prompt("Please enter your budget for this month:");
        const budget_name = prompt("Please enter a name for your budget:");
        const category = prompt("Please Choose the category of your expense:");

        if (!budget || !category) {
            alert("Budget and category are required.");
            return;
        }

        const best_category = await classifier(category);
        console.log("Best matching category:", best_category);
        console.log("Budget set for category:", category, "with amount:", budget);

        const budgetData = {budget_amount:budget, budget_name: budget_name, budget_category: best_category};
        const response = await createBudget_frontend(budgetData);
        console.log("Budget creation response:", response);

        show_budgets(); // Refresh budgets after setting a new one
    }

    async function drop_budget_frontend(){
        const budget_name = prompt("Please enter the name of the budget you want to drop:");
        const budget_id = Number(prompt("Please enter the ID of the budget you want to drop:"));

       

        if (!budget_name || !budget_id) {
            alert("Budget name and ID are required.");
            return;
        }

        const deletion_data = {budget_name: budget_name, budget_id: budget_id};
        try {
            const response = await drop_budget(deletion_data);
            console.log("Budget deletion response:", response);
            show_budgets(); // Refresh budgets after deletion
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    }


    return (<div className='grid grid-rows-[100px_300px]'>
    <Header />
    <div className='grid grid-cols-[0.1fr_5fr]'>
        <div>
            <h2 className = "ml-4 mt-4 font-extrabold font-mono"> Welcome to your dashboard {get_name}!
                Enjoy the facilities we provide to manage your finances effectively.
            </h2>
            <p className = "ml-4 mt-8 font-mono">Here is where you can you view yourm onthly spending charts and latest Transactions.</p>
            <p className = "ml-4 font-mono">We are have comethrough for you, to provide you with the most important services you need.</p>
            {/* <button onClick = {get_trans_frontend} className = "ml-4 mt-4 font-mono relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-black  to-zinc-800 px-6 py-3 font-semibold text-gray-100 shadow-md transition hover:accent-stone-900 hover:brightness-110 active:scale-95" >
                    <span className="relative z-10"> {loading ? "Loading…" : "Get Your Transactions"} </span>
                </button> */}

                {transactions.length > 0 && <ViewTrans data={transactions} />}

            {transactions.length === 0 && !loading && (
                <p className="text-gray-500 ml-4 mt-4 font-mono" >Click the button to retrieve your transactions display.</p>
            )}

            <button onClick = {handleSetBudget} className='ml-4 mt-4 font-mono relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-black  to-zinc-800 px-6 py-3 font-semibold text-gray-100 shadow-md transition hover:accent-stone-900 hover:brightness-110 active:scale-95'>
                Add my budget
            </button>
            <button onClick = {drop_budget_frontend} className='ml-4 mt-4 font-mono relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-black  to-zinc-800 px-6 py-3 font-semibold text-gray-100 shadow-md transition hover:accent-stone-900 hover:brightness-110 active:scale-95'>
                Drop a budget
            </button>
            <div className = "ml-4 mt-4 font-mono">
              Your current budgets are as follows:
              {progressArray.map(each => {
                return(
                <BudgetProgressBar 
                key = {each.budget_id}
                id = {each.budget_id}
                name={each.budget_name}
                total= {each.budget_amount}
                spent= {each.spent}
                balance= {each.budget_balance}
              />);
              })}
              
            </div>
        </div>
        <Piechart txns={transactions} />
            
     </div>
     </div>);
}



export default Dashboard;