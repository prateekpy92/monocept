import React, { useEffect, useState } from 'react';
import { deleteEmployee, getAllEmployees, saveEmployee } from '../../services/admin/AdminServices';
import Navbar from '../shared/navbar/Navbar';
import CustomPagination from '../shared/page/CustomPagination'; // Updated to use CustomPagination
import PageSizeSetter from '../shared/page/PageSizeSetter';
import AddEmployee from './AddEmployee';
import { EditEmployeeService } from '../../services/employee/Employee';
import EditEmployee from './EditEmployee';
import axios from "axios";
import Footer from '../shared/footer/Footer'; // Importing Footer component

const AllEmployee = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(2);
    const [totalPages, setTotalPages] = useState(0); // Default to 0 to prevent undefined
    const [totalElements, setTotalElements] = useState(0);
    const [employeeData, setEmployeeData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [id, setId] = useState();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");  
    const [salary, setSalary] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [apartment, setApartment] = useState("");
    const [city, setCity] = useState("");  
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [show, setShow] = useState(false);
    const [add, setAdd] = useState(false);
    const [searchParams, setSearchParams] = useState(new URLSearchParams()); // For handling pagination params

    const data = {
        firstName,
        lastName,
        mobileNumber,
        salary,
        username,
        password,
        email,
        dateOfBirth,
        houseNo,
        apartment,
        city,
        state,
        pincode
    };

    const addEmployeeHandler = async () => {
        try {
            let response = await saveEmployee(data);
            console.log(response);
            alert("Successfully added");
            getEmployeesData(); // Refresh the employee list after adding
        } catch (error) {
            alert(error.message);
        }
    };

    const addEmployeeData = {
        firstName,
        setFirstName,
        lastName,
        setLastName,
        mobileNumber,
        setMobileNumber,
        salary,
        setSalary,
        username,
        setUsername,
        password,
        setPassword,
        email,
        setEmail,
        dateOfBirth,
        setDateOfBirth,
        houseNo,
        setHouseNo,
        apartment,
        setApartment,
        city,
        setCity,
        state,
        setState,
        pincode,
        setPincode,
        show: add,
        setShow: setAdd,
        addEmployeeHandler
    };

    const getEmployeesData = async () => {
        try {
            const response = await getAllEmployees(pageNumber, pageSize);
            console.log(response);
            setEmployeeData(response.data.content);
            setTotalPages(Math.ceil(parseInt(response.headers['employee-count']) / pageSize));
            setTotalElements(parseInt(response.headers['employee-count']));
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleDelete = async (employee) => {
        try {
            let response = await deleteEmployee(employee.employeeId);
            getEmployeesData(); // Refresh the employee list after deletion
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete employee: " + (error.response?.data?.message || error.message));
        }
    };

    const updateEmployee = (employee) => {
        setFirstName(employee.firstName);
        setLastName(employee.lastName);
        setEmail(employee.email);
        setMobileNumber(employee.mobileNumber);  
        setId(employee.employeeId);
        setShow(true);
    };

    const EditData = async () => {
        try {
            let response = await EditEmployeeService(
                id,
                firstName,
                lastName,
                mobileNumber,
                email,
                dateOfBirth
            );
            alert("Employee updated successfully!");
            getEmployeesData(); // Refresh employee data after update
        } catch (error) {
            alert(error.response);
        }
    };

    useEffect(() => {
        getEmployeesData();
    }, [pageNumber, pageSize]);

    const filteredEmployeeData = employeeData.filter(employee =>
        employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeId.toString().includes(searchQuery)
    );

    return (
        <>
            <Navbar />
            {show && (
                <EditEmployee
                    firstName={firstName}
                    lastName={lastName}
                    mobile={mobileNumber}  
                    email={email}
                    dob={dateOfBirth}
                    show={show}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setMobileNumber={setMobileNumber}  
                    setEmail={setEmail}
                    setDob={setDateOfBirth}
                    setShow={setShow}
                    editData={EditData}
                />
            )}
            {add && (
                <AddEmployee data={addEmployeeData} />
            )}
            <div className='background2 text-center display-3 py-3 text-white fw-bold'>All Employees</div>
            <div className='container'>
                <div className='row align-items-center my-4'>
                    <div className='col-md-4'>
                        <input
                            className='form-control rounded-pill px-3 text-primary fw-bold'
                            placeholder='Search by ID or Name'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className='col-md-4 text-center'>
                        <button className='btn btn-primary rounded-pill px-4 fw-bold'
                            onClick={() => setAdd(true)}
                        >
                            Add A New Employee
                        </button>
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
                    <div className='col-12'>
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th>EMPLOYEE ID</th>
                                    <th>FIRST NAME</th>
                                    <th>LAST NAME</th>
                                    <th>EMAIL</th>
                                    <th>MOBILE NUMBER</th>
                                    <th>DATE OF BIRTH</th>
                                    <th>PINCODE</th>
                                    <th>SALARY</th>
                                    <th>JOINING DATE</th>
                                    <th>STATUS</th>
                                    <th>UPDATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployeeData.length > 0 ? (
                                    filteredEmployeeData.map((employee, index) => (
                                        <tr key={index}>
                                            <td>{employee.employeeId}</td>
                                            <td>{employee.firstName}</td>
                                            <td>{employee.lastName}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.mobileNumber}</td>
                                            <td>{employee.dateOfBirth || 'N/A'}</td>
                                            <td>{employee.pincode || 'N/A'}</td>
                                            <td>{employee.salary || 'N/A'}</td>
                                            <td>{employee.joiningDate || 'N/A'}</td>
                                            <td>{employee.status || 'N/A'}</td>
                                            <td>
                                                <button 
                                                    className='btn btn-primary'
                                                    onClick={() => updateEmployee(employee)}
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">No Employees Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Adding Custom Pagination */}
            <div className='row justify-content-center my-4'>
                <div className='col-auto'>
                    <CustomPagination 
                        data={{ totalPages, page: pageNumber }} 
                        searchParams={searchParams} 
                        setSearchParams={(updatedParams) => {
                            const newParams = new URLSearchParams(updatedParams);
                            setSearchParams(newParams);
                            setPageNumber(parseInt(newParams.get('page')));
                        }}
                    />
                </div>
            </div>
            {/* Adding Footer */}
            <Footer /> 
            <style jsx="true">{`
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .form-control {
                    border: 2px solid #007bff;
                    padding: 10px;
                    border-radius: 25px;
                    font-size: 16px;
                }

                .form-control:focus {
                    border-color: #0056b3;
                    outline: none;
                }

                .btn-primary {
                    padding: 10px 20px;
                    font-size: 16px;
                    transition: background-color 0.3s ease;
                }

                .btn-primary:hover {
                    background-color: #007bff;
                    color: white;
                }

                .table {
                    width: 100%;
                    margin-top: 20px;
                    background-color: white;
                }

                .table th, .table td {
                    padding: 12px;
                    text-align: center;
                    border: 1px solid #ddd;
                }

                .table-hover tbody tr:hover {
                    background-color: #f1f1f1;
                }

                .thead-light th {
                    background-color: #f8f9fa;
                }
            `}</style>
        </>
    );
};

export default AllEmployee;
