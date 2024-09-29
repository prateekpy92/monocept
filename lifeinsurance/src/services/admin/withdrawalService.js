import axios from 'axios';

// Function to get all withdrawal requests
export const getAllWithdrawalRequests = async (params) => {
  try {
    const response = await axios.get('http://localhost:8081/insuranceapp/withdrawal-requests', {
      params: params,
      headers: {
        Authorization: localStorage.getItem('auth'),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Approve withdrawal request
export const approveWithdrawal = async (id, remarks) => {
  try {
    const response = await axios.put(
      `http://localhost:8081/insuranceapp/withdrawal/approve/${id}`,
      null,
      {
        params: { remarks },
        headers: {
          Authorization: localStorage.getItem('auth'),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error approving withdrawal:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Reject withdrawal request
export const rejectWithdrawal = async (id, remarks) => {
  try {
    const response = await axios.put(
      `http://localhost:8081/insuranceapp/withdrawal/reject/${id}`,
      null,
      {
        params: { remarks },
        headers: {
          Authorization: localStorage.getItem('auth'),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting withdrawal:', error.response ? error.response.data : error.message);
    throw error;
  }
};
