import React from 'react';

const AgentTable = ({ data, updateAgent }) => {
  return (
    <div style={{ overflowX: 'auto' }}> {/* Wrapper for horizontal scrolling */}
      <table className="table table-sm table-bordered shadow-lg table-info" style={{ fontSize: '12px', tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Commission</th>
            <th>Status</th>
            <th>Username</th>
            <th>Actions</th> {/* Only Edit button remains here */}
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.id}</td>
              <td>{agent.firstName}</td>
              <td>{agent.lastName}</td>
              <td>{agent.mobileNumber}</td>
              <td>{agent.email}</td>
              <td>{agent.dateOfBirth}</td>
              <td>{agent.commission}</td>
              <td>{agent.status}</td>
              <td>{agent.username}</td>
              <td>
                {/* Edit button */}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm ml-2"
                  onClick={() => updateAgent(agent)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentTable;
