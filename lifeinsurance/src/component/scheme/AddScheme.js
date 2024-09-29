import React, { useEffect, useState } from 'react';
import { successAlet, warningAlert } from '../alerts/Alert';
import { allPlans } from '../../services/admin/AdminServices';
import { addScheme } from '../../services/scheme/SchemeService'; // Updated function
import { minAmountRegex } from '../../validation/Validation';
import { errorMaxAge, errorMaxAmount, errorMaxTime, errorMinAge, errorMinAmount, errorMinTime } from '../../validation/ErrorMessage';

const AddScheme = () => {
    const [planId, setPlanId] = useState();
    const [schemeName, setSchemeName] = useState();
    const [schemeImage, setSchemeImage] = useState(null); // Use null as the initial value
    const [schemeDescription, setSchemeDescription] = useState();
    const [minAmount, setMinAmount] = useState();
    const [maxAmount, setMaxAmount] = useState();
    const [minInvestMentTime, setMinInvestMentTime] = useState();
    const [maxInvestMentTime, setMaxInvestMentTime] = useState();
    const [minAge, setMinAge] = useState();
    const [maxAge, setMaxAge] = useState();
    const [profit, setProfit] = useState();
    const [regCommition, setRegCommition] = useState();
    const [installmentCommission, setInstallMentCommission] = useState();
    const [documents, setDocuments] = useState([]); // This will hold selected documents
    const [plans, setPlans] = useState([]);
    const [msg, setMsg] = useState('');

    // Fetch available plans
    const getPlanData = async () => {
        let response = await allPlans(0, 30);
        setPlans(response.data.content);
    };

    // Handle checkbox change for documents (enum values)
    const handleCheckboxChange = (e, documentType) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setDocuments((prevDocuments) => [...prevDocuments, documentType]);
        } else {
            setDocuments((prevDocuments) =>
                prevDocuments.filter((doc) => doc !== documentType)
            );
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          

            // Create a schemeData object
            const schemeData = {
                planId,
                schemeName,
                description: schemeDescription,
                minAmount,
                maxAmount,
                minInvestmentTime: minInvestMentTime,
                maxInvestmentTime: maxInvestMentTime,
                minAge,
                maxAge,
                profitRatio: profit,
                registrationCommRatio: regCommition,
                installmentCommRatio: installmentCommission,
                documents // The selected documents array
            };

            // Add schemeData as a JSON string to formData
            // formData.append('schemeData', new Blob([JSON.stringify(schemeData)], { type: 'application/json' }));

            // Append image only if available
            // if (schemeImage) {
            //     formData.append('schemeImage', schemeImage);
            // }

            // Call service function to submit formData
            const response = await addScheme(schemeData);
            console.log('response of add scheme---', response);

            if (response) {
                successAlet('Scheme successfully uploaded');
            }
        } catch (error) {
            console.error('Error while uploading scheme:', error);
            warningAlert('Some error occurred');
        }
    };

    useEffect(() => {
        getPlanData();
    }, []);

    // Validation effects
    useEffect(() => {
        if (minAmount && maxAmount && parseInt(minAmount) >= parseInt(maxAmount)) {
            setMsg(errorMaxAmount);
        } else {
            setMsg('');
        }
    }, [minAmount, maxAmount]);

    useEffect(() => {
        if (minInvestMentTime && maxInvestMentTime && parseInt(minInvestMentTime) >= parseInt(maxInvestMentTime)) {
            setMsg(errorMaxTime);
        } else {
            setMsg('');
        }
    }, [minInvestMentTime, maxInvestMentTime]);

    useEffect(() => {
        if (minAge && maxAge && parseInt(minAge) >= parseInt(maxAge)) {
            setMsg(errorMaxAge);
        } else {
            setMsg('');
        }
    }, [minAge, maxAge]);

    return (
        <div className='offset-2 col-8 mt-5'>
            <form>
                <div className='fs-2 fw-bold text-dark'>Plan Details</div>
                <div className='row align-items-center'>
                    <div className="col-3">
                        <select className="form-select py-3" aria-label="Default select example"
                            onChange={(e) => setPlanId(e.target.value)}
                        >
                            <option selected>Select plan</option>
                            {plans.map((plan) => (
                                <option value={plan.planId} key={plan.planId}>
                                    {plan.planName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <div className='col-3'>
                        <div className="mb-3 d-flex">
                            <input className="form-control py-3" type="file"
                                onChange={(e) => setSchemeImage(e.target.files[0])}
                            />
                        </div>
                    </div> */}
                    <div className="col-5">
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control"
                                value={schemeName}
                                onChange={(e) => setSchemeName(e.target.value)}
                            />
                            <label htmlFor="schemeName">Scheme Name</label>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col'>
                        <div className="form-floating mb-3">
                            <textarea className="form-control" style={{ height: "5rem" }}
                                value={schemeDescription}
                                onChange={(e) => setSchemeDescription(e.target.value)}
                            />
                            <label htmlFor="schemeDescription">Scheme Description</label>
                        </div>
                    </div>
                </div>

                {/* Scheme Details Section */}
                <div className='fs-2 fw-bold text-dark'>Scheme Details</div>
                <div className="text-danger text-center fw-bold">{msg}</div>
                <div className='row'>
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                            />
                            <label htmlFor="minAmount">Min Amount</label>
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                            />
                            <label htmlFor="maxAmount">Max Amount</label>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control"
                                value={minInvestMentTime}
                                onChange={(e) => setMinInvestMentTime(e.target.value)}
                            />
                            <label htmlFor="minInvestmentTime">Min Investment Time (years)</label>
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control"
                                value={maxInvestMentTime}
                                onChange={(e) => setMaxInvestMentTime(e.target.value)}
                            />
                            <label htmlFor="maxInvestmentTime">Max Investment Time (years)</label>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control"
                                value={minAge}
                                onChange={(e) => setMinAge(e.target.value)}
                            />
                            <label htmlFor="minAge">Min Age</label>
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control"
                                value={maxAge}
                                onChange={(e) => setMaxAge(e.target.value)}
                            />
                            <label htmlFor="maxAge">Max Age</label>
                        </div>
                    </div>
                </div>

                {/* Required Documents Section */}
                <div className='fs-2 fw-bold text-dark'>Required Documents</div>
                <div className='row'>
                    <div className="col">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                value="AADHAR_CARD"
                                checked={documents.includes("AADHAR_CARD")}
                                onChange={(e) => handleCheckboxChange(e, "AADHAR_CARD")}
                            />
                            <label className="form-check-label" htmlFor="AADHAR_CARD">AADHAR CARD</label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                value="PAN_CARD"
                                checked={documents.includes("PAN_CARD")}
                                onChange={(e) => handleCheckboxChange(e, "PAN_CARD")}
                            />
                            <label className="form-check-label" htmlFor="PAN_CARD">PAN CARD</label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                value="INCOME_CERTIFICATE"
                                checked={documents.includes("INCOME_CERTIFICATE")}
                                onChange={(e) => handleCheckboxChange(e, "INCOME_CERTIFICATE")}
                            />
                            <label className="form-check-label" htmlFor="INCOME_CERTIFICATE">INCOME CERTIFICATE</label>
                        </div>
                    </div>
                </div>

                {/* Agent Details Section */}
                <div className='fs-2 fw-bold text-dark'>Agent Details</div>
                <div className='row'>
                    <div className="col">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control"
                                value={profit}
                                onChange={(e) => setProfit(e.target.value)}
                            />
                            <label htmlFor="profit">Profit Percentage</label>
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control"
                                value={regCommition}
                                onChange={(e) => setRegCommition(e.target.value)}
                            />
                            <label htmlFor="regCommition">Registration Commission</label>
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control"
                                value={installmentCommission}
                                onChange={(e) => setInstallMentCommission(e.target.value)}
                            />
                            <label htmlFor="installmentCommission">Installment Commission</label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-outline-success btn-lg" onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    );
};

export default AddScheme;
