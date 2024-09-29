import React, { useEffect, useState } from 'react';
import { addPlan, allPlans, deletePlan, updatePlan } from '../../services/admin/AdminServices';
import Navbar from '../shared/navbar/Navbar';
import Footer from '../shared/footer/Footer';
import Table from '../shared/table/Table';
import PaginationApp from '../shared/page/PaginationApp';
import PageSizeSetter from '../shared/page/PageSizeSetter';
import AddPlan from '../admin/AddPlan';
import EditPlan from './EditPlan';

const AllPlans = () => {
    let data = {};
    let editData = {};

    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(2);
    const [totalPages, setTotalPages] = useState();
    const [totalElements, setTotalElements] = useState();
    const [planName, setPlanName] = useState("");
    const [actionData, setActionData] = useState([]);
    const [editShow, setEditShow] = useState(false);
    const [planId, setPlanId] = useState();
    const [show, setShow] = useState(false);
    const [plansData, setPlansData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const getPlansData = async () => {
        try {
            let response = await allPlans(pageNumber, pageSize);
            setPlansData(response.data.content);
            setTotalPages(Math.ceil(parseInt(response.headers['plans-count']) / pageSize));
            setTotalElements(parseInt(response.headers['plans-count']));
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const addPlanHandler = async () => {
        let datas = { planName };
        try {
            let response = await addPlan(datas);
            setActionData(response);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const updatePlanHandler = async () => {
        try {
            let response = await updatePlan(planId, planName);
            setActionData(response);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    data = {
        show, setShow,
        planName, setPlanName,
        addPlanHandler
    };

    const handleUpdate = (plan) => {
        setPlanName(plan.planName);
        setPlanId(plan.planId);
        setEditShow(true);
    };

    editData = {
        planName,
        setPlanName,
        editShow,
        setEditShow,
        updatePlanHandler
    };

    const handleDelete = async (plan) => {
        try {
            const updatedStatus = !plan.isActive; 
            let response = await deletePlan(plan.planId, { ...plan, isActive: updatedStatus });
            setActionData(response);
            setPageNumber(0);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const filteredPlans = plansData.filter(plan => 
        plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.planId.toString().includes(searchTerm)
    );

    useEffect(() => {
        getPlansData();
    }, [pageNumber, pageSize, actionData]);

    return (
        <>
            <Navbar />
            <AddPlan data={data} />
            <EditPlan data={editData} />
            <div className='container uniform-layout'>
                <div className='row align-items-center mb-4'>
                    <div className='col-md-4'>
                        <PaginationApp
                            totalpage={totalPages}
                            setpage={setPageNumber}
                            pageNumber={pageNumber}
                        />
                    </div>
                    <div className='col-md-4'>
                        <input 
                            className='form-control rounded-pill px-3 text-primary fw-bold' 
                            placeholder='Search by name or ID' 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className='col-md-4 text-end'>
                        <PageSizeSetter
                            setPageSize={setPageSize}
                            setTotalpage={setTotalPages}
                            totalrecord={totalElements}
                            pageSize={pageSize}
                            setPageNumber={setPageNumber}
                            className='small-page-size-setter'  // Custom class for smaller page size setter
                        />
                    </div>
                </div>
                <div className='row mb-4'>
                    <div className='col text-start'> {/* Moved to the left */}
                        <button className='btn btn-outline-primary fw-bold rounded-pill' onClick={() => setShow(true)}>
                            Add A New Plan
                        </button>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <Table 
                            data={filteredPlans}
                            isDeleteButton={true}
                            isUpdateButton={true}
                            deleteFun={handleDelete}
                            UpdateFun={handleUpdate}
                        />
                    </div>
                </div>
            </div>
            <Footer />

            {/* CSS for Uniform Layout */}
            <style jsx="true">{`
                .uniform-layout {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .row {
                    margin-bottom: 20px;
                }

                .form-control {
                    border: 2px solid #007bff;
                    padding: 12px 15px;
                    border-radius: 25px;
                    font-size: 16px;
                }

                .form-control:focus {
                    border-color: #0056b3;
                    outline: none;
                    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
                }

                .btn-outline-primary {
                    padding: 10px 20px;
                    font-size: 16px;
                    transition: background-color 0.3s ease, box-shadow 0.3s ease;
                }

                .btn-outline-primary:hover {
                    background-color: #007bff;
                    color: white;
                    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
                }

                .table {
                    width: 100%;
                    background-color: white;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                .table th, .table td {
                    padding: 15px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                }

                .table th {
                    background-color: #007bff;
                    color: white;
                }

                .table tbody tr:hover {
                    background-color: #f1f1f1;
                }

                .pagination-container {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }

                .page-number {
                    border: 1px solid #007bff;
                    padding: 8px 16px;
                    margin: 0 5px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }

                .page-number.active {
                    background-color: #007bff;
                    color: white;
                }

                .page-number:hover {
                    background-color: #0056b3;
                    color: white;
                }

                .small-page-size-setter {
                    width: 120px;  /* Reduced size */
                    padding: 5px 8px;
                }
            `}</style>
        </>
    );
};

export default AllPlans;
