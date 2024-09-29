import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { successAlet, warningAlert } from '../alerts/Alert';
import { GetAllAgent } from '../../services/agent/Agent';
import { addImage } from '../../services/files/File';
import { addPolicy } from '../../services/policy/Policy';

const SchemeView = (data) => {
    data = data.data;
    console.log("required scheme data", data);
    console.log(data.requierdDocs);
    let requierdDocs = data.requierdDocs == null ? [] : data.requierdDocs;

    const [value, setValue] = useState(false);
    const [clickCalculate, setClickCalculate] = useState(false);
    const [duration, setDuration] = useState();
    const [investMent, setinvestment] = useState();
    const [preimumType, setPremiumType] = useState();
    const [premiumAmount, setPreimumAmount] = useState();
    const [profitAmount, setProfitAmount] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const [profitRatio, setProfitRatio] = useState(data.profitRatio);
    const [totalPremum, setTotalPremiums] = useState();
    const [buy, setBuy] = useState(false);
    const [nominee, setNominee] = useState();
    const [nomineeName, setNomineeName] = useState("");
    const [nomineeRelation, setNomineeRelation] = useState("");
    const [documentImage, setDocumentImage] = useState({});
    const [agents, setAgents] = useState([]);
    const [agentId, setAgentId] = useState(0);
    const [policyDocuments, setPolicyDocuments] = useState([]);
    const schemeId = data.schemeId;
    const [policyId, setPolicyId] = useState(0);
    let nomineeList = [];

    for (let i = 0; i < nominee; i++) {
        nomineeList.push(i);
    }

    const [valid, setValid] = useState(false);
    const navigate = useNavigate();

    const validateUser = () => {
        if (localStorage.getItem('auth') == null || localStorage.getItem('Role') == null || localStorage.getItem('Role') !== 'ROLE_CUSTOMER') {
            warningAlert("You are not logged in");
            localStorage.clear();
            navigate('/login');
        }
        setValid(true);
    };

    const calculateHandler = () => {
        if (investMent < data.minAmount || investMent > data.maxAmount) {
            warningAlert(`Investment must be between ${data.minAmount} and ${data.maxAmount}.`);
            return;
        }
        if (duration < data.minDuration || duration > data.maxDuration) {
            warningAlert(`Number of years must be between ${data.minDuration} and ${data.maxDuration}.`);
            return;
        }

        let totalInvestMent = investMent;
        let profit = (totalInvestMent * profitRatio) / 100;
        let premium = totalInvestMent / (preimumType * duration);

        setTotalPremiums((totalInvestMent / premium).toFixed(2));
        setPreimumAmount(premium.toFixed(2));
        setProfitAmount(profit.toFixed(2));
        setTotalAmount((Number(profit) + Number(totalInvestMent)).toFixed(2));
    };

    const getAgentsData = async () => {
        let response = await GetAllAgent(0, 30);
        setAgents(response.data.content);
        console.log(response);
    };

    const buyHandler = () => {
        validateUser();
        if (valid) {
            setBuy(true);
            getAgentsData();
        }
    };

    // Updated handleFileChange to rename the file according to the document name
    const handleFileChange = (e, doc) => {
        const file = e.target.files[0];
        const renamedFile = new File([file], `${doc}_${file.name}`, { type: file.type });
        setDocumentImage((prevDocuments) => ({
            ...prevDocuments,
            [doc]: renamedFile
        }));
    };

    const uploadHandler = async (doc) => {
        if (!documentImage[doc]) {
            warningAlert(`Please select a document for ${doc}.`);
            return;
        }

        const formData = new FormData();
        formData.append("file", documentImage[doc]);

        try {
            let response = await addImage(formData, policyId); // Upload document
            policyDocuments.push({
                documentName: doc,
                documentImage: response.data
            });
        } catch (error) {
            warningAlert(`Image for ${doc} not uploaded`);
        }
    };

    const handleSubmit = async () => {
        try {
            let response = await addPolicy(policyData); // Create the policy first
            console.log(response);
            setPolicyId(response.data); // Set policyId after policy is created

            if (response) {
                successAlet("Policy successfully submitted");

                // Upload each document sequentially after policy creation
                for (let doc of requierdDocs) {
                    await uploadHandler(doc); // Call uploadHandler for each document
                }
            }
        } catch (error) {
            warningAlert("Some error occurred during policy creation or document upload.");
        }
    };

    nomineeList.push({
        nomineeName: nomineeName,
        nomineeRelation: nomineeRelation
    });

    const policyData = {
        schemeId,
        agentId,
        username: localStorage.getItem('username'),
        duration,
        premiumType: preimumType,
        investMent,
        nominees: nomineeList,
    };

    return (
        <div className='my-5'>
            <div className='offset-1 p-2 col-10 text-center fs-2 bg-warning mb-5'>
                {data.schemeName}
            </div>

            <div className='container'>
                <div className='row align-items-center justify-content-center'>
                    <div className='col-6'>
                        <div className='p-5'>{data.description}</div>
                    </div>

                    <div className='col-12 text-center shadow-lg mt-5'>
                        <div className='row mt-5'>
                            <div className='col'>
                                <div className='form-floating mb-3'>
                                    <input type="text" className='form-control' id="floatingInput" value={data.minAge} readOnly />
                                    <label htmlFor="floatingInput">Minimum Age</label>
                                </div>
                            </div>
                            <div className='col'>
                                <div className='form-floating mb-3'>
                                    <input type="text" className='form-control' id="floatingInput" value={data.maxAge} readOnly />
                                    <label htmlFor="floatingInput">Maximum Age</label>
                                </div>
                            </div>
                        </div>

                        <div className='row mt-2'>
                            <div className='col'>
                                <div className='form-floating mb-3'>
                                    <input type="text" className='form-control' id="floatingInput" value={data.minAmount} readOnly />
                                    <label htmlFor="floatingInput">Minimum Investment</label>
                                </div>
                            </div>
                            <div className='col'>
                                <div className='form-floating mb-3'>
                                    <input type="text" className='form-control' id="floatingInput" value={data.maxAmount} readOnly />
                                    <label htmlFor="floatingInput">Maximum Investment</label>
                                </div>
                            </div>
                        </div>

                        <div className='row mt-2'>
                            <div className='col'>
                                <div className='form-floating mb-3'>
                                    <input type="text" className='form-control' id="floatingInput" value={data.minDuration} readOnly />
                                    <label htmlFor="floatingInput">Minimum Duration</label>
                                </div>
                            </div>
                            <div className='col'>
                                <div className='form-floating mb-3'>
                                    <input type="text" className='form-control' id="floatingInput" value={data.maxDuration} readOnly />
                                    <label htmlFor="floatingInput">Maximum Duration</label>
                                </div>
                            </div>

                            <div className='col'>
                                <div className='form-floating mb-3'>
                                    <input type="text" className='form-control' id="floatingInput" value={profitRatio} readOnly />
                                    <label htmlFor="floatingInput">Profit Ratio</label>
                                </div>
                            </div>
                        </div>

                        <button className='btn btn-primary btn-lg fw-bold mb-5' onClick={() => setValue(true)}>
                            Check This Policy
                        </button>
                    </div>

                    {value && (
                        <div className='col-12 text-center shadow-lg mt-5'>
                            <div className='row mt-5'>
                                <div className='col'>
                                    <div className='form-floating mb-3'>
                                        <input type="number" className='form-control' id="floatingInput" value={duration || ''} min={data.minDuration} max={data.maxDuration}
                                            onChange={(e) => setDuration(e.target.value)} />
                                        <label htmlFor="floatingInput">Number of Years</label>
                                    </div>
                                </div>
                            </div>

                            <div className='row mt-2'>
                                <div className='col-12 bg1'>
                                    <div className='form-floating mb-3'>
                                        <input type="number" className='form-control' id="floatingInput" value={investMent || ''} min={data.minAmount} max={data.maxAmount}
                                            onChange={(e) => setinvestment(e.target.value)} />
                                        <label htmlFor="floatingInput">Total Investment</label>
                                    </div>
                                </div>
                            </div>

                            <div className='row mt-2'>
                                <div className='col'>
                                    <select className='form-select py-3' aria-label="Premium Type" onChange={(e) => setPremiumType(e.target.value)}>
                                        <option value="" disabled selected>Premium Type</option>
                                        <option value="12">Monthly</option>
                                        <option value="4">Quarterly</option>
                                        <option value="2">Half Yearly</option>
                                        <option value="1">Yearly</option>
                                    </select>
                                </div>
                            </div>

                            <button className='btn btn-primary btn-lg fw-bold my-3' onClick={() => { setClickCalculate(true); calculateHandler(); }}>
                                Calculate Premium
                            </button>
                        </div>
                    )}

                    {clickCalculate && (
                        <div className='col-12 text-center shadow-lg mt-5 py-4'>
                            <div className='col'>
                                <div className='form-floating mb-3'>
                                    <input type="text" className='form-control' id="floatingInput" value={premiumAmount || ''} readOnly />
                                    <label htmlFor="floatingInput">Installment Amount</label>
                                </div>
                            </div>

                            <div className='col'>
                                <div className='form-floating mb-3'>
                                    <input type="text" className='form-control' id="floatingInput" value={profitAmount || ''} readOnly />
                                    <label htmlFor="floatingInput">Profit Amount</label>
                                </div>
                            </div>

                            <div className='col'>
                                <div className='form-floating mb-3'>
                                    <input type="text" className='form-control' id="floatingInput" value={totalAmount || ''} readOnly />
                                    <label htmlFor="floatingInput">Total Amount</label>
                                </div>
                            </div>

                            <button className='btn btn-primary btn-lg fw-bold my-3' onClick={buyHandler}>
                                Buy Policy
                            </button>
                        </div>
                    )}

                    {buy && (
                        <div className='container'>
                            <div className='row justify-content-center'>
                                <div className='col-12 p-3 shadow-lg mt-4'>
                                    <div className='row mt-2'>
                                        <div className='col'>
                                            <div className='form-floating mb-3'>
                                                <input type="number" className='form-control' id="floatingInput" value={totalPremum || ''} readOnly />
                                                <label htmlFor="floatingInput">Total Premiums</label>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className='form mb-3 align-items-center'>
                                                <select className='form-select py-3' aria-label="Need Agent" onChange={(e) => setAgentId(e.target.value)}>
                                                    <option selected>Need Agent</option>
                                                    <option value={0}>No! Self</option>
                                                    {agents.map((agent) => (
                                                        <option key={agent.id} value={agent.id}>
                                                            {agent.firstName + " " + agent.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className='form-floating mb-3'>
                                                <input type="number" className='form-control' id="floatingInput" value={1} onChange={(e) => setNominee(e.target.value)} />
                                                <label htmlFor="floatingInput">Number of Nominees</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row mt-2'>
                                        <div className='col'>
                                            <div className='form-floating mb-3'>
                                                <input type="text" className='form-control' id="floatingInput" value={nomineeName} onChange={(e) => setNomineeName(e.target.value)} />
                                                <label htmlFor="floatingInput">Nominee Name</label>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className='form mb-3 align-items-center'>
                                                <select className='form-select py-3' aria-label="Relation" onChange={(e) => setNomineeRelation(e.target.value)}>
                                                    <option selected>Relation</option>
                                                    <option value="BROTHER">Brother</option>
                                                    <option value="SISTER">Sister</option>
                                                    <option value="MOTHER">Mother</option>
                                                    <option value="FATHER">Father</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {requierdDocs.map((doc) => (
                                        <div key={doc} className='row mt-2'>
                                            <div className='col'>
                                                <div className='form-floating mb-3'>
                                                    <input type="text" className='form-control' id="floatingInput" value={doc} readOnly />
                                                    <label htmlFor="floatingInput">Document Name</label>
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className='mb-3 d-flex'>
                                                    <input className='form-control py-3' type="file" id="formFile" onChange={(e) => handleFileChange(e, doc)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className='text-center'>
                                        <button className='btn btn-lg btn-primary fw-bold' onClick={handleSubmit}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchemeView;
