import React, { useEffect, useState } from 'react';
import { getAllAccounts } from '../../services/policy/Policy';
import PaginationApp from '../shared/page/PaginationApp';
import PageSizeSetter from '../shared/page/PageSizeSetter';
import Table from '../shared/table/Table';
import Payments from '../customer/Payments';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';

function GetPolicies() {
  const [account, setAccount] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [data, setData] = useState([]);
  const [docs, setDocs] = useState(false);
  const [nominee, setNominee] = useState(false);
  const [action, setAction] = useState([]);
  const [show, setShow] = useState(false);
  const [detail, setDetail] = useState([]);
  const [payment, setPayment] = useState([]);
  const [docShow, setDocShow] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const allAccounts = async () => {
    try {
      const response = await getAllAccounts(pageNumber, pageSize);
      setData(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);

      const val = response.data.content
        .map(element => ({
          policyNo: element.policyNo,
          Username: element.username,
          Status: element.status,
        }))
        .filter(item => item !== null);

      setAccount(val);
    } catch (error) {
      console.error('Failed to fetch accounts:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    allAccounts();
  }, [pageNumber, pageSize]);

  const documentHandler = (detail) => {
    const foundDoc = data.find(x => x.policyNo === detail.policyNo);
    if (foundDoc) {
      const docData = Array.isArray(foundDoc.submittedDocuments)
        ? foundDoc.submittedDocuments.map(doc => ({
            id: doc.documentId,
            DocumentName: doc.documentName,
            Status: doc.documentStatus,
            image: doc.documentImage,
          }))
        : [];
      setDocs(true);
      setNominee(false);
      setDetail([]);
      setDocShow(docData);
      setShow(false);
    }
  };

  const detailHandler = (detail) => {
    const foundDetail = data.find(x => x.policyNo === detail.policyNo);
    if (foundDetail) {
      const detailData = [{
        SumAssured: foundDetail.sumAssured.toFixed(2),
        IssueDate: foundDetail.issueDate.substring(0, 10),
        MaturityDate: foundDetail.maturityDate.substring(0, 10),
        Premium: foundDetail.premiumAmount.toFixed(2),
        PremiumType: foundDetail.premiumType
      }];
      setDetail(detailData);
      setDocs(false);
      setNominee(false);
      setAction([]);
      setShow(false);
    }
  };

  const nomineeHandler = (detail) => {
    const foundDetail = data.find(x => x.policyNo === detail.policyNo);
    if (foundDetail) {
      setNominee(true);
      setAction(foundDetail.nominees || []);
      setDetail([]);
      setDocs(false);
      setShow(false);
    }
  };

  const paymentHandler = (detail) => {
    const foundDetail = data.find(x => x.policyNo === detail.policyNo);
    if (foundDetail) {
      const paymentData = (foundDetail.payments || []).map(p => ({
        ...p,
        paymentDate: p.paymentDate ? p.paymentDate.substring(0, 10) : ''
      }));
      setPayment(paymentData);
      setShow(true);
      setAction([]);
      setDetail([]);
      setDocs(false);
    }
  };

  const filteredAccounts = account.filter(acc =>
    acc.policyNo.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row my-5">
          <div className="col-4">
            <input
              className="form-control rounded-pill px-3 fw-bold"
              placeholder="Search by Policy No"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-3 text-end">
            <PageSizeSetter
              setPageSize={setPageSize}
              totalRecord={totalElements}
              pageSize={pageSize}
              setPageNumber={setPageNumber}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h2 className="text-center text-dark mb-4">Customer Accounts</h2>
            <Table
              data={filteredAccounts}
              isDoc={true}
              isPayment={false}
              showMoreButton={true}
              isNominee={true}
              docFun={documentHandler}
              paymentFun={paymentHandler}
              detailFun={detailHandler}
              nomineeFun={nomineeHandler}
            />
          </div>
        </div>

        {detail.length > 0 && (
          <div className="row my-5">
            <div className="col-12">
              <h3 className="text-center text-dark mb-4">Account Details</h3>
              <Table data={detail} />
            </div>
          </div>
        )}

        {action.length > 0 && (
          <div className="row my-5">
            <div className="col-12">
              {nominee && <h3 className="text-center text-dark mb-4">Nominees</h3>}
              <Table data={action} />
            </div>
          </div>
        )}

        {docShow.length > 0 && (
          <div className="row my-5">
            <div className="col-12">
              <h3 className="text-center text-dark mb-4">Documents</h3>
              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Document ID</th>
                    <th>Document Name</th>
                    <th>Status</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {docShow.map((value) => (
                    <tr key={value.id}>
                      <td>{value.id}</td>
                      <td>{value.DocumentName}</td>
                      <td>{value.Status}</td>
                      <td>
                        <img
                          src={`data:image/png;base64,${value.image}`}
                          alt="document"
                          className="img-fluid"
                          style={{ height: '150px', width: '150px' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {show && (
          <div className="row my-5">
            <div className="col-12">
              <h3 className="text-center text-dark mb-4">Payments</h3>
              <Payments data={payment} />
            </div>
          </div>
        )}

        {account.length === 0 && (
          <div className="text-center text-danger fw-bold fs-2 mt-5">No Customer Found</div>
        )}

        <div className="row mt-5">
          <div className="col-12 d-flex justify-content-center">
            <PaginationApp
              totalPage={totalPages}
              setPageNumber={setPageNumber}
              pageNumber={pageNumber}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default GetPolicies;
