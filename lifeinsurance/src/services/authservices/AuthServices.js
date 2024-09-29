
import axios from "axios"

export const loginService= async (userName,password,roleType)=>{
       
     const response = await axios.post(`http://localhost:8081/insuranceapp/login`,{
        
            userName,
            password,
            roleType
        
     })
     const { token, customerId } = response.data; 
     localStorage.setItem('customerId', customerId);

     return response;
      
}

export const validateUser= async (authToken)=>{
     try{
   
     console.log("inside validator >>>>>>>>>>>>>>>>>>>>>>>>>>>>>",authToken)
   
   let response = await axios.get(`http://localhost:8081/insuranceapp/validator`,{
   
     headers:
     {
       Authorization: authToken
     }
   
   
   })
   
   console.log("response value is ----------------",response)
   return response;
   } catch (error) {
     throw error
   }
   
   }
 
const BASE_URL = 'http://localhost:8081/insuranceapp';

export const requestOtp = async ({ username }) => {
  const token = localStorage.getItem('authToken'); 
  const response = await axios.post('http://localhost:8081/insuranceapp/forgot-password', null, {
    params: { username },
    headers: {
      Authorization: localStorage.getItem('auth')
    }
  });
  return response.data;
};

export const sendOtp = async ({ email }) => {
  const response = await axios.post('/api/auth/forgot-password', { email });
  
  return response.data;
};

export const verifyOtpAndResetPassword = async (email, otp, newPassword, confirmPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/verify-otp`, {
      email,
      otp,
      newPassword,
      confirmPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to reset password');
  }
};