import axios from "axios";


export const addPolicy = async (data) => {
    try {
        console.log("Data being sent:", data,);
        let response = await axios.post(
            'http://localhost:8081/insuranceapp/addpolicy',
            data,
            {
                headers: {
                   'Content-Type': 'application/json',
                    // Authorization:localStorage.getItem('auth')
                }
            }
        );
        return response;
    } catch (error) {
        console.error("Error adding policy:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// export const getPolicy = async (pageNumber, username) => {
//     try {
//         let response = await axios.get(
//             'http://localhost:8081/insuranceapp/policy',
//             {
//                 params: { pageNumber, username },
//                 headers: {
//                     Authorization:localStorage.getItem('auth')
//                 }
//             }
//         );
//         return response;
//     } catch (error) {
//         console.error("Error fetching policy:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };

// export const getAllAccounts = async (pageNumber, pageSize) => {
//     try {
//         let response = await axios.get(
//             'http://localhost:8081/insuranceapp/allpolicy',
//             {
//                 params: { pageNumber, pageSize },
//                 headers: {
//                     Authorization:localStorage.getItem('auth')
//                 }
//             }
//         );
//         return response;
//     } catch (error) {
//         console.error("Error fetching all accounts:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };



// // export const addPayment = async (username) => {
// //     try {
// //         const response = await axios.get(
// //             'http://localhost:8081/insuranceapp/payments',
// //             {
// //                 params: { username },  // Pass username as a query parameter
// //                 headers: {
// //                     Authorization: localStorage.getItem('auth'),
// //                     'Content-Type': 'application/json'
// //                 }
// //             }
// //         );
// //         return response.data; // Return the data from the response
// //     } catch (error) {
// //         console.error("Error fetching payments:", error.response ? error.response.data : error.message);
// //         throw error;  // Rethrow the error to be handled by the component
// //     }
// // };

// export const addPayment = async () => {
//     try {
//         const username = localStorage.getItem('username');
//         const token = localStorage.getItem('auth');

//         if (!username) {
//             throw new Error('Username not found in localStorage');
//         }

//         if (!token) {
//             throw new Error('Authorization token not found');
//         }

//         const response = await axios.get(
//             'http://localhost:8081/insuranceapp/payments',
//             {
//                 params: { username },
//                 headers: {
//                                       Authorization: localStorage.getItem('auth'),
//                                          'Content-Type': 'application/json'
//                                      }
//             }
//         );

//         return response.data;
//     } catch (error) {
//         console.error("Error fetching payments:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };

// // // Example paymentDto
// // const paymentDto = {
// //     username: localStorage.getItem('username'),
// //     policyId: 1234,
// //     paymentId: 5678,
// //     paymentType: 'Credit Card',
// //     amount: 100.00,
// //     cardNumber: '4111111111111111',
// //     cvv: 123,
// //     expiry: '12/24'
// // };
// export const pandingPolicy = async (pageNumber) => {
//     try {
//         let response = await axios.get(
//             'http://localhost:8081/insuranceapp/PendingPolicy',
//             {
//                 params: { pageNumber },
//                 headers: {
//                     Authorization:localStorage.getItem('auth')
//                 }
//             }
//         );
//         return response;
//     } catch (error) {
//         console.error("Error fetching pending policy:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };

// export const paylist = async (policyId) => {
//     try {
//         let response = await axios.get(
//             'http://localhost:8081/insuranceapp/payments',
//             {
//                 params: { policyId },
//                 headers: {
//                     Authorization:localStorage.getItem('auth')
//                 }
//             }
//         );
//         return response;
//     } catch (error) {
//         console.error("Error fetching payment list:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };

// export const approvePolicy = async (policyId) => {
//     try {
//         console.log("id in service:", policyId);
//         let response = await axios.get(
//             'http://localhost:8081/insuranceapp/approvePolicy',
//             {
//                 params: { policyId },
//                 headers: {
//                     Authorization:localStorage.getItem('auth')
//                 }
//             }
//         );
//         return response;
//     } catch (error) {
//         console.error("Error approving policy:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };

// export const getClaim = async (param1) => {
//     try {
//         console.log("params are:", param1);
//         let response = await axios.post(
//             'http://localhost:8081/insuranceapp/claimPolicy',
//             param1,
//             {
//                 headers: {
//                     Authorization:localStorage.getItem('auth')
//                 }
//             }
//         );
//         return response;
//     } catch (error) {
//         console.error("Error getting claim:", error.response ? error.response.data : error.message);
//         throw error;
//     }

// };
// export const getAllAccounts1 = async (pageNumber, pageSize) => {
//     try {
//         let response = await axios.get(
//             'http://localhost:8081/insuranceapp/customers-by-agent/{agentId}',
//             {
//                 params: { pageNumber, pageSize },
//                 headers: {
//                     Authorization:localStorage.getItem('auth')
//                 }
//             }
//         );
//         return response;
//     } catch (error) {
//         console.error("Error fetching all accounts:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };


// export const addPolicy=async (data)=>{
//     try {
//         console.log('Data being sent:', data); 
//         let response = await axios.post(
//             'http://localhost:8081/insuranceapp/addpolicy', data, {
//             headers: {
//                 Authorization:localStorage.getItem('auth')
//             }
//         }

//         )

//         return response;
//     } catch (error) {
//         if (error.response) {
//             console.error('Error response data:', error.response.data);
//             console.error('Error status:', error.response.status);
//             console.error('Error headers:', error.response.headers);
//         } else if (error.request) {
//             console.error('Error request:', error.request);
//         } else {
//             console.error('Error message:', error.message);
//         }
//         throw error;

//     }
// }

export const getPolicy=async(pageNumber,pageSize,username)=>{
    try {
        if (username === undefined || username === null) {
            throw new Error('Username parameter is required');
        }
        const response = await axios.get(
            'http://localhost:8081/insuranceapp/policy',
            {
                params: {
                    pageNumber,
                    pageSize,
                    username
                }
                ,
                headers: {
                    Authorization:localStorage.getItem('auth')
                }
            }

        )

        return response.data;

    }
    catch (error) {
        console.error('Error fetching policy:', error.message);
       
        throw error;
    }

}

export const getAllAccounts=async(pageNumber,pageSize)=>{
    try {
        
        const response = await axios.get(
            'http://localhost:8081/insuranceapp/allpolicy',
            {
                params: {
                    pageNumber,
                    pageSize
                }
                ,
                headers: {
                    Authorization:localStorage.getItem('auth')
                }
            }

        )

        return response;

    }
    catch (error) {
        throw error;
    }

}




    // export const addPayment=async (param)=>{
    //     try {
    //          console.log("params are-----------------",param)
    //         let response = await axios.post(
    //             'http://localhost:8080/insuranceapp/payments',param,
    //               {
    //             headers: {
    //                 Authorization:localStorage.getItem('auth')
    //               }
    //             }    
                
    //         )
    
    //         return response;
    //     } catch (error) {
    
    //         throw error;
    
    //     }
    // }

    export const pendingPolicy = async (pageNumber,pageSize) => {
        try {
            // Make the GET request to fetch pending policies
            let response = await axios.get(
                'http://localhost:8081/insuranceapp/PendingPolicy',
                {
                    params: { pageNumber,pageSize},
                    headers: {
                        Authorization: localStorage.getItem('auth') 
                    }
                }
            );
            
    
            // Check if the response data is valid
            if (!response.data || response.data.length === 0) {
                console.warn('No policies found for the given page number.');
            }
    
            return response;
        } catch (error) {
            // Log detailed error information
            console.error('Error fetching pending policies:', error.response ? error.response.data : error.message);
            
            // Display user-friendly error message
            if (error.response && error.response.status === 400) {
                alert('No pending policies available at this moment.');
            } else {
                alert('An error occurred while fetching policies. Please try again later.');
            }
    
            throw error;  // Rethrow error after logging
        }
    }

export const addPayment = async () => {
    try {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('auth');

        if (!username || !token) {
            throw new Error('Missing authentication details');
        }

        const response = await axios.get(
            'http://localhost:8081/insuranceapp/payments',
            {
                params: { username },
                headers: {
                                    Authorization:localStorage.getItem('auth')
                                  }
            }
        );
        console.log(response.data);
        return response.data;
        
    } catch (error) {
        console.error("Error fetching payments:", error.response ? error.response.data : error.message);
        throw error;  // Rethrow the error to be handled by the component
    }
};


    export const paylist=async (policyId)=>{
    
        let response = await axios.get(
            'http://localhost:8081/insuranceapp/payments',{
             params:
              {
                policyId
              },
            headers: {
                Authorization:localStorage.getItem('auth')
              }
            } 
            
        )

        return response;
    
}


export const approvePolicy=async (policyId)=>{
    try {
        console.log("id in service==",policyId)
        let response = await axios.get(
            'http://localhost:8081/insuranceapp/approvePolicy',{
             params:
              {
                policyId
              },
            headers: {
                Authorization:localStorage.getItem('auth')
              }
            } 
            
        )
    
        return response;
    } catch (error) {
        throw error;
    
    }
    

}

export const rejectPolicy=async (policyId)=>{
    try {
        console.log("id in service==",policyId)
        let response = await axios.get(
            'http://localhost:8081/insuranceapp/rejectPolicy',{
             params:
              {
                policyId
              },
            headers: {
                Authorization:localStorage.getItem('auth')
              }
            } 
            
        )
    
        return response;
    } catch (error) {
        throw error;
    
    }
    

}


export const getClaim=async (param1)=>{
    try {
         console.log("params are-----------------",param1)
        let response = await axios.post(
            'http://localhost:8081/insuranceapp/claimPolicy',param1,
              {
            headers: {
                Authorization:localStorage.getItem('auth')
              }
            }    
            
        )

        return response;
    } catch (error) {

        throw error;

    }
}

export const getAllAccounts1 = async (pageNumber, pageSize) => {
        try {
            let response = await axios.get(
                'http://localhost:8081/insuranceapp/customers-by-agent/{agentId}',
                {
                    params: { pageNumber, pageSize },
                    headers: {
                        Authorization:localStorage.getItem('auth')
                    }
                }
            );
            return response;
        } catch (error) {
            console.error("Error fetching all accounts:", error.response ? error.response.data : error.message);
            throw error;
        }
    };

    // export const downloadDocument = (documentId) => {
    //     return axios.get(`/documents/${documentId}/download`, {
    //       responseType: 'blob', // Ensures the response is handled as binary
    //     });
    //   };

    
export const downloadDocument = async (documentId) => {
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('auth');
      if (!token) throw new Error('Authorization token not found');
  
      const response = await axios.get(`http://localhost:8081/insuranceapp/documents/${documentId}/download`, {
        headers: {
          Authorization: localStorage.getItem('auth'), // Pass the token for authentication if required
        },
        responseType: 'blob', // Ensure we get binary data as a Blob
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to download document. Please check the server response.');
      }
  
      return response; // Return the full response for further use
    } catch (error) {
      console.error('Error downloading document:', error);
      throw new Error('Failed to download document');
    }
  };
  export const initiateCheckout = async (requestData) => {
    try {
        // Get the authentication token from localStorage
        const token = localStorage.getItem('auth');
        if (!token) throw new Error('Authorization token not found');

        // Make the POST request to create the checkout session
        const response = await axios.post(
            'http://localhost:8081/insuranceapp/create-checkout-session', // Update the URL to your backend endpoint
            requestData, // Request data including amount and any other necessary fields
            {
                headers: {
                    Authorization: token, // Use the token from localStorage for authentication
                    'Content-Type': 'application/json',
                }
            }
        );

        // Redirect to the checkout page using the Stripe session URL returned from the backend
        if (response.data.sessionId) {
            const checkoutUrl = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
            window.location.href = checkoutUrl; // Redirect to the Stripe Checkout page
        } else {
            throw new Error('Failed to initiate checkout session. No session ID returned.');
        }
    } catch (error) {
        console.error('Error initiating checkout session:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error to be handled by the calling component
    }
};
