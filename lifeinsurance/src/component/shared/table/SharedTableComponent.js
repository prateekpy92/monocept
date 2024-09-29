// SharedTableComponent.jsx
import React from 'react';
import PropTypes from 'prop-types';

const SharedTableComponent = ({ columns, data, actions }) => {
  return (
    <table className="table table-bordered table-hover">
      <thead className="thead-dark">
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.headerName}</th>
          ))}
          {actions && <th>Actions</th>} {/* Display actions column if actions are provided */}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{row[column.field]}</td>
              ))}
              {actions && (
                <td>
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className={`btn btn-${action.type} m-1`}
                      onClick={() => action.onClick(row)}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
              No Data Available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

SharedTableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  actions: PropTypes.array, // Optional for actions like edit/delete
};

export default SharedTableComponent;
