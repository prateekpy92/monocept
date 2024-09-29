import React, { useEffect, useState } from 'react';
import { pendingPolicy, approvePolicy, rejectPolicy, downloadDocument } from '../../services/policy/Policy'; // Import the download API call
import Table from '../shared/table/Table';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';
import PaginationApp from '../shared/page/PaginationApp';
import { successAlet, warningAlert } from '../alerts/Alert';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

function ApprovePolicy() {
  const [data, setData] = useState([]); // Stores all policy data
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Change pageSize as needed
  const [totalPages, setTotalPages] = useState();
  const [totalElements, setTotalElements] = useState();
  const [docs, setDocs] = useState([]); // Stores document data
  const [show, setShow] = useState(false);

  // Fetch policies with pagination
  const getPolicy = async () => {
    try {
      const response = await pendingPolicy(pageNumber, pageSize);
      console.log('Policy data:', response.data);

      // Get the paginated policy data and ensure values are formatted and not null/undefined
      const policyData = response.data.map((policy) => ({
        ...policy,
        premiumAmount: policy.premiumAmount ? policy.premiumAmount.toFixed(2) : '0.00', // Format premiumAmount
        profitAmount: policy.profitAmount ? policy.profitAmount.toFixed(2) : '0.00', // Format profitAmount
        maturityDate: policy.maturityDate || 'N/A', // Handle missing maturityDate
      }));

      setData(Array.isArray(policyData) ? policyData : []);
      setTotalPages(Math.ceil(parseInt(response.headers['policy-count']) / pageSize));
      setTotalElements(parseInt(response.headers['policy-count']));
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  // Approve policy handler
  const approveHandler = async (detail) => {
    try {
      const policyId = detail.policyId;
      await approvePolicy(policyId);
      successAlet('Policy Approved!');
      setTimeout(getPolicy, 2000); // Wait for 2 seconds before refreshing the data
    } catch (error) {
      warningAlert(error.response?.data?.msg || 'Error approving policy.');
    }
  };

  // Reject policy handler
  const rejectHandler = async (detail) => {
    try {
      const policyId = detail.policyId;
      await rejectPolicy(policyId);
      successAlet('Policy Rejected!');
      getPolicy(); // Refresh data after rejection
    } catch (error) {
      warningAlert(error.response?.data?.msg || 'Error rejecting policy.');
    }
  };

  // Handle document data for displaying in a table
  const documentHandler = (detail) => {
    if (Array.isArray(detail.documents)) {
      const val = detail.documents.map((doc) => ({
        id: doc.documentId,
        DocumentName: doc.documentName,
        Status: doc.documentStatus,
        image: doc.documentImage,
      }));
      setDocs(val);
      setShow(true);
    } else {
      setDocs([]);
      setShow(false);
    }
  };

  // Download document handler
  const downloadDocumentHandler = async (documentId) => {
    try {
      const response = await downloadDocument(documentId); // Make API call
  
      // Get content type from headers (e.g., image/jpeg or image/png)
      const contentType = response.headers['content-type'] || 'image/jpeg'; // Default to JPEG if undefined
  
      // Create a blob using the correct content type
      const blob = new Blob([response.data], { type: contentType });
  
      const url = window.URL.createObjectURL(blob); // Create a URL for the blob
      const extension = contentType.split('/')[1]; // Extract file extension (e.g., jpeg or png)
      const link = document.createElement('a'); // Create an anchor tag
  
      link.href = url;
      link.setAttribute('download', `document_${documentId}.${extension}`); // Set file name with extension
      document.body.appendChild(link); // Append the link to the body
      link.click(); // Simulate click to download
      link.remove(); // Clean up by removing the link element
  
    } catch (error) {
      console.error('Error downloading document:', error);
      warningAlert('Error downloading document.');
    }
  };
  
  
  // Fetch policies on component mount and when pagination changes
  useEffect(() => {
    getPolicy();
  }, [pageNumber, pageSize]);

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12">
            <h1 className="text-center bg-dark text-white py-3 mb-4">Pending Policies</h1>
            <div className="table-responsive">
              <Table
                data={data} // Data now contains paginated policy information
                isDoc={true}
                isAproov={true}
                isReject={true}
                docFun={documentHandler}
                aproovFun={approveHandler}
                rejectFun={rejectHandler}
              />
            </div>
          </div>
        </div>

        {show && (
          <div className="row justify-content-center mt-4">
            <div className="col-12">
              <h2 className="text-center bg-dark text-white py-2">Documents</h2>
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">DOCUMENT ID</th>
                    <th scope="col">DOCUMENT NAME</th>
                    <th scope="col">STATUS</th>
                    <th scope="col">IMAGE</th>
                    <th scope="col">ACTION</th> {/* New Action column for download */}
                  </tr>
                </thead>
                <tbody>
                  {docs.length > 0 ? (
                    docs.map((value, ind) => (
                      <tr key={ind}>
                        <td>{value.id}</td>
                        <td>{value.DocumentName}</td>
                        <td>{value.Status}</td>
                        <td>
                          <img
                            src={`http://localhost:8081/insuranceapp/documents/${value.id}/download`}
                            alt="Document"
                            className="img-fluid shadow-lg"
                            style={{ height: '150px', width: '150px' }}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => downloadDocumentHandler(value.id)}
                          >
                            Download
                          </button>
                        </td> {/* Button to trigger download */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No documents available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="row justify-content-center my-4">
          <div className="col-auto">
            <PaginationApp
              totalpage={totalPages}
              setpage={setPageNumber}
              pageNumber={pageNumber}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ApprovePolicy;
