import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/auth/login';
const sendLogin = async(userData) =>{
    try{
        const response = await  axios.post(API_BASE_URL, userData);
        return response.data; // what does this response.data contain?  
        // It will return the response data from the server, which typically includes a token and user information if the login is successful.
    }catch(err){
        console.log('Error in logging in User:', err);
        throw err; // Propagate the error to be handled by the caller
    }
}

export default sendLogin;