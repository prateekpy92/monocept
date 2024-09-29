import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    paymentType: "",
    amount: 0,
    cardNumber: "",
    cvv: "",
    expiry: "",
  });

  // Fetch active policies for the logged-in customer
  useEffect(() => {
    const fetchActivePolicies = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          toast.error("No authentication token found");
          return;
        }

        // Fetch the active policies for the logged-in customer
        const response = await axios.get("http://localhost:8081/insuranceapp/policies", {
          headers: {
            Authorization: localStorage.getItem('auth') // Ensuring token is passed properly
          },
        });

        console.log("Fetched Policies:", response.data); // Log the fetched data
        setPolicies(response.data); // Assuming response.data contains an array of policies
      } catch (error) {
        console.error("Error fetching active policies:", error);
        toast.error("Error fetching active policies");
      }
    };

    fetchActivePolicies();
  }, []);

  // Handle input change for payment form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  // Handle payment submission
  const handlePaymentSubmit = async (policyId) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const response = await axios.post(
        "http://localhost:8081/insuranceapp/payment",
        {
          ...paymentDetails,
          policyId: policyId, // The policy to make the payment for
        },
        {
          headers: {
            Authorization:  localStorage.getItem('auth'), // Ensure token is passed correctly
          },
        }
      );

      if (response.status === 200) {
        toast.success("Payment successful");
        setSelectedPolicy(null); // Close the form
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error processing payment");
    }
  };

  return (
    <div>
      <h1>Your Active Policies</h1>
      <ul>
        {policies.length === 0 ? (
          <li>No active policies found</li>
        ) : (
          policies.map((policy) => {
            console.log("Rendering Policy:", policy); // Log each policy during rendering
            return (
              <li key={policy.policyId}>
                <h3>Policy ID: {policy.policyId}</h3>
                <p>Premium Amount: {policy.premiumAmount}</p>
                <button onClick={() => setSelectedPolicy(policy)}>Pay</button>
              </li>
            );
          })
        )}
      </ul>

      {/* Show payment form when a policy is selected */}
      {selectedPolicy && (
        <div className="payment-form">
          {console.log("Selected Policy for Payment:", selectedPolicy)} {/* Log selected policy */}
          <h2>Make Payment for Policy ID: {selectedPolicy.policyId}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePaymentSubmit(selectedPolicy.policyId);
            }}
          >
            <div>
              <label>Payment Type:</label>
              <select
                name="paymentType"
                value={paymentDetails.paymentType}
                onChange={handleChange}
              >
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
              </select>
            </div>

            <div>
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={paymentDetails.amount}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Card Number:</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>CVV:</label>
              <input
                type="number"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Expiry Date:</label>
              <input
                type="text"
                name="expiry"
                value={paymentDetails.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
              />
            </div>

            <button type="submit">Submit Payment</button>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CustomerPolicies;
