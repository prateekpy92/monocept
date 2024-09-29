import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Pagination } from 'react-bootstrap';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';
import axios from 'axios';

const WithdrawalRequests = () => {
    const [withdrawalRequests, setWithdrawalRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchWithdrawalRequests();
    }, [pageNumber, pageSize, searchQuery]);

    const fetchWithdrawalRequests = async () => {
        try {
            const response = await axios.get('http://localhost:8081/insuranceapp/withdrawal-requests', {
                params: {
                    page: pageNumber,
                    size: pageSize,
                    search: searchQuery,
                },
                headers: {
                    Authorization: localStorage.getItem('auth'),
                },
            });
            setWithdrawalRequests(response.data?.content || []);
            setTotalPages(Math.ceil(response.data?.totalElements / pageSize));
        } catch (error) {
            console.error('Error fetching withdrawal requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`http://localhost:8081/insuranceapp/withdrawal/approve/${id}`, null, {
                params: { remarks },
                headers: {
                    Authorization: localStorage.getItem('auth'),
                },
            });

            // Update the status of the approved request in the local state
            setWithdrawalRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.withdrawalId === id ? { ...request, status: 'APPROVED' } : request
                )
            );

            setShowModal(false);
        } catch (error) {
            console.error('Error approving withdrawal:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`http://localhost:8081/insuranceapp/withdrawal/reject/${id}`, null, {
                params: { remarks },
                headers: {
                    Authorization: localStorage.getItem('auth'),
                },
            });

            // Optionally, you can update the status for rejected requests similarly
            fetchWithdrawalRequests();
            setShowModal(false);
        } catch (error) {
            console.error('Error rejecting withdrawal:', error);
        }
    };

    const handleShowModal = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPageNumber(0); // Reset to the first page when searching
    };

    // Function to handle pagination
    const handlePagination = (pageIndex) => {
        setPageNumber(pageIndex);
    };

    if (loading) {
        return <p>Loading withdrawal requests...</p>;
    }

    return (
        <>
            <Navbar />
            <div className='bg-warning text-center display-3 py-3 text-dark fw-bold'>Withdrawal Requests</div>
            <div className='container'>
                {/* Pagination and Search Bar */}
                <div className='row my-5'>
                    <div className='col-4'>
                        {/* Pagination */}
                        <Pagination>
                            <Pagination.First onClick={() => handlePagination(0)} disabled={pageNumber === 0} />
                            <Pagination.Prev onClick={() => handlePagination(pageNumber - 1)} disabled={pageNumber === 0} />
                            {Array.from({ length: totalPages }, (_, index) => (
                                <Pagination.Item
                                    key={index}
                                    active={index === pageNumber}
                                    onClick={() => handlePagination(index)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePagination(pageNumber + 1)} disabled={pageNumber === totalPages - 1} />
                            <Pagination.Last onClick={() => handlePagination(totalPages - 1)} disabled={pageNumber === totalPages - 1} />
                        </Pagination>
                    </div>

                    <div className='col-4'>
                        <input
                            className='rounded-pill px-3 text-primary fw-bold form-control'
                            placeholder='Search by Agent ID or Status'
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className='col-2 offset-2'>
                        <select
                            className='form-select'
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>
                </div>

                {/* Withdrawal Requests Table */}
                <div className='row'>
                    <div className='col-12'>
                        {withdrawalRequests.length > 0 ? (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Agent ID</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawalRequests.map((request, index) => (
                                        <tr key={request.withdrawalId || index}>
                                            <td>{request.agentId || 'N/A'}</td>
                                            <td>{request.status}</td>
                                            <td>{request.amount}</td>
                                            <td>
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleShowModal(request)}
                                                    className="me-2"
                                                    disabled={request.status === 'APPROVED'} // Disable if approved
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleReject(request.withdrawalId)}
                                                    disabled={request.status === 'REJECTED'} // Optionally disable if rejected
                                                >
                                                    Reject
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className='text-center fw-bold text-danger fs-1'>No withdrawal requests found.</p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            {/* Modal for Approving/Rejecting Requests */}
            {selectedRequest && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Approve/Reject Withdrawal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Do you want to approve or reject this withdrawal request?</p>
                        <p><strong>Agent ID:</strong> {selectedRequest.agentId || 'N/A'}</p>
                        <p><strong>Amount:</strong> {selectedRequest.amount}</p>
                        <textarea
                            className="form-control"
                            placeholder="Add remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="success" onClick={() => handleApprove(selectedRequest.withdrawalId)} disabled={selectedRequest.status === 'APPROVED'}>
                            Approve
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default WithdrawalRequests;
