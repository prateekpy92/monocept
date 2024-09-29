import React, { useEffect, useState } from 'react';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';
import { getAgentDetail } from '../../services/agent/Agent';
import { warningAlert } from '../alerts/Alert';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function AgentCommission() {
    const [commissions, setCommissions] = useState([]);
    const [earning, setEarning] = useState(0);
    const [claim, setClaim] = useState(0);
    const [claims, setClaims] = useState([]);
    const [agentId, setAgentId] = useState('');

    const [responseData, setResponseData] = useState(null);

    const totalCommissionAmount = commissions.reduce((total, commission) => total + commission.amount, 0);

    const getAgentData = async () => {
        try {
            const response = await getAgentDetail();
            console.log(response);
            if (response && response.data) {
                setCommissions(response.data.commissions || []);
                setEarning(response.data.commission || 0);
                setClaims(response.data.claims || []);
                setAgentId(response.data.agentId || '');

                let totalClaim = 0;
                for (const c of (response.data.claims || [])) {
                    if (c.claimStatus === "APPROVED") {
                        totalClaim += c.claimAmount;
                    }
                }
                setClaim(totalClaim);
            } else {
                throw new Error("Unexpected response structure");
            }
        } catch (error) {
            warningAlert(error.response ? error.response.data.message : "An error occurred while fetching agent data.");
        }
    };

    useEffect(() => {
        getAgentData();
    }, [responseData]);

    // Function to generate PDF for commissions
    const generatePDF = () => {
        const doc = new jsPDF();

        doc.text("Agent Commission Report", 14, 10);
        doc.autoTable({
            head: [['Commission ID', 'Commission Type', 'Issue Date', 'Amount']],
            body: commissions.map((commission) => [
                commission.commissionId,
                commission.commissionType,
                commission.issueDate?.substring(0, 10),
                commission.amount.toFixed(2),
            ]),
        });

        doc.save(`Agent_Commission_Report_${new Date().toLocaleDateString()}.pdf`);
    };

    return (
        <div className='bg'>
            <Navbar />
            <div className='background2 text-center bg-dark display-3 py-3 text-white fw-bold'>Agent Commission</div>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6'>
                        <div className='text-danger fw-bold fs-4 my-5'>
                            Total Amount: {totalCommissionAmount.toFixed(2)}
                        </div>
                    </div>
                    <div className='col-md-6 text-end'>
                        <button className='fw-bold px-3 btn btn-lg btn-primary mx-2' onClick={generatePDF}>
                            Download PDF
                        </button>
                    </div>
                </div>
                <div>
                    <div className='text-center text-white bg-dark mb-5 fw-bold fs-3 my-5'>
                        COMMISSIONS
                    </div>
                    <table className="table table-bordered mb-5 table-info">
                        <thead>
                            <tr>
                                <th scope="col">COMMISSION ID</th>
                                <th scope="col">COMMISSION TYPE</th>
                                <th scope="col">ISSUE DATE</th>
                                <th scope="col">AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commissions.map(commission => (
                                <tr key={commission.commissionId}>
                                    <th scope="row">{commission.commissionId}</th>
                                    <td>{commission.commissionType}</td>
                                    <td>{commission.issueDate?.substring(0, 10)}</td>
                                    <td>{commission.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {claims.length > 0 && (
                        <>
                            <div className='text-center text-white my-5 bg-dark fw-bold fs-3 mt-5'>
                                CLAIMS
                            </div>
                            <table className="table table-info table-bordered mt-5">
                                <thead>
                                    <tr>
                                        <th scope="col">CLAIM ID</th>
                                        <th scope="col">CLAIM STATUS</th>
                                        <th scope="col">ISSUE DATE</th>
                                        <th scope="col">AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {claims.map(claim => (
                                        <tr key={claim.claimId}>
                                            <th scope="row">{claim.claimId}</th>
                                            <td>{claim.status}</td>
                                            <td>{claim.date?.substring(0, 10)}</td>
                                            <td>{claim.claimAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AgentCommission;
