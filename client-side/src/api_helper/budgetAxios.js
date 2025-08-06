import axios from 'axios';

const URL_create_budget = "http://localhost:5500/db/create_budget";
const URL_get_budget_details = "http://localhost:5500/db/send_budget_details";
const URL_drop_user_budget = "http://localhost:5500/db/drop_budget";
const URL_email_alert = "http://localhost:5500/db/email_alert";

export const createBudget_frontend = async (budgetData) => {
    try{
        const response = await axios.post(URL_create_budget, budgetData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        return response.data; // This will return the response data from the server, which typically includes the created budget details.
    }catch(err){
        console.error('Error creating budget from budgetAxios.js:', err);
        throw err; 
    }
}


export const get_budget_details = async() =>{
    try{
        const response = await axios.get(URL_get_budget_details, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        if (!response.data){
            return "No budgets found for this user";
        }
        return response.data.data; // This will return the budget details from the server.
    }

    catch(err){
        console.error('Error fetching budget details from budgetAxios.js:', err);
        throw err; 
    }
}


export const drop_budget = async(deletion_data) =>{
    try{
        const backend_response = await axios.delete(URL_drop_user_budget,
            {
              data: deletion_data,                        // ← body goes here
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // space after Bearer
              },
              withCredentials: true                       // keep if you rely on cookies
            });
        if (backend_response.data.status === 1) {
            return backend_response.data.message; // Return success message
        } else {
            throw new Error(backend_response.data.error || "Failed to delete budget");
        }
    }catch(err){
        console.error('Error deleting budget from budgetAxios.js:', err);
        throw err; // Rethrow the error to be handled by the calling function
    }
}

export async function email_alert_frontend(alert_data){
        try{
        axios.post(URL_email_alert,alert_data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
    }catch(err){
        console.error('Error sending email alert from budgetAxios.js:', err);
        throw err;
    }

}