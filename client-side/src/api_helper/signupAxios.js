import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/auth/signup';

const sendUser = async(userData) => {
    try{
        const response = await axios.post(API_BASE_URL, userData)
        return response.data; // This will return the response data from the server
    }catch(err){
        console.log('Error in registering User:', err);
    }
}

export default sendUser;
