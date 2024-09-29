import React, { useEffect, useState } from 'react';
import { getAccounts } from '../../services/customer/CustomerService';
import { initiateCheckout } from '../../services/policy/Policy'; // Import the payment initiation function
import PaginationApp from '../shared/page/PaginationApp';
import PageSizeSetter from '../shared/page/PageSizeSetter';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';
import { Modal, Button } from 'react-bootstrap';

function ShowAccounts() {
    const [account, setAccount] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedPolicy, setSelectedPolicy] = useState(null); 
    const [showModal, setShowModal] = useState(false); 

    // Function to get all accounts (policies)
    const allAccounts = async () => {
        try {
            let response = await getAccounts(pageNumber, pageSize, localStorage.getItem('username'));
            const content = response.data;
            setAccount(Array.isArray(content) ? content : [content]);

            const totalPolicies = content.length || 1;
            setTotalPages(Math.ceil(totalPolicies / pageSize));
            setTotalElements(totalPolicies);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };

    useEffect(() => {
        allAccounts();
    }, [pageNumber, pageSize]);

    // Function to handle the Payment button click
    const handlePaymentClick = (policy) => {
        setSelectedPolicy(policy); 
        setShowModal(true); 
    };

    // Function to handle the "Pay" button click for a payment
    const handlePay = async (paymentIndex) => {
        const payment = selectedPolicy.payments[paymentIndex];
        
        if (payment.paymentStatus === 'UNPAID') {
            const paymentData = {
                amount: payment.amount,
                policyId: selectedPolicy.policyId,
                paymentId: payment.paymentId,
            };
            
            try {
                // Initiate the Stripe checkout session
                await initiateCheckout(paymentData);
            } catch (error) {
                console.error('Error initiating checkout:', error);
                alert('Failed to initiate payment. Please try again.');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Navbar />
            <div className='container'>
                <div className='row my-5 align-items-center'>
                    <div className='col-3'>
                        <PaginationApp
                            totalpage={totalPages}
                            setpage={setPageNumber}
                            pageNumber={pageNumber}
                        />
                    </div>
                    <div className='col-6'>
                        <input
                            className='form-control rounded-pill px-3 text-primary fw-bold'
                            placeholder='Search here'
                        />
                    </div>
                    <div className='col-3'>
                        <PageSizeSetter setPageSize={setPageSize} pageSize={pageSize} />
                    </div>
                </div>

                <div className='row'>
                    <div className='col-12'>
                        <div className='h1 text-bg-dark text-center py-3'>Customer Policies</div>

                        {account.length > 0 ? (
                            <div className='table-responsive'>
                                <table className="table table-sm table-bordered shadow-lg table-info text-center">
                                    <thead>
                                        <tr>
                                            <th>Policy No</th>
                                            <th>Issue Date</th>
                                            <th>Maturity Date</th>
                                            <th>Premium Type</th>
                                            <th>Premium Amount</th>
                                            <th>Sum Assured</th>
                                            <th>Status</th>
                                            <th>Nominees</th>
                                            <th>Action</th> {/* Add Action column */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {account.map((policy, index) => (
                                            <tr key={index}>
                                                <td>{policy.policyId}</td>
                                                <td>{new Date(policy.issueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                <td>{new Date(policy.maturityDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                <td>{policy.premiumType}</td>
                                                <td>{policy.premiumAmount.toFixed(2)}</td>
                                                <td>{policy.sumAssured.toFixed(2)}</td>
                                                <td>{policy.policyStatus}</td>
                                                <td>
                                                    {policy.nominees?.length > 0
                                                        ? policy.nominees.map(nominee => `${nominee.nomineeName} (${nominee.nomineeRelation})`).join(', ')
                                                        : 'No Nominees'}
                                                </td>
                                                <td>
                                                    {/* Show Payment button for all statuses, but disable it for PENDING or REJECT */}
                                                    <Button 
                                                        variant="primary" 
                                                        onClick={() => handlePaymentClick(policy)}
                                                        disabled={policy.policyStatus === 'PENDING' || policy.policyStatus === 'REJECT'}
                                                    >
                                                        View Payments
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className='text-center fw-bold text-danger fs-1'>No Policies Found</div>
                        )}
                    </div>
                </div>

                {/* Pagination Below the Table */}
                <div className='row justify-content-center my-4'>
                    <div className='col-4'>
                        <PaginationApp
                            totalpage={totalPages}
                            setpage={setPageNumber}
                            pageNumber={pageNumber}
                        />
                    </div>
                </div>
            </div>
            <Footer />

            {/* Modal for displaying payments */}
            {selectedPolicy && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Payments for Policy #{selectedPolicy.policyId}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedPolicy.payments && selectedPolicy.payments.length > 0 ? (
                            <table className="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th>Payment ID</th>
                                        <th>Amount</th>
                                        <th>Payment Status</th>
                                        <th>Reference</th>
                                        <th>Action</th> {/* Add Action column */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedPolicy.payments.map((payment, index) => (
                                        <tr key={index}>
                                            <td>{payment.paymentId}</td>
                                            <td>{payment.amount.toFixed(2)}</td>
                                            <td>{payment.paymentStatus}</td>
                                            <td>{payment.paymentReference}</td>
                                            <td>
                                                {payment.paymentStatus === 'UNPAID' ? (
                                                    <Button variant="success" onClick={() => handlePay(index)}>
                                                        Pay
                                                    </Button>
                                                ) : (
                                                    <Button variant="secondary" disabled>
                                                        Paid
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No payments found for this policy.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}

export default ShowAccounts;
