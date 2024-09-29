import axios from "axios";

export const addImage=async (data,policyId)=>{
    try {

        let response = await axios.post(
            `http://localhost:8081/insuranceapp/policy/${policyId}/upload`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization:localStorage.getItem('auth')
            }
        }

        )

        return response;
    } catch (error) {

        throw error;

    }
}