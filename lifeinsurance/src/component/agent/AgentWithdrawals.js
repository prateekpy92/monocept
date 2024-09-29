import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AgentWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const fetchWithdrawals = async () => {
    try {
      const response = await axios.get('http://localhost:8081/insuranceapp/allwithdrawal', {
        params: {
          page,
          size,
          status: status || '', // Only include status if it's not null
        },
        headers: {
          Authorization:localStorage.getItem('auth'),
        },
      });

      setWithdrawals(response.data.content || []);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      setError('Failed to fetch withdrawals');
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [page, size, status]);

  // Handle pagination
  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  // Handle status change
  const handleStatusChange = (e) => setStatus(e.target.value);

  return (
    <div>
      <h2>Your Withdrawals</h2>

      {/* Status Filter */}
      <div>
        <label>Status: </label>
        <select onChange={handleStatusChange} value={status || ''}>
          <option value="">All</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Withdrawal Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Request Date</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal.withdrawalId}>
              <td>{withdrawal.withdrawalId}</td>
              <td>{withdrawal.status}</td>
              <td>{withdrawal.amount}</td>
              <td>{new Date(withdrawal.withdrawalRequestDate).toLocaleDateString()}</td>
              <td>{withdrawal.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={previousPage} disabled={page === 0}>Previous</button>
        <span> Page {page + 1} of {totalPages} </span>
        <button onClick={nextPage} disabled={page === totalPages - 1}>Next</button>
      </div>
    </div>
  );
};

export default AgentWithdrawals;
