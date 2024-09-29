import axios from "axios";

// Utility function to get the authorization token
const getAuthToken = () => {
  const token = localStorage.getItem('auth');
  if (!token) {
    throw new Error('Authorization token is missing');
  }
  return token;
};

// Function to get all customers with pagination
export const getAllCustomer = async (pageNumber = 0, pageSize = 10) => {
  try {
    const response = await axios.get('http://localhost:8081/insuranceapp/getAllCustomers', {
      params: {
        pageNumber,
        pageSize
      },
      headers: {
        Authorization: getAuthToken()
      }
    });
    console.log('API Response:', response.data);
    return response;
  } catch (error) {
    console.error('Failed to fetch customer data:', error.response?.data || error.message);
    throw error;
  }
};

// Function to save a new customer
export const saveCustomer = async (data) => {
  try {
    const response = await axios.post('http://localhost:8081/insuranceapp/addcustomer', data, {
      headers: {
        Authorization: getAuthToken()
      }
    });
    console.log("Customer registration response:", response);
    return response;
  } catch (error) {
    console.error('Error saving customer:', error.response?.data || error.message);
    throw error;
  }
};

// Function to update a customer's information
export const updateCustomerService = async (data) => {
  try {
    const response = await axios.put('http://localhost:8081/insuranceapp/editCustomer', data, {
      headers: {
        Authorization: getAuthToken()
      }
    });
    return response;
  } catch (error) {
    console.error('Error updating customer:', error.response?.data || error.message);
    throw error;
  }
};

// Function to delete a customer by their ID
export const deleteCustomerService = async (customerId) => {
  try {
    const response = await axios.delete('http://localhost:8081/insuranceapp/customer', {
      params: { customerId },
      headers: {
        Authorization: getAuthToken()
      }
    });
    return response;
  } catch (error) {
    console.error('Error deleting customer:', error.response?.data || error.message);
    throw error;
  }
};

// Function to get a customer by their username
export const getCustomerByUsername = async (username) => {
  try {
    const response = await axios.get('http://localhost:8081/insuranceapp/getCustomerByUsername', {
      params: { username },
      headers: {
        Authorization: getAuthToken()
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching customer by username:', error.response?.data || error.message);
    throw error;
  }
};

// Function to fetch insurance policies for a customer with pagination
export const getAccounts = async (pageNumber, pageSize, username) => {
  try {
    const response = await axios.get('http://localhost:8081/insuranceapp/policy', {
      params: {
        pageNumber,  // Current page number
        pageSize,    // Number of policies per page
        username     // Username to fetch policies for the customer
      },
      headers: {
        Authorization: getAuthToken()  // Include JWT token or authorization header if required
      }
    });
    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error('Failed to get accounts:', error.response?.data || error.message);
    throw error;
  }
};

// Function to register a new customer
export const registerCustomer = async (data) => {
  try {
    const response = await axios.post('http://localhost:8081/insuranceapp/register', data, {
      headers: {
        
      }
    });
    console.log('Customer registration response:', response);
    return response;
  } catch (error) {
    console.error('Error during customer registration:', error.response?.data || error.message);
    throw error;
  }
};
