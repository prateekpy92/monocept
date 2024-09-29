import React, { useEffect, useState } from 'react';
import { getAgentPolicies } from '../../services/agent/Agent'; 
import PaginationApp from '../shared/page/PaginationApp';
import PageSizeSetter from '../shared/page/PageSizeSetter';
import Table from '../shared/table/Table';
import Payments from '../customer/Payments';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';

function AgentAccounts() {
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

    const fetchPolicies = async () => {
        try {
            let agentId = localStorage.getItem('agentId');
            
            if (!agentId) {
                console.log("Agent ID not found in localStorage. Fetching from API...");
                const agentResponse = await getAgentPolicies(pageNumber, pageSize, 'agent3');
                
                if (agentResponse.data && agentResponse.data.id) {
                    agentId = agentResponse.data.id;
                    localStorage.setItem('agentId', agentId);
                } else {
                    console.error("Failed to fetch agent ID from API");
                    return;
                }
            }

            const response = await getAgentPolicies(pageNumber, pageSize, agentId);
            
            if (response.data) {
                setData(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalElements(response.data.totalElements || 0);
                
                const transformedData = response.data.content.map(element => ({
                    policyNo: element.policyNo,
                    Username: element.username,
                    SchemeName: element.insuranceScheme,
                    Status: element.status
                }));
                setAccount(transformedData);
            } else {
                console.error("Unexpected API response structure:", response);
            }
        } catch (error) {
            console.error("Error fetching agent policies:", error.response ? error.response.data : error.message);
        }
    };

    const handleDocument = (detail) => {
        const selectedPolicy = data.find(x => x.policyNo === detail.policyNo);
        if (selectedPolicy) {
            const docsData = selectedPolicy.submittedDocuments.map(doc => ({
                id: doc.documentId,
                DocumentName: doc.documentName,
                Status: doc.documentStatus,
                image: doc.documentImage
            }));
            setDocs(true);
            setNominee(false);
            setDetail([]);
            setDocShow(docsData);
            setShow(false);
        }
    };

    const handleDetail = (detail) => {
        const selectedPolicy = data.find(x => x.policyNo === detail.policyNo);
        if (selectedPolicy) {
            const policyDetail = [{
                SumAssured: selectedPolicy.sumAssured,
                IssueDate: selectedPolicy.issueDate.substring(0, 10),
                MaturityDate: selectedPolicy.maturityDate.substring(0, 10),
                Premium: selectedPolicy.premiumAmount,
                PremiumType: selectedPolicy.premiumType
            }];
            setDetail(policyDetail);
            setDocs(false);
            setNominee(false);
            setAction([]);
            setShow(false);
        }
    };

    const handleNominee = (detail) => {
        const selectedPolicy = data.find(x => x.policyNo === detail.policyNo);
        if (selectedPolicy) {
            setNominee(true);
            setAction(selectedPolicy.nominees);
            setDetail([]);
            setDocs(false);
            setShow(false);
        }
    };

    const handlePayment = (detail) => {
        const selectedPolicy = data.find(x => x.policyNo === detail.policyNo);
        if (selectedPolicy) {
            const paymentsData = selectedPolicy.payments.map(p => ({
                ...p,
                paymentDate: p.paymentDate.substring(0, 10)
            }));
            setPayment(paymentsData);
            setShow(true);
            setAction([]);
            setDetail([]);
            setDocs(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, [pageNumber, pageSize]);

    return (
        <>
            <Navbar />
            <div className='container'>
                <div className='row my-5 justify-content-center'>
                    <div className='col-md-2'>
                        <PaginationApp
                            totalPages={totalPages}
                            setPageNumber={setPageNumber}
                            pageNumber={pageNumber}
                        />
                    </div>
                    <div className='col-md-4'>
                        <input className='form-control rounded-pill px-3 text-primary fw-bold text-center' placeholder='Search by Policy No' />
                    </div>
                    <div className='col-md-2'>
                        <PageSizeSetter
                            setPageSize={setPageSize}
                            setTotalPages={setTotalPages}
                            totalRecords={totalElements}
                            pageSize={pageSize}
                            setPageNumber={setPageNumber}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <div className='card shadow-sm'>
                            <div className='card-header bg-dark text-white text-center h3'>
                                Agent Accounts
                            </div>
                            <div className='card-body table-responsive'>
                                <Table
                                    data={account}
                                    isDoc={true}
                                    isPayment={true}
                                    showMoreButton={true}
                                    isNominee={true}
                                    docFun={handleDocument}
                                    paymentFun={handlePayment}
                                    detailFun={handleDetail}
                                    nomineeFun={handleNominee}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {detail.length > 0 && (
                    <div className='row my-4'>
                        <div className='col-12'>
                            <div className='card shadow-sm'>
                                <div className='card-header bg-dark text-white text-center h3'>
                                    Account Details
                                </div>
                                <div className='card-body'>
                                    <Table data={detail} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {action.length > 0 && (
                    <div className='row my-4'>
                        <div className='col-12'>
                            <div className='card shadow-sm'>
                                <div className='card-header bg-dark text-white text-center h3'>
                                    Nominees
                                </div>
                                <div className='card-body'>
                                    <Table data={action} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {docShow.length > 0 && (
                    <div className="row my-4">
                        <div className='col-12'>
                            <div className='card shadow-sm'>
                                <div className='card-header bg-dark text-white text-center h3'>
                                    Documents
                                </div>
                                <div className='card-body table-responsive'>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>DOCUMENT ID</th>
                                                <th>DOCUMENT NAME</th>
                                                <th>STATUS</th>
                                                <th>IMAGE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {docShow.map((value, index) => (
                                                <tr key={index}>
                                                    <td>{value.id}</td>
                                                    <td>{value.DocumentName}</td>
                                                    <td>{value.Status}</td>
                                                    <td>
                                                        <img
                                                            src={`http://localhost:8081/insuranceapp/download?file=${value.image}`}
                                                            alt={value.DocumentName}
                                                            className='img-fluid'
                                                            style={{ height: "15rem", width: "15rem" }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {show && (
                    <div className='row my-4'>
                        <div className='col-12'>
                            <div className='card shadow-sm'>
                                <div className='card-header bg-dark text-white text-center h3'>
                                    Payments
                                </div>
                                <div className='card-body'>
                                    <Payments data={payment} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {account.length === 0 && (
                    <div className='row'>
                        <div className='col-12'>
                            <div className='text-center text-danger fw-bold h2'>
                                No Customer Found
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />

            <style jsx="true">{`
                .card {
                    border-radius: 15px;
                    overflow: hidden;
                }

                .card-header {
                    border-bottom: 2px solid #fff;
                }

                .form-control {
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .table-responsive {
                    margin-top: 20px;
                }

                .h3 {
                    font-size: 1.75rem;
                }

                .h1 {
                    font-size: 2rem;
                }

                .img-fluid {
                    max-height: 100px;
                    object-fit: cover;
                }
            `}</style>
        </>
    );
}

export default AgentAccounts;
