import React from 'react';

const StaticTable = ({ data, UpdateFun, handleToggleStatus }) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Employee ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Mobile Number</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((employee) => (
                    <tr key={employee.employeeId}>
                        <td>{employee.employeeId}</td>
                        <td>{employee.firstName}</td>
                        <td>{employee.lastName}</td>
                        <td>{employee.mobileNumber}</td>
                        <td>{employee.salary}</td>
                        {/* Adjusting the condition to check for boolean and string values */}
                        <td>{employee.isActive === true || employee.isActive === 'true' ? 'Active' : 'Inactive'}</td>
                        <td>
                            <button
                                className="btn btn-sm btn-primary mx-2"
                                onClick={() => UpdateFun(employee)}
                            >
                                Edit
                            </button>
                            <button
                                className={`btn btn-sm ${employee.isActive === true || employee.isActive === 'true' ? 'btn-warning' : 'btn-success'} mx-2`}
                                onClick={() => handleToggleStatus(employee)}
                            >
                                {employee.isActive === true || employee.isActive === 'true' ? 'Deactivate' : 'Activate'}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default StaticTable;
