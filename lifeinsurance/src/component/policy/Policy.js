import React, { useEffect, useState } from 'react';
import { getAccounts } from '../../services/customer/CustomerService';
import PaginationApp from '../shared/page/PaginationApp';
import PageSizeSetter from '../shared/page/PageSizeSetter';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';
import { addPayment, paylist } from '../../services/policy/Policy';
import { successAlet, warningAlert } from '../alerts/Alert'; 

function ShowAccounts() {
  const [account, setAccount] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [payment, setPayment] = useState([]);
  const [policyId, setPolicyId] = useState(0);
  const [claim, setClaim] = useState(false);

  const allAccounts = async () => {
    try {
      let response = await getAccounts(pageNumber, pageSize, localStorage.getItem('username'));
      if (response && response.data) {
        const accountsData = response.data.content || [];
        setData(accountsData);
        setTotalPages(Math.ceil(parseInt(response.headers['customer-account'], 10) / pageSize));
        setTotalElements(parseInt(response.headers['customer-account'], 10));

        let val = accountsData.map((element) => ({
          policyNo: element.policyNo,
          Status: element.status
        }));

        setAccount(val);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const getPayments = async () => {
    if (policyId !== 0) {
      try {
        let payments = await paylist(policyId);
        let flag = true;
        payments.data.forEach((p) => {
          p.paymentDate = p.paymentDate.substring(0, 10);
          if (p.paymentStatus === "UNPAID") flag = false;
        });
        setClaim(flag);
        setPayment(payments.data);
        setShow(true);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    }
  };

  const handlePayment = async (paymentId) => {
    try {
      let response = await addPayment(paymentId);
      successAlet('Payment successful!');
      getPayments(); // Refresh the payments list
    } catch (error) {
      console.error('Error processing payment:', error);
      warningAlert('Payment failed.');
    }
  };

  const paymentHandler = (detail) => {
    setPolicyId(detail.policyNo);
  };

  useEffect(() => {
    allAccounts();
  }, [pageNumber, pageSize]);

  useEffect(() => {
    getPayments();
  }, [policyId]);

  return (
    <>
      <Navbar />

      <div className='container my-5'>
        <div className='row mb-4 justify-content-between align-items-center'>
          <div className='col-md-4'>
            <PaginationApp
              totalpage={totalPages}
              setpage={setPageNumber}
              pageNumber={pageNumber}
            />
          </div>
          <div className='col-md-4 text-center'>
            <input
              className='form-control rounded-pill px-3 text-primary fw-bold'
              placeholder='Search here'
            />
          </div>
          <div className='col-md-4 text-end'>
            <PageSizeSetter
              setPageSize={setPageSize}
              setTotalpage={setTotalPages}
              totalrecord={totalElements}
              pageSize={pageSize}
              setPageNumber={setPageNumber}
            />
          </div>
        </div>

        <div className='row'>
          <div className='col-12 table-responsive'>
            <h2 className='text-center text-bg-dark p-3 rounded'>Customer Policies</h2>
            <table className="table table-bordered table-hover table-striped text-center">
              <thead className="bg-dark text-light">
                <tr>
                  <th>Policy No</th>
                  <th>Status</th>
                  <th>View Payments</th>
                </tr>
              </thead>
              <tbody>
                {account.length > 0 ? (
                  account.map((acc, index) => (
                    <tr key={index}>
                      <td>{acc.policyNo}</td>
                      <td>{acc.Status}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => paymentHandler(acc)}
                        >
                          View Payments
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No Accounts Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {show && (
          <div className='row'>
            <div className='col-12 table-responsive'>
              <h2 className='text-center text-bg-dark p-3 rounded'>Payments</h2>
              <table className="table table-bordered table-hover text-center">
                <thead className="bg-dark text-light">
                  <tr>
                    <th>Payment Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payment.length > 0 ? (
                    payment.map((pay, index) => (
                      <tr key={index}>
                        <td>{pay.paymentDate}</td>
                        <td>{pay.amount}</td>
                        <td>{pay.paymentStatus}</td>
                        <td>
                          {pay.paymentStatus === "UNPAID" && (
                            <button
                              className="btn btn-success"
                              onClick={() => handlePayment(pay.paymentId)}
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No Payments Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {claim && (
          <div className='text-center mt-3'>
            <button className='btn btn-primary btn-lg fw-bold' onClick={getPayments}>
              CLAIM
            </button>
          </div>
        )}

        {account.length === 0 && (
          <div className='text-center text-danger fs-4 mt-4'>No Account Found</div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default ShowAccounts;
