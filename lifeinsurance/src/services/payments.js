import React from 'react';

function Payments({ data, onPayClick }) {
  return (
    <table className='table table-bordered text-center table-hover table-striped'>
      <thead className='bg-dark text-light'>
        <tr>
          <th>Payment ID</th>
          <th>Payment Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((payment) => (
            <tr key={payment.paymentId}>
              <td>{payment.paymentId}</td>
              <td>{payment.paymentDate}</td>
              <td>{payment.amount}</td>
              <td>{payment.paymentStatus}</td>
              <td>
                {payment.paymentStatus === 'UNPAID' ? (
                  <button className='btn btn-success' onClick={() => onPayClick(payment.paymentId)}>
                    Pay
                  </button>
                ) : (
                  <span className='text-success'>Paid</span>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan='5' className='text-center'>No Payments Found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default Payments;
